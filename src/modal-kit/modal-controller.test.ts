import { expect } from '@open-wc/testing';
import { ModalController } from './modal-controller';

class TestModal extends HTMLElement {}
customElements.define('modal-controller-test', TestModal);

describe('ModalController', () => {
  it('should create a controller and a modal element', () => {
    const container = document.createElement('div');
    const controller = new ModalController(TestModal, container);

    expect(controller.modal.tagName.toLowerCase()).to.equal('modal-controller-test');
  });

  it('should insert a modal into the defined container', () => {
    const container = document.createElement('div');
    const controller = new ModalController(TestModal, container);

    expect(container.contains(controller.modal)).to.equal(true);
  });

  it('should remove a modal from the defined container', async () => {
    const container = document.createElement('div');
    const controller = new ModalController(TestModal, container);

    await controller.close();

    expect(container.contains(controller.modal)).to.equal(false);
  });

  it('should resolve the result to the value passed when closing', async () => {
    const container = document.createElement('div');
    const controller = new ModalController(TestModal, container);

    controller.close('Hello World');

    const res = await controller.result;

    expect(res).to.equal('Hello World');
  });
});
