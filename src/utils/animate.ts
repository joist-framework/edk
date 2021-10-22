export function animate(el: HTMLElement, cssClass: string) {
  return new Promise<HTMLElement>((resolve) => {
    el.classList.add(cssClass);

    const styles = getComputedStyle(el);

    if (styles.animationName === 'none' || (!styles.animationName && !el.style.animationName)) {
      return resolve(el);
    }

    function onAnimationEnd(e: AnimationEvent) {
      const el = e.target as HTMLElement;

      el.removeEventListener('animationend', onAnimationEnd);

      el.classList.remove(cssClass);

      resolve(el);
    }

    el.addEventListener('animationend', onAnimationEnd);
  });
}
