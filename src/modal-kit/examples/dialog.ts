import { html, render } from 'lit-html';

import { ModalController } from '../modal-controller';

export class MyDialog extends ModalController<FormData> {
  fname: string = '';
  lname: string = '';
  closeOnEsc = true;
  captureFocus = true;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private onClose(e: Event) {
    e.preventDefault();

    this.close(new FormData(e.target as HTMLFormElement));
  }

  private render() {
    return render(this.template(), this.shadowRoot!);
  }

  private template() {
    return html`
      <style>
        :host {
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 8px 40px 0 rgba(0, 0, 0, 0.1);
          display: block;
          position: fixed;
          padding: 40px;
          top: 10vh;
          z-index: 1001;
          left: 50%;
          transform: translate(-50%);
          max-height: 80vh;
          z-index: 1001;
        }

        input {
          padding: 0.5rem 1rem;
          display: block;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
      </style>

      <form @submit=${this.onClose.bind(this)}>
        <input name="fname" placeholder="First name" .value=${this.fname} />

        <input name="lname" placeholder="Last name" />

        <button>Submit</button>
      </form>
    `;
  }
}
