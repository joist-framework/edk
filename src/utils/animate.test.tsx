import { expect } from '@open-wc/testing';

import { animate } from './animate';

describe('utils: animate', () => {
  it('should resolve when the animation is complete', async () => {
    const el = document.createElement('div');

    const animation = animate(el, 'animation-class');

    expect(el.classList.contains('animation-class')).to.equal(true);

    el.dispatchEvent(new AnimationEvent('animationend'));

    const res = await animation;

    expect(res.tagName).to.equal('DIV');
    expect(res.classList.contains('animation-class')).to.equal(false);
  });
});
