import { expect } from '@open-wc/testing';
import { ScrollManager } from './scroll-manager';

describe('ScrollManager', () => {
  it('should disable scrolling for the documentElement by defalt', () => {
    document.documentElement.style.height = '5000px';

    const manager = new ScrollManager();

    manager.freezeScroll();

    expect(document.documentElement.style.top).to.equal('0px');
    expect(document.documentElement.style.position).to.equal('fixed');
    expect(document.documentElement.style.left).to.equal('0px');
    expect(document.documentElement.style.right).to.equal('0px');
    expect(document.documentElement.style.overflowY).to.equal('scroll');

    manager.releaseScroll();

    expect(document.documentElement.style.top).to.equal('');
    expect(document.documentElement.style.position).to.equal('');
    expect(document.documentElement.style.left).to.equal('');
    expect(document.documentElement.style.right).to.equal('');
    expect(document.documentElement.style.overflowY).to.equal('');
  });

  it('should disable scrolling for the specified target', () => {
    const target = document.createElement('div');
    target.style.height = '500px';
    target.style.overflowY = 'auto';

    const child = document.createElement('div');
    child.style.height = '1000px';

    target.appendChild(child);

    document.body.appendChild(target);

    const manager = new ScrollManager(target);

    manager.freezeScroll();

    expect(target.style.top).to.equal('0px');
    expect(target.style.position).to.equal('fixed');
    expect(target.style.left).to.equal('0px');
    expect(target.style.right).to.equal('0px');
    expect(target.style.overflowY).to.equal('scroll');

    manager.releaseScroll();

    expect(target.style.top).to.equal('');
    expect(target.style.position).to.equal('');
    expect(target.style.left).to.equal('');
    expect(target.style.right).to.equal('');
    expect(target.style.overflowY).to.equal('');

    document.body.removeChild(target);
  });
});
