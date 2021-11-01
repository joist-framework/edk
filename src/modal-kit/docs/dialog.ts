import { html, render } from 'lit-html';

import { ModalManager } from '../modal-manager';
import { ModalController } from '../modal-controller';

export const manager = new ModalManager(document.body, { showOverlay: true });

export class MyDialog extends ModalController<FormData> {
  captureFocus = true;
  closeOnEsc = true;
  fname = '';
  lname = '';

  connectedCallback() {
    this.render();
  }

  private render() {
    render(this.template(), this);
  }

  private template() {
    return html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault();

          this.close(new FormData(e.target as HTMLFormElement));
        }}
      >
        <input name="fname" placeholder="First name" .value=${this.fname} />

        <input name="lname" placeholder="Last name" />

        <button>Submit</button>
      </form>
    `;
  }
}

customElements.define('my-dialog', MyDialog);

export async function openModal() {
  const controller = await manager.open(MyDialog, {
    fname: 'Danny',
  });

  const res = await controller.result;

  console.log('####', res ? Array.from(res).map((v) => v[1]) : []);
}
