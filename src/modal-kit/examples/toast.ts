import { render, html } from 'lit-html';
import { WithModal } from '../modal-controller';

const Toast = WithModal({ closeOnEsc: true, captureFocus: true });

export class ToastElement extends Toast(HTMLElement) {
  connectedCallback() {
    this.render();
  }

  private render() {
    return render(this.template(), this);
  }

  private template() {
    return html`Thiis is a toast message!
      <button @click=${() => this.controller.close()}>X</button>`;
  }
}
