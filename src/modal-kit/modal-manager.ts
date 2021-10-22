import { ModalController } from './modal-controller';

import { FocusManager } from '../utils/focus-manager';
import { animate } from '../utils/animate';

export class ModalManager {
  private overlay: HTMLElement | null = null;
  private activeModals = new Set<ModalController>();
  private previouslyActive: HTMLElement | null = null;
  private focusManager: FocusManager | null = null;

  constructor(public root: HTMLElement) {
    this.addKeyUpListener();
  }

  open<R = any, T extends HTMLElement = HTMLElement>(Modal: new (...args: any[]) => T) {
    const controller = new ModalController<R, T>(Modal, this.root);

    this.activeModals.add(controller);

    this.previouslyActive = document.activeElement as HTMLElement;

    // stop any previous focus manager
    if (this.focusManager) {
      this.focusManager.stop();
    }

    // Start up new forcus manager for modal
    this.focusManager = new FocusManager(controller.modal);
    this.focusManager.start();

    // focus of first focusable element
    if (this.focusManager.firstFocusableEl) {
      this.focusManager.firstFocusableEl.focus();
    }

    // Handle adding a single overlay
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('modal-overlay');

      this.root.prepend(this.overlay);

      animate(this.overlay, 'modal-overlay-enter');
    }

    controller.result.then(() => {
      this.onClose(controller);
    });

    return controller;
  }

  private addKeyUpListener() {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === 'ESCAPE') {
        const modal = this.activeModals.values().next();

        if (!modal.done) {
          modal.value.close();
        }
      }
    };

    document.addEventListener('keyup', onKeyUp);
  }

  private onClose(controller: ModalController) {
    this.activeModals.delete(controller);

    if (this.activeModals.size === 0) {
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
