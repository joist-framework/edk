import { FocusManager } from '../utils';
import { animate } from '../utils/animate';
import { ScrollManager } from '../utils/scroll-manager';

export class ModalEvent extends Event {}

export interface Modal<T = any> {
  controller: ModalController<T>;
}

export interface ModalConfig {
  closeOnEsc: boolean;
  captureFocus: boolean;
  freezeScroll: boolean;
}

export class ModalController<R = any> implements ModalConfig {
  private resolve: (value?: R) => void = () => void 0;
  private focusManager = new FocusManager();
  private scrollManager = new ScrollManager();
  private previouslyActive: HTMLElement | null = null;

  public closeOnEsc: boolean;
  public captureFocus: boolean;
  public freezeScroll: boolean;

  public readonly result = new Promise<R | undefined>((resolve) => {
    this.resolve = resolve;
  });

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'ESCAPE' && this.closeOnEsc) {
      this.close();
    }
  };

  constructor(private el: HTMLElement, config: Partial<ModalConfig> = {}) {
    document.addEventListener('keyup', this.onKeyUp);

    this.closeOnEsc = config.closeOnEsc || false;
    this.captureFocus = config.captureFocus || false;
    this.freezeScroll = config.freezeScroll || false;

    this.previouslyActive = document.activeElement as HTMLElement;
  }

  open(): void {
    animate(this.el, 'modal-enter').then(() => {
      this.el.dispatchEvent(new ModalEvent('modalafteropen', { bubbles: true }));
    });

    if (this.captureFocus) {
      this.focus();
    }

    // Freeze any background scrolling
    if (this.freezeScroll) {
      this.scrollManager.freezeScroll();
    }

    this.el.dispatchEvent(new ModalEvent('modalopen', { bubbles: true }));
  }

  async close(value?: R) {
    this.resolve(value);
    this.scrollManager.releaseScroll();

    document.removeEventListener('keyup', this.onKeyUp);

    if (this.previouslyActive) {
      this.previouslyActive.focus();
    }

    return animate(this.el, 'modal-exit').then(() => {
      this.el.dispatchEvent(new ModalEvent('modalclose', { bubbles: true }));

      return this;
    });
  }

  focus() {
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

export function WithModal<R>(Base: CustomElementConstructor, config: Partial<ModalConfig> = {}) {
  return class ModalElement extends Base implements Modal {
    controller = new ModalController<R>(this, config);
  };
}
