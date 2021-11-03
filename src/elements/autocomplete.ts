import { getFocusableEls } from '../utils';
import { RequieSlots } from '../utils/require-slots';

const Template = document.createElement('template');
Template.innerHTML = /* html */ `
  <style>
    :host {
      display: inline-block;
    }
  </style>
  
  <slot name="input"></slot>

  <slot name="list"></slot>
`;

export class AutocompleteElement extends RequieSlots(HTMLElement, ['input', 'list']) {
  items: string[] = [];

  private focusedIndex: number | null = null;
  private listContainer: HTMLElement | null = null;
  private input: HTMLInputElement | null = null;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const root = this.shadowRoot!;

    root.appendChild(Template.content.cloneNode(true));

    this.input = this.querySelector('[slot="input"]')!;
    this.listContainer = this.querySelector('[slot="list"]')!;

    this.addEventListener('input', async (e) => {
      const input = e.target as HTMLInputElement;

      this.focusedIndex = null;

      this.listContainer!.innerHTML = '';

      const filteredItems = await this.search(input.value);

      filteredItems.forEach((item) => {
        const el = this.createItem(item);

        el.dataset.value = item;

        this.listContainer!.appendChild(el);
      });
    });

    this.addEventListener('focusout', () => {
      setTimeout(() => {
        // This needs to be in a timeout so that it runs as part of the next loop.
        // the active element will not be set until after all of the focus and blur events are done
        if (!this.contains(document.activeElement)) {
          this.listContainer!.innerHTML = '';
        }
      }, 0);
    });

    this.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  createItem(item: string): HTMLElement {
    const el = document.createElement('div');
    el.innerHTML = item;

    return el;
  }

  async search(val: string) {
    return this.items.filter((item) => item.toLowerCase().startsWith(val.toLowerCase()));
  }

  private onKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    const key = e.key.toUpperCase();
    const focusable = getFocusableEls(this.listContainer!);

    switch (key) {
      case 'ARROWDOWN':
        e.preventDefault();

        if (this.focusedIndex === null) {
          this.focusedIndex = 0;
        } else {
          this.focusedIndex = this.focusedIndex + 1;
        }

        const focusableItem = focusable[this.focusedIndex];

        if (focusableItem) {
          focusable[this.focusedIndex]!.focus();
        }

        break;

      case 'ARROWUP':
        e.preventDefault();

        if (this.focusedIndex !== null && this.focusedIndex > 0) {
          this.focusedIndex = this.focusedIndex - 1;

          const focusableItem = focusable[this.focusedIndex];

          if (focusableItem) {
            focusable[this.focusedIndex]!.focus();
          }
        }

        break;

      case 'ENTER':
        e.preventDefault();

        this.input!.value = target.dataset.value || '';
        this.listContainer!.innerHTML = '';

        break;
    }
  }
}
