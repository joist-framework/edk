import { FocusManager } from '../utils';
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
  private focusManager = new FocusManager();
  private previouslyActive: HTMLElement | null = null;

  public closeOnEsc = false;
  public captureFocus = false;

  public readonly result = new Promise<R | undefined>((resolve) => {
    this.resolve = resolve;
  });

  constructor(private el: HTMLElement, config: Partial<ModalControllerConfig> = {}) {
    this.closeOnEsc = config.closeOnEsc || false;
    this.captureFocus = config.captureFocus || false;
    this.previouslyActive = document.activeElement as HTMLElement;
  }

  open(): void {
    animate(this.el, 'modal-enter').then(() => {
      this.el.dispatchEvent(new ModalEvent('modalafteropen', { bubbles: true }));
    });

    if (this.captureFocus) {
      this.focus();
    }

    this.el.dispatchEvent(new ModalEvent('modalopen', { bubbles: true }));
  }

  async close(value?: R) {
    this.resolve(value);

    if (this.previouslyActive) {
      this.previouslyActive.focus();
    }

    return animate(this.el, 'modal-exit').then(() => {
      this.el.dispatchEvent(new ModalEvent('modalclose', { bubbles: true }));

      return this;
    });
  }

  private focus() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.focusManager.start(this.el.shadowRoot || this.el);

        // focus of first focusable element
        if (this.focusManager.firstFocusableEl) {
          this.focusManager.firstFocusableEl.focus();
        }

        resolve();
      }, 0);
    });
  }
}

export function WithModal<R>(
  Base: CustomElementConstructor,
  config: Partial<ModalControllerConfig> = {}
) {
  return class extends Base implements Modal {
    controller = new ModalController<R>(this, config);
  };
}
