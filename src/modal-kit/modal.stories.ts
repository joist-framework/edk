import { Meta } from '@storybook/web-components';
import { html, render } from 'lit-html';

import { ModalController } from './modal-controller';
import { ModalManager } from './modal-manager';

export default {
  title: 'modal',
} as Meta;

class MyModal extends HTMLElement {
  constructor(private controller: ModalController) {
    super();
  }

  connectedCallback() {
    render(
      html`
        <form @submit=${this.onClose.bind(this)}>
          <input name="fname" />

          <button>Close</button>
        </form>
      `,
      this
    );
  }

  private onClose(e: Event) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);

    this.controller.close(form.get('fname'));
  }
}

customElements.define('test-modal', MyModal);

export const Default = () => {
  const modal = new ModalManager(document.body);

  async function openModal() {
    const controller = modal.open(MyModal);

    const res = await controller.result;

    console.log('####', res);
  }

  return html`
    <style>
      test-modal {
        background: #fff;
        box-shadow: 0px 0px 10px #000;
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
