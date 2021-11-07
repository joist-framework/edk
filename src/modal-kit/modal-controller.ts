import { animate } from '../utils/animate';

export class ModalEvent extends Event {}

export interface Modal<T = any> {
  controller: ModalController<T>;
}

export interface ModalControllerConfig {
  closeOnEsc: boolean;
  captureFocus: boolean;
}

export class ModalController<R = any> implements ModalControllerConfig {
  private resolve: (value?: R) => void = () => void 0;

  public closeOnEsc = false;
  public captureFocus = false;

  public readonly result = new Promise<R | undefined>((resolve) => {
    this.resolve = resolve;
  });

  constructor(private el: HTMLElement, config: Partial<ModalControllerConfig> = {}) {
    this.closeOnEsc = config.closeOnEsc || false;
    this.captureFocus = config.captureFocus || false;
  }

  open(): void {
    animate(this.el, 'modal-enter').then(() => {
      this.el.dispatchEvent(new ModalEvent('modalafteropen', { bubbles: true }));
    });

    this.el.dispatchEvent(new ModalEvent('modalopen', { bubbles: true }));
  }

  async close(value?: R) {
    this.resolve(value);

    return animate(this.el, 'modal-exit').then(() => {
      this.el.dispatchEvent(new ModalEvent('modalclose', { bubbles: true }));

      return this;
    });
  }
}

export function WithModal<R = any>(config: Partial<ModalControllerConfig> = {}) {
  return <T extends new (...args: any[]) => HTMLElement>(Base: T) => {
    return class extends Base implements Modal {
      controller = new ModalController<R>(this, config);
    };
  };
}
