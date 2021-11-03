import { getFocusableEls } from '../utils';

const ListItemTemplate = document.createElement('template');
ListItemTemplate.innerHTML = /*html*/ `
  <style>
    ::slotted(input) {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    ::slotted(input):focus ~ .tx-radio__checkmark {
      outline: none;
      box-shadow: var(--tx-input-focus-shadow);
    }
  </style>

  <label>
    <slot></slot>
  </label>
`;

export class ListItemElement extends HTMLElement {
  constructor() {
    super();

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = this.getAttribute('name') || '';
    input.slot = 'input';

    this.appendChild(input);

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.appendChild(ListItemTemplate.content.cloneNode(true));
  }
}

export class ListElement extends HTMLElement {
  focusedIndex: number | null = null;
  focusableEls: any;

  connectedCallback() {
    this.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  private onKeyDown(e: KeyboardEvent) {
    const key = e.key.toUpperCase();
    const focusable = getFocusableEls(this);

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

        break;
    }
  }
}
