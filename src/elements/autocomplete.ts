import { PropChanges, property } from '@joist/component';
import { render, html } from 'lit-html';

export class AutocompleteElement extends PropChanges(HTMLElement) {
  items: string[] = [];

  @property()
  filteredItems: string[] = [];

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();

    this.addEventListener('input', async (e) => {
      const input = e.target as HTMLInputElement;

      this.filteredItems = await this.search(input.value);
    });
  }

  onPropChanges() {
    console.log(this.filteredItems);
    this.render();
  }

  async search(val: string) {
    return this.items.filter((item) => item.toLowerCase().startsWith(val.toLowerCase()));
  }

  private template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
      </style>

      <slot name="input"></slot>

      <ul class="autocomplete-list">
        ${this.filteredItems.map((item) => html`<li>${item}</li>`)}
      </ul>
    `;
  }

  private render() {
    render(this.template(), this.shadowRoot!);
  }
}
