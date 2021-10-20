import { expect, fixture, html } from '@open-wc/testing';

import { InputMaskElement, InputMaskChangeEvent } from './input-mask';

customElements.define('test-input-mask', InputMaskElement);

describe('InputMaskElement', () => {
  it('should format default value', async () => {
    const el = await fixture<InputMaskElement>(
      html`
        <test-input-mask mask="(999) 999-9999">
          <input name="phone" value="1234567890" />
        </test-input-mask>
      `
    );

    const input = el.querySelector('input') as HTMLInputElement;

    expect(input.value).to.equal('(123) 456-7890');
    expect(input.getAttribute('value')).to.equal('1234567890');
  });

  it('should update value when on input event', async () => {
    const el = await fixture<InputMaskElement>(
      html`
        <test-input-mask mask="(999) 999-9999">
          <input name="phone" />
        </test-input-mask>
      `
    );

    const input = el.querySelector('input') as HTMLInputElement;

    input.value = '8888888888';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(input.value).to.equal('(888) 888-8888');
    expect(input.getAttribute('value')).to.equal('8888888888');
  });

  it('should dispatch custom change event after formatting', async () => {
    const el = await fixture<InputMaskElement>(
      html`
        <test-input-mask mask="(999) 999-9999">
          <input name="phone" />
        </test-input-mask>
      `
    );

    const input = el.querySelector('input') as HTMLInputElement;
    input.value = '8888888888';

    return new Promise((resolve) => {
      el.addEventListener('inputmaskchange', (e) => {
        const evt = e as InputMaskChangeEvent;

        expect(evt.value.value).to.equal('(888) 888-8888');
        expect(evt.value.raw).to.equal('8888888888');

        resolve();
      });

      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
});
