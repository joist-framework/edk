import { html, css, LitElement } from 'lit';

import { WithModal } from '../modal-controller';

function DialogElement<T>() {
  return WithModal<T>(LitElement, { closeOnEsc: true, captureFocus: true, freezeScroll: true });
}

export class MyDialog extends DialogElement<FormData>() {
  static get styles() {
    return css`
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
    `;
  }

  fname: string = '';
  lname: string = '';

  private onClose(e: Event) {
    e.preventDefault();

    this.controller.close(new FormData(e.target as HTMLFormElement));
  }

  render() {
    return html`
      <form @submit=${this.onClose.bind(this)}>
        <input name="fname" placeholder="First name" .value=${this.fname} />

        <input name="lname" placeholder="Last name" />

        <button>Submit</button>
      </form>
    `;
  }
}
