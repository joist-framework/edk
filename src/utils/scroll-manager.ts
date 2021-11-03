export class ScrollManager {
  constructor(private el: HTMLElement = document.documentElement) {}

  freezeScroll() {
    if (this.el.scrollHeight > this.el.clientHeight) {
      this.el.style.top = -this.el.scrollTop + 'px';
      this.el.style.position = 'fixed';
      this.el.style.left = '0';
      this.el.style.right = '0';
      this.el.style.overflowY = 'scroll';
    }
  }

  releaseScroll() {
    const top = Math.abs(parseFloat(this.el.style.top));

    this.el.style.top = '';
    this.el.style.position = '';
    this.el.style.left = '';
    this.el.style.right = '';
    this.el.style.overflowY = '';

    this.el.scrollTo(0, top);
  }
}
