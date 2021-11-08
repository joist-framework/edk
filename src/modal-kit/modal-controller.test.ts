import { expect } from '@open-wc/testing';

import { ModalController, WithModal } from './modal-controller';

describe('ModalController', () => {
  it('should apply a modal controller with Mixin', async () => {
    const Modal = WithModal<string>(HTMLElement);
    customElements.define('modal-controller-test', Modal);

    const { controller } = new Modal();

    controller.open();
    controller.close('Hello World');

    const res = await controller.result;

    expect(res).to.equal('Hello World');
  });

  it('should resolve the result to the value passed when closing', async () => {
    const modal = document.createElement('div');

    const controller = new ModalController(modal);
    controller.open();
    controller.close('Hello World');

    const res = await controller.result;

    expect(res).to.equal('Hello World');
  });

  it('should dispatch modalopened event', async () => {
    const modal = document.createElement('div');
    modal.dataset.modal = 'true';

    const controller = new ModalController(modal);

    return new Promise((resolve) => {
      modal.addEventListener('modalopen', (e) => {
        const target = e.target as HTMLElement;

        expect(target.dataset.modal).to.equal('true');

        resolve();
      });

      controller.open();
    });
  });

  it('should dispatch aftermodalopened event', async () => {
    const modal = document.createElement('div');
    modal.dataset.modal = 'true';

    const controller = new ModalController(modal);

    return new Promise((resolve) => {
      modal.addEventListener('modalafteropen', (e) => {
        const target = e.target as HTMLElement;

        expect(target.dataset.modal).to.equal('true');

        resolve();
      });

      controller.open();
    });
  });

  it('should dispatch modalclosed event', async () => {
    const modal = document.createElement('div');
    modal.dataset.modal = 'true';

    const controller = new ModalController(modal);

    return new Promise((resolve) => {
      modal.addEventListener('modalclose', (e) => {
        const target = e.target as HTMLElement;

        expect(target.dataset.modal).to.equal('true');

        resolve();
      });

      controller.open();
      controller.close();
    });
  });
});
