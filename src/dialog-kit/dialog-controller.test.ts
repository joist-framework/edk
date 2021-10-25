import { expect } from '@open-wc/testing';

import { DialogController } from './dialog-controller';

customElements.define('modal-controller-test', DialogController);

describe('DialogController', () => {
  it('should insert a modal into the defined container', () => {
    const container = document.createElement('div');
    const controller = new DialogController();

    controller.open(container);

    expect(container.contains(controller)).to.equal(true);
  });

  it('should remove a modal from the defined container', async () => {
    const container = document.createElement('div');
    const controller = new DialogController();

    controller.open(container);

    await controller.close();

    expect(container.contains(controller)).to.equal(false);
  });

  it('should resolve the result to the value passed when closing', async () => {
    const container = document.createElement('div');
    const controller = new DialogController<string>();

    controller.open(container);

    controller.close('Hello World');

    const res = await controller.result;

    expect(res).to.equal('Hello World');
  });
});
