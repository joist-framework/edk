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

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.verifyRequiredSlots();

    const root = this.shadowRoot!;

    root.appendChild(Template.content.cloneNode(true));

    const container = this.querySelector('[slot="list"]')!;

    this.addEventListener('input', async (e) => {
      const input = e.target as HTMLInputElement;

      container.innerHTML = '';

      const filteredItems = await this.search(input.value);

      filteredItems.forEach((item) => {
        container.appendChild(this.createItem(item));
      });
    });
  }

  createItem(item: string): HTMLElement {
    const el = document.createElement('div');
    el.innerHTML = item;

    return el;
  }

  async search(val: string) {
    return this.items.filter((item) => item.toLowerCase().startsWith(val.toLowerCase()));
  }
}
