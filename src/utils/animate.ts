export function animate(el: HTMLElement, cssClass: string) {
  return new Promise<HTMLElement>((resolve) => {
    el.classList.add(cssClass);

    function onAnimationEnd(e: AnimationEvent) {
      const el = e.target as HTMLElement;

      el.removeEventListener('animationend', onAnimationEnd);

      el.classList.remove(cssClass);

      resolve(el);
    }

    el.addEventListener('animationend', onAnimationEnd);
  });
}
