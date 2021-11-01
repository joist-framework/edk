import { html, render } from 'lit-html';

import { ModalController } from '../modal-controller';
import { ModalManager } from '../modal-manager';

const modal = new ModalManager(document.body, { showOverlay: false });

class ToastElement extends ModalController<FormData> {
  connectedCallback() {
    this.render();
  }

  private render() {
    return render(this.template(), this);
  }

  private template() {
    return html`
      <span>Thiis is a toast message!</span>

      <button @click=${() => this.close()}>X</button>
    `;
  }
}

customElements.define('app-toast', ToastElement);

export async function addToast() {
  const controller = await modal.open(ToastElement, { closeOnEsc: false });
  const res = await controller.result;

  console.log('####', res);
}
