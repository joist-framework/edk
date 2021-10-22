import { animate } from '../utils/animate';

export class ModalController<R = any, T extends HTMLElement = HTMLElement> {
  private resolve: (value?: R) => void = () => void 0;

  modal: HTMLElement;

  result = new Promise<R | undefined>((resolve) => {
    this.resolve = resolve;
  });

  constructor(Modal: new (...args: any[]) => T, public modalRoot: HTMLElement) {
    this.modal = new Modal(this);

    this.modalRoot.appendChild(this.modal);

    animate(this.modal, 'modal-enter').then(() => {
      this.modal.dispatchEvent(new Event('modalafterenter'));
    });
  }

  close(value?: R) {
    this.resolve(value);

    return animate(this.modal, 'modal-exit').then(() => {
      if (this.modalRoot.contains(this.modal)) {
        this.modalRoot.removeChild(this.modal);
      }
    });
  }
}
