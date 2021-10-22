import { expect } from '@open-wc/testing';
import { ModalController } from './modal-controller';

describe('ModalController', () => {
  it('should create a controller and a modal element', () => {
    class TestModal extends HTMLElement {}
    customElements.define('modal-controller-test-1', TestModal);

    const controller = new ModalController(TestModal, document.body);

    expect(controller.modal.tagName.toLowerCase()).to.equal('modal-controller-test-1');
  });
});
