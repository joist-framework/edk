import { expect } from '@open-wc/testing';

import { WithModal } from './modal-controller';

const Modal = WithModal<string>({})(HTMLElement);
customElements.define('modal-controller-test', WithModal({})(HTMLElement));

describe('ModalController', () => {
  it('should resolve the result to the value passed when closing', async () => {
    const modal = new Modal();

    modal.controller.open();
    modal.controller.close('Hello World');

    const res = await modal.controller.result;

    expect(res).to.equal('Hello World');
  });

  it('should dispatch modalopened event', async () => {
    const modal = new Modal();

    return new Promise((resolve) => {
      modal.addEventListener('modalopen', (e) => {
        const target = e.target as HTMLElement;

        expect(target.tagName).to.equal('MODAL-CONTROLLER-TEST');

        resolve();
      });

      modal.controller.open();
    });
  });

  it('should dispatch aftermodalopened event', async () => {
    const modal = new Modal();

    return new Promise((resolve) => {
      modal.addEventListener('modalafteropen', (e) => {
        const target = e.target as HTMLElement;

        expect(target.tagName).to.equal('MODAL-CONTROLLER-TEST');

        resolve();
      });

      modal.controller.open();
    });
  });

  it('should dispatch modalclosed event', async () => {
    const modal = new Modal();

    return new Promise((resolve) => {
      modal.addEventListener('modalclose', (e) => {
        const target = e.target as HTMLElement;

        expect(target.tagName).to.equal('MODAL-CONTROLLER-TEST');

        resolve();
      });

      modal.controller.open();
      modal.controller.close();
    });
  });
});
