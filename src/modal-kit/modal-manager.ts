import { ModalController } from './modal-controller';

import { FocusManager } from '../utils/focus-manager.js';
import { animate } from '../utils/animate.js';

export interface ModalManagerOptions {
  showOverlay?: boolean;
}

export class ModalManager {
  public controllers = new Set<ModalController>();

  private overlay: HTMLElement | null = null;
  private previouslyActive: HTMLElement | null = null;
  private focusManager: FocusManager | null = null;

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

  constructor(private root: HTMLElement, private opts: ModalManagerOptions = {}) {
    document.addEventListener('keyup', this.onKeyUp);
  }

  open<T extends ModalController>(Modal: new (...args: any[]) => T, props: Partial<T> = {}): T {
    const controller = new Modal();

    for (let prop in props) {
      controller[prop] = props[prop] as T[Extract<keyof T, string>];
    }

    controller.open(this.root);

    this.controllers.add(controller);

    this.previouslyActive = document.activeElement as HTMLElement;

    // Handle adding a single overlay
    if (this.opts.showOverlay && !this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('modal-overlay');

      this.root.prepend(this.overlay);

      animate(this.overlay, 'modal-overlay-enter');
    }

    // stop any previous focus manager
    if (this.focusManager) {
      this.focusManager.stop();
    }

    // Start up new forcus manager for modal
    this.focusManager = new FocusManager(controller);
    this.focusManager.start();

    // focus of first focusable element
    if (this.focusManager.firstFocusableEl) {
      this.focusManager.firstFocusableEl.focus();
    }

    controller.result.then(() => {
      this.onClose(controller);
    });

    return controller;
  }

  clean() {
    document.removeEventListener('keyup', this.onKeyUp);
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

      if (this.focusManager) {
        this.focusManager = null;
      }

      if (this.previouslyActive) {
        this.previouslyActive.focus();
        this.previouslyActive = null;
      }
    }
  }
}
