import { ModalController } from './modal-controller';

import { FocusManager } from '../utils/focus-manager';
import { animate } from '../utils/animate';

export interface ModalManagerOptions {
  showOverlay?: boolean;
  document?: Document | ShadowRoot;
}

export class ModalManager {
  public controllers = new Set<ModalController>();

  private focusManager = new FocusManager();
  private overlay: HTMLElement | null = null;
  private previouslyActive: HTMLElement | null = null;

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'ESCAPE') {
      const modal = this.controllers.values().next();

      if (!modal.done) {
        if (modal.value.closeOnEsc) {
          modal.value.close();
        }
      }
    }
  };

  constructor(
    private root: HTMLElement,
    private opts: ModalManagerOptions = { document: document }
  ) {
    document.addEventListener('keyup', this.onKeyUp);
  }

  open<T extends ModalController>(
    Modal: (new (...args: any[]) => T) | (() => T),
    props: Partial<T> = {}
  ): T {
    const controller = this.createController(Modal, props);

    this.controllers.add(controller);

    controller.open(this.root);

    this.previouslyActive = this.opts.document!.activeElement as HTMLElement;

    // Handle adding a single overlay
    if (this.opts.showOverlay && !this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('modal-overlay');

      this.root.prepend(this.overlay);

      animate(this.overlay, 'modal-overlay-enter');
    }

    // stop any previous focus manager
    this.focusManager.stop();

    if (controller.captureFocus) {
      // Add code to be run in the next event loop. This is required in case content is added after the modal is created
      setTimeout(() => {
        this.focusOn(controller);
      }, 0);
    }

    controller.result.then(() => {
      this.onClose(controller);
    });

    return controller;
  }

  clean() {
    document.removeEventListener('keyup', this.onKeyUp);
  }

  focusOn(controller: ModalController) {
    this.focusManager.start(controller.shadowRoot || controller);

    // focus of first focusable element
    if (this.focusManager.firstFocusableEl) {
      this.focusManager.firstFocusableEl.focus();
    }
  }

  createController<T extends ModalController>(
    Modal: (new (...args: any[]) => T) | (() => T),
    props: Partial<T> = {}
  ): T {
    let controller: T;

    try {
      controller = new (Modal as new (...args: any[]) => T)();
    } catch {
      controller = (Modal as () => T)();
    }

    for (let prop in props) {
      controller[prop] = props[prop] as T[Extract<keyof T, string>];
    }

    return controller;
  }

  private onClose(controller: ModalController) {
    this.controllers.delete(controller);

    if (this.controllers.size === 0) {
      if (this.overlay) {
        animate(this.overlay, 'modal-overlay-exit').then(() => {
          this.root.removeChild(this.overlay!);

          this.overlay = null;
        });
      }

      this.focusManager.stop();

      if (this.previouslyActive) {
        this.previouslyActive.focus();
        this.previouslyActive = null;
      }
    }
  }
}
