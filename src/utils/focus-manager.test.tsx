import { html, fixture, expect } from '@open-wc/testing';

import { FocusManager, getFocusableEls } from './focus-manager.js';

describe('utils: focus-trap', () => {
  it('should exclude elements marked to skip', async () => {
    const container = await fixture<HTMLFormElement>(html`
      <form>
        <input name="fname" label="First name" />
        <input name="lname" label="Last name" />
        <input name="addr1" label="Address" />
        <input name="addr2" label="Address 2" />

        <button>Cancel</button>
        <button data-focus-trap-skip>Submit</button>
      </form>
    `);

    const els = getFocusableEls(container);

    expect(els.flatMap((el) => Object.keys(el.dataset)).includes('focusTrapSkip')).to.equal(false);
  });

  it('should return the correct first and last focusable element', async () => {
    const container = await fixture<HTMLFormElement>(html`
      <form>
        <input name="fname" label="First name" />
        <input name="lname" label="Last name" />
        <input name="addr1" label="Address" />
        <input name="addr2" label="Address 2" />

        <button>Cancel</button>
        <button>Submit</button>
      </form>
    `);

    const focusTrap = new FocusManager(container);

    expect(focusTrap.firstFocusableEl?.getAttribute('name')).to.equal('fname');
    expect(focusTrap.lastFocusableEl?.innerHTML).to.equal('Submit');
  });

  it('should return to the top when on the last element', async () => {
    const container = await fixture<HTMLFormElement>(html`
      <form>
        <input name="fname" label="First name" />
        <input name="lname" label="Last name" />
        <input name="addr1" label="Address" />
        <input name="addr2" label="Address 2" />

        <button>Cancel</button>
        <button>Submit</button>
      </form>
    `);

    const focusTrap = new FocusManager(container);
    focusTrap.start();
    focusTrap.lastFocusableEl?.focus();

    container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(document.activeElement?.getAttribute('name')).to.equal('fname');
  });

  it('should return to bottom if Shift + Tab from top', async () => {
    const container = await fixture<HTMLFormElement>(html`
      <form>
        <input name="fname" label="First name" />
        <input name="lname" label="Last name" />
        <input name="addr1" label="Address" />
        <input name="addr2" label="Address 2" />

        <button>Cancel</button>
        <button>Submit</button>
      </form>
    `);

    const focusTrap = new FocusManager(container);
    focusTrap.start();
    focusTrap.firstFocusableEl?.focus();

    container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));

    expect(document.activeElement?.innerHTML).to.equal('Submit');
  });
});
