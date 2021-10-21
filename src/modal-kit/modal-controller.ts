import { animate } from '../utils/animate';

export class ModalController<T extends HTMLElement = HTMLElement, R = any> {
  modal: HTMLElement;

  private resolve: (value: R | undefined) => void = () => void 0;

  result = new Promise<R | undefined>((resolve) => {
    this.resolve = resolve;
  });

  constructor(Modal: new (...args: any[]) => T, public modalRoot: HTMLElement) {
    this.modal = new Modal(this);

    animate(this.modal, 'modal-enter');
  }

  close(value: R | undefined) {
    this.resolve(value);

    animate(this.modal, 'modal-exit').then(() => {
      this.modalRoot.removeChild(this.modal);
    });
  }
}
