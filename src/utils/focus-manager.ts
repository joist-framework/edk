export function getFocusableEls(element: HTMLElement | ShadowRoot, selector?: string[]) {
  const select = selector || [
    '[tabindex]',
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
  ];

  const elements = Array.from(element.querySelectorAll<HTMLElement>(select.join(', ')));

  return elements
    .filter((el) => !Object.keys(el.dataset).includes('focusTrapSkip'))
    .sort((a, b) => a.tabIndex - b.tabIndex);
}

export class FocusManager {
  firstFocusableEl?: HTMLElement;
  lastFocusableEl?: HTMLElement;

  private focusableEls: HTMLElement[] = [];
  private listener = this.onKeyDown.bind(this);

  // Have to handle this way to make storybook happy
  constructor(private element: HTMLElement | ShadowRoot) {
    this.update();
  }

  update() {
    this.focusableEls = getFocusableEls(this.element);

    console.log(this.focusableEls);

    this.firstFocusableEl = this.focusableEls[0];
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
  }

  start() {
    this.element.addEventListener('keydown', this.listener);
  }

  stop() {
    this.element.removeEventListener('keydown', this.listener);
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
