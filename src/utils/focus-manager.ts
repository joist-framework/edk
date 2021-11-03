export function getFocusableEls(element: HTMLElement | ShadowRoot, selector?: string[]) {
  const select = selector || [
    '[tabindex]',
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
  ];

  const elements = element.querySelectorAll<HTMLElement>(select.join(', '));

  return Array.from(elements)
    .filter((el) => !Object.keys(el.dataset).includes('focusTrapSkip'))
    .sort((a, b) => a.tabIndex - b.tabIndex);
}

export class FocusManager {
  firstFocusableEl?: HTMLElement;
  lastFocusableEl?: HTMLElement;

  private element: HTMLElement | ShadowRoot | null = null;
  private focusableEls: HTMLElement[] = [];
  private listener = this.onKeyDown.bind(this);

  start(element: HTMLElement | ShadowRoot) {
    this.element = element;

    this.focusableEls = getFocusableEls(this.element);
    this.firstFocusableEl = this.focusableEls[0];
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];

    this.element.addEventListener('keydown', this.listener);
  }

  stop() {
    if (this.element) {
      this.element.removeEventListener('keydown', this.listener);
    }
  }

  private onKeyDown(e: Event) {
    const evt = e as KeyboardEvent;

    const root = this.element instanceof ShadowRoot ? this.element : document;

    if (evt.key === 'Tab') {
      if (evt.shiftKey) {
        // shift + tab
        if (this.lastFocusableEl && root.activeElement === this.firstFocusableEl) {
          this.lastFocusableEl.focus();

          e.preventDefault();
        }
      } else {
        // just tab
        if (this.firstFocusableEl && root.activeElement === this.lastFocusableEl) {
          this.firstFocusableEl.focus();

          e.preventDefault();
        }
      }
    }
  }
}
