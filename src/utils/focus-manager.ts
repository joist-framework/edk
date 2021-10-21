export function getFocusableEls(element: HTMLElement) {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      '[tabindex], a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
    )
  ).filter((el) => !Object.keys(el.dataset).includes('focusTrapSkip'));
}

export class FocusManager {
  firstFocusableEl?: HTMLElement;
  lastFocusableEl?: HTMLElement;

  private focusableEls: HTMLElement[] = [];
  private listener = this.onKeyDown.bind(this);
  private element: HTMLElement;

  // Have to handle this way to make storybook happy
  constructor(element: HTMLElement) {
    this.element = element;

    this.update();
  }

  update() {
    this.focusableEls = getFocusableEls(this.element);
    this.firstFocusableEl = this.focusableEls[0];
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
  }

  start() {
    this.element.addEventListener('keydown', this.listener);
  }

  stop() {
    this.element.removeEventListener('keydown', this.listener);
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // shift + tab
        if (this.lastFocusableEl && document.activeElement === this.firstFocusableEl) {
          this.lastFocusableEl.focus();

          e.preventDefault();
        }
      } else {
        // just tab
        if (this.firstFocusableEl && document.activeElement === this.lastFocusableEl) {
          this.firstFocusableEl.focus();

          e.preventDefault();
        }
      }
    }
  }
}
