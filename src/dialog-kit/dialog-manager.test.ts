import { expect } from '@open-wc/testing';

import { DialogController } from './dialog-controller';
import { DialogManager } from './dialog-manager';

class DialogManagerTest extends DialogController {
  foo: string = '';
  bar: string = '';
}

customElements.define('modal-manager-test', DialogManagerTest);

describe('DialogController', () => {
  it('should insert a modal into the defined container', () => {
    const container = document.createElement('div');
    const manager = new DialogManager(container);
    const controller = manager.open(DialogManagerTest);

    expect(container.contains(controller)).to.equal(true);
  });

  it('should apply correct props to the controller', () => {
    const container = document.createElement('div');
    const manager = new DialogManager(container);
    const controller = manager.open(DialogManagerTest, { foo: 'Hello', bar: 'World' });

    expect(controller.foo).to.equal('Hello');
    expect(controller.bar).to.equal('World');
  });

  it('should apply and overlay', () => {
    const container = document.createElement('div');
    const manager = new DialogManager(container, { showOverlay: true });

    manager.open(DialogManagerTest, { foo: 'Hello', bar: 'World' });

    const overlay = container.querySelectorAll('.modal-overlay');

    expect(overlay.length).to.equal(1);
  });

  it('should apply a single overlay for n modals', () => {
    const container = document.createElement('div');
    const manager = new DialogManager(container, { showOverlay: true });

    manager.open(DialogManagerTest, { foo: 'Hello', bar: 'World' });
    manager.open(DialogManagerTest, { foo: 'Hello', bar: 'World' });

    const overlay = container.querySelectorAll('.modal-overlay');

    expect(overlay.length).to.equal(1);
  });

  it('should apply remove the modal overlay once there are no more modals', async () => {
    const container = document.createElement('div');
    const manager = new DialogManager(container, { showOverlay: true });

    const controller1 = manager.open(DialogManagerTest, { foo: 'Hello', bar: 'World' });
    const controller2 = manager.open(DialogManagerTest, { foo: 'Hello', bar: 'World' });

    expect(container.querySelectorAll('.modal-overlay').length).to.equal(1);

    await controller1.close();

    expect(container.querySelectorAll('.modal-overlay').length).to.equal(1);

    await controller2.close();

    expect(container.querySelectorAll('.modal-overlay').length).to.equal(0);
  });
});
