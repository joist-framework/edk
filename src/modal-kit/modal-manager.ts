import { Modal, ModalController } from './modal-controller';

import { animate } from '../utils/animate';

export interface ModalManagerOptions {
  showOverlay?: boolean;
  freezeScroll?: boolean;
}

export type ModalElement = Modal & HTMLElement;
export type ModalConstructor<T> = new (...args: any[]) => T;
export type ModalFactory<T> = () => T;

export class ModalManager {
  private controllers = new Set<ModalController>();
  private overlay: HTMLElement | null = null;

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

  open<T extends ModalElement>(
    El: ModalConstructor<T> | ModalFactory<T>,
    props: Partial<T> = {}
  ): T {
    const modal = this.createModal(El, props);

    modal.controller.open();

    this.controllers.add(modal.controller);
    this.root.appendChild(modal);

    // Handle adding a single overlay
    if (this.opts.showOverlay && !this.overlay) {
      this.applyOverlay();
    }

    modal.controller.result.then(() => {
      this.onClose(modal);
    });

    return modal;
  }

  clean() {
    document.removeEventListener('keyup', this.onKeyUp);
  }

  createModal<T extends ModalElement>(
    El: ModalConstructor<T> | ModalFactory<T>,
    props: Partial<T> = {}
  ): T {
    let controller: T;

    try {
      controller = new (El as ModalConstructor<T>)();
    } catch {
      controller = (El as ModalFactory<T>)();
    }

    for (let prop in props) {
      controller[prop] = props[prop] as T[Extract<keyof T, string>];
    }

    return controller;
  }

  applyOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.classList.add('modal-overlay');

    this.root.prepend(this.overlay);

    animate(this.overlay, 'modal-overlay-enter');
  }

  clearOverlay() {
    if (this.overlay) {
      animate(this.overlay, 'modal-overlay-exit').then(() => {
        this.root.removeChild(this.overlay!);

        this.overlay = null;
      });
    }
  }

  private onClose(modal: ModalElement) {
    this.controllers.delete(modal.controller);
    this.root.removeChild(modal);

    if (this.controllers.size === 0) {
      this.clearOverlay();
    }
  }
}
