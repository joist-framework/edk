import { expect } from '@open-wc/testing';

import { ModalController } from './modal-controller';

customElements.define('modal-controller-test', ModalController);

describe('ModalController', () => {
  it('should insert a modal into the defined container', () => {
    const container = document.createElement('div');
    const controller = new ModalController();

    controller.open(container);

    expect(container.contains(controller)).to.equal(true);
  });

  it('should remove a modal from the defined container', async () => {
    const container = document.createElement('div');
    const controller = new ModalController();

    controller.open(container);

    await controller.close();

    expect(container.contains(controller)).to.equal(false);
  });

  it('should resolve the result to the value passed when closing', async () => {
    const container = document.createElement('div');
    const controller = new ModalController<string>();

    controller.open(container);

    controller.close('Hello World');

    const res = await controller.result;

    expect(res).to.equal('Hello World');
  });

  it('should dispatch modalopened event', async () => {
    const container = document.createElement('div');
    const controller = new ModalController<string>();

    return new Promise((resolve) => {
      controller.addEventListener('modalopened', (e) => {
        const target = e.target as HTMLElement;

        expect(target.tagName).to.equal('MODAL-CONTROLLER-TEST');

        resolve();
      });

      controller.open(container);
    });
  });

  it('should dispatch aftermodalopened event', async () => {
    const container = document.createElement('div');
    const controller = new ModalController<string>();

    return new Promise((resolve) => {
      controller.addEventListener('modalafteropened', (e) => {
        const target = e.target as HTMLElement;

        expect(target.tagName).to.equal('MODAL-CONTROLLER-TEST');

        resolve();
      });

      controller.open(container);
    });
  });

  it('should dispatch modalclosed event', async () => {
    const container = document.createElement('div');
    const controller = new ModalController<string>();

    return new Promise((resolve) => {
      controller.addEventListener('modalclosed', (e) => {
        const target = e.target as HTMLElement;

        expect(target.tagName).to.equal('MODAL-CONTROLLER-TEST');

        resolve();
      });

      controller.open(container);
      controller.close();
    });
  });
});
