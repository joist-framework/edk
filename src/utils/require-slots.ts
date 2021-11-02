declare global {
  interface HTMLElement {
    connectedCallback?(): void;
  }
}

export function RequieSlots<T extends new (...args: any[]) => HTMLElement>(
  Base: T,
  slots: string[]
) {
  return class extends Base {
    constructor(..._: any[]) {
      super();

      this.verifyRequiredSlots();

      const observer = new MutationObserver(() => {
        this.verifyRequiredSlots();
      });

      observer.observe(this, { childList: true });
    }

    verifyRequiredSlots() {
      const currentSlots = Array.from(this.querySelectorAll('[slot]')).map((el) => el.slot);
      const unFilledSlots = slots.filter((slot) => !currentSlots.includes(slot));

      if (unFilledSlots.length) {
        throw new Error(
          `The following slots are required but could not be found. (${unFilledSlots})`
        );
      }
    }
  };
}
