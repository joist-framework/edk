export function freezeScroll() {
  if (document.body.clientHeight > window.innerHeight) {
    document.body.style.top = -document.documentElement.scrollTop + 'px';
    document.body.style.position = 'fixed';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflowY = 'scroll';
  }
}

export function releaseScroll() {
  const top = Math.abs(parseFloat(document.body.style.top));

  document.body.style.top = '';
  document.body.style.position = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflowY = '';

  window.scrollTo(0, top);
}
