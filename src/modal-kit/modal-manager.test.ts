import { expect } from '@open-wc/testing';

import { ModalController } from './modal-controller.js';
import { ModalManager } from './modal-manager.js';

class ModalManagerTest extends ModalController {
  foo: string = '';
  bar: string = '';
}

customElements.define('modal-manager-test', ModalManagerTest);

describe('ModalController', () => {
  it('should insert a modal into the defined container', () => {
    const container = document.createElement('div');
    const manager = new ModalManager(container);
    const controller = manager.open(ModalManagerTest);

    expect(container.contains(controller)).to.equal(true);
  });

  it('should apply correct props to the controller', () => {
    const container = document.createElement('div');
    const manager = new ModalManager(container);
    const controller = manager.open(ModalManagerTest, { foo: 'Hello', bar: 'World' });

    expect(controller.foo).to.equal('Hello');
    expect(controller.bar).to.equal('World');
  });

  it('should apply and overlay', () => {
    const container = document.createElement('div');
    const manager = new ModalManager(container, { showOverlay: true });

    manager.open(ModalManagerTest, { foo: 'Hello', bar: 'World' });

    const overlay = container.querySelectorAll('.modal-overlay');

    expect(overlay.length).to.equal(1);
  });

  it('should apply a single overlay for n modals', () => {
    const container = document.createElement('div');
    const manager = new ModalManager(container, { showOverlay: true });

    manager.open(ModalManagerTest, { foo: 'Hello', bar: 'World' });
    manager.open(ModalManagerTest, { foo: 'Hello', bar: 'World' });

    const overlay = container.querySelectorAll('.modal-overlay');

    expect(overlay.length).to.equal(1);
  });

  it('should apply remove the modal overlay once there are no more modals', async () => {
    const container = document.createElement('div');
    const manager = new ModalManager(container, { showOverlay: true });

    const controller1 = manager.open(ModalManagerTest, { foo: 'Hello', bar: 'World' });
    const controller2 = manager.open(ModalManagerTest, { foo: 'Hello', bar: 'World' });

    expect(container.querySelectorAll('.modal-overlay').length).to.equal(1);

    await controller1.close();

    expect(container.querySelectorAll('.modal-overlay').length).to.equal(1);

    await controller2.close();

    expect(container.querySelectorAll('.modal-overlay').length).to.equal(0);
  });
});
