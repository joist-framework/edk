import { animate } from '../utils/animate';

export class ModalController<R = any, T extends HTMLElement = HTMLElement> {
  modal: HTMLElement;

  private resolve: (value?: R) => void = () => void 0;

  result = new Promise<R | undefined>((resolve) => {
    this.resolve = resolve;
  });

  constructor(Modal: new (...args: any[]) => T, public modalRoot: HTMLElement) {
    this.modal = new Modal(this);

    this.modalRoot.appendChild(this.modal);

    animate(this.modal, 'modal-enter');
  }

  close(value?: R) {
    this.resolve(value);

    animate(this.modal, 'modal-exit').then(() => {
      this.modalRoot.removeChild(this.modal);
    });
  }
}
