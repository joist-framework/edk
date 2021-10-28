import { animate } from '../utils/animate.js';

export class ModalEvent extends Event {}

export class ModalController<R = any> extends HTMLElement {
  private resolve: (value?: R) => void = () => void 0;
  private modalRoot?: HTMLElement;

  public closeOnEsc: boolean = false;
  public result = new Promise<R | undefined>((resolve) => {
    this.resolve = resolve;
  });

  open(root: HTMLElement): void {
    this.modalRoot = root;

    if (!this.modalRoot.contains(this)) {
      this.modalRoot.appendChild(this);

      animate(this, 'modal-enter').then(() => {
        this.dispatchEvent(new ModalEvent('modalafteropened'));
      });

      this.dispatchEvent(new ModalEvent('modalopened'));
    }
  }

  async close(value?: R) {
    this.resolve(value);

    return animate(this, 'modal-exit').then(() => {
      if (this.modalRoot && this.modalRoot.contains(this)) {
        this.modalRoot.removeChild(this);
      }

      this.dispatchEvent(new ModalEvent('modalclosed'));

      return this;
    });
  }
}
