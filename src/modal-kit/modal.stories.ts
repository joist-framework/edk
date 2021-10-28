import { Meta } from '@storybook/web-components';
import { html, render, TemplateResult } from 'lit-html';

import { ModalController } from './modal-controller';
import { ModalManager } from './modal-manager';

export default {
  title: 'modal',
} as Meta;

class MyDialog extends ModalController<FormData> {
  fname: string = '';
  lname: string = '';

  connectedCallback() {
    this.renderer(this.render());
  }

  private onClose(e: Event) {
    e.preventDefault();

    this.close(new FormData(e.target as HTMLFormElement));
  }

  private renderer(res: TemplateResult) {
    return render(res, this);
  }

  private render() {
    return html`
      <form @submit=${this.onClose.bind(this)}>
        <input name="fname" placeholder="First name" .value=${this.fname} />

        <input name="lname" placeholder="Last name" />

        <button>Submit</button>
      </form>
    `;
  }
}

customElements.define('my-dialog', MyDialog);

export const Dialog = () => {
  const modal = new ModalManager(document.body, { showOverlay: true });

  async function openModal() {
    const controller = await modal.open(MyDialog, { fname: 'Danny' });
    const res = await controller.result;

    console.log('####', res);
  }

  return html`
    <style>
      my-dialog {
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

      .modal-overlay {
        background: rgba(0, 0, 0, 0.2);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
      }

      .modal-overlay-enter,
      .modal-enter {
        animation: fadein 0.3s;
      }

      .modal-overlay-exit,
      .modal-exit {
        animation: fadeout 0.2s;
      }

      @keyframes fadein {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }

      @keyframes fadeout {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    </style>

    <button @click="${openModal}">Open</button>
  `;
};

class ToastElement extends ModalController<FormData> {
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

customElements.define('app-toast', ToastElement);

export const Toast = () => {
  const modal = new ModalManager(document.body, { showOverlay: false });

  async function openModal() {
    const controller = await modal.open(ToastElement);
    const res = await controller.result;

    console.log('####', res);
  }

  return html`
    <style>
      app-toast {
        font-family: Arial, Helvetica, sans-serif;
        border-radius: 4px;
        background: green;
        box-shadow: 0 8px 40px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        padding: 1rem;
        z-index: 1001;
        color: #fff;
        margin-top: 1rem;
      }

      .modal-enter {
        animation: fadein 0.3s;
      }

      .modal-exit {
        animation: fadeout 0.2s;
      }

      @keyframes fadein {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }

      @keyframes fadeout {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    </style>

    <button @click="${openModal}">Open</button>
  `;
};
