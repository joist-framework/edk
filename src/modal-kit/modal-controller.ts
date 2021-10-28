import { animate } from '../utils/animate';

export class ModalController<R = any> extends HTMLElement {
  private resolve: (value?: R) => void = () => void 0;
  private modalRoot?: HTMLElement;

  closeOnEsc: boolean = true;

  result = new Promise<R | undefined>((resolve) => {
    this.resolve = resolve;
  });

  open(root: HTMLElement): void {
    this.modalRoot = root;

    if (!this.modalRoot.contains(this)) {
      this.modalRoot.appendChild(this);

      animate(this, 'modal-enter');
    }
  }

  async close(value?: R) {
    this.resolve(value);

    return animate(this, 'modal-exit').then(() => {
      if (this.modalRoot && this.modalRoot.contains(this)) {
        this.modalRoot.removeChild(this);
      }

      return this;
    });
  }
}
