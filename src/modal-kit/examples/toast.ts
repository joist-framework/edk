import { render, html } from 'lit-html';
import { WithModal } from '../modal-controller';

export class ToastElement extends WithModal(HTMLElement) {
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
