import { Meta } from '@storybook/web-components';
import { html } from 'lit-html';

import { DialogElement } from './examples/dialog';
import { ToastElement } from './examples/toast';
import { ModalManager } from './modal-manager';

export default {
  title: 'modal',
} as Meta;

customElements.define('my-dialog', DialogElement);
customElements.define('app-toast', ToastElement);

export const Dialog = () => {
  const modalRoot = document.createElement('div');
  const modal = new ModalManager(modalRoot, { showOverlay: true, freezeScroll: true });

  async function openModal() {
    const el = modal.open(DialogElement, { fname: 'Danny' });
    const res = await el.controller.result;

    console.log('####', res);
  }

  return html`
    <style>
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

    ${modalRoot}
  `;
};

export const Toast = () => {
  const modalRoot = document.createElement('div');
  const toast = new ModalManager(modalRoot, { showOverlay: false });

  async function openModal() {
    toast.open(ToastElement);
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

    ${modalRoot}
  `;
};
