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

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.listContainer = this.querySelector('[slot="list"]')!;

    const root = this.shadowRoot!;

    root.appendChild(Template.content.cloneNode(true));

    this.addEventListener('input', async (e) => {
      const input = e.target as HTMLInputElement;

      this.listContainer!.innerHTML = '';

      this.focusedIndex = null;

      const filteredItems = await this.search(input.value);

      filteredItems.forEach((item) => {
        this.listContainer!.appendChild(this.createItem(item));
      });
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

  onKeyDown(e: KeyboardEvent) {
    const key = e.key.toUpperCase();

    if (['ARROWDOWN', 'ARROWUP'].includes(key)) {
      e.preventDefault();

      const focusable = getFocusableEls(this.listContainer!);

      switch (key) {
        case 'ARROWDOWN':
          if (this.focusedIndex === null) {
            this.focusedIndex = 0;
          } else {
            this.focusedIndex = this.focusedIndex + 1;
          }

          focusable[this.focusedIndex]!.focus();

          break;

        case 'ARROWUP':
          if (this.focusedIndex !== null && this.focusedIndex > 0) {
            this.focusedIndex = this.focusedIndex - 1;
            focusable[this.focusedIndex]!.focus();
          }

          break;
      }
    }
  }
}
