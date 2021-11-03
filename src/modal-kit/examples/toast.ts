import { render, html } from 'lit-html';
import { ModalController } from '../modal-controller';

export class ToastElement extends ModalController<FormData> {
  connectedCallback() {
    this.render();
  }

  private render() {
    return render(this.template(), this);
  }

  private template() {
    return html`Thiis is a toast message! <button @click=${() => this.close()}>X</button>`;
  }
}
