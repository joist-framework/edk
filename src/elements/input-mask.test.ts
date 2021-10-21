import { expect, fixture, html } from '@open-wc/testing';

import { InputMaskElement, InputMaskChangeEvent, format } from './input-mask';

customElements.define('test-input-mask', InputMaskElement);

describe('format', () => {
  it('should retrn the correct raw value', () => {
    expect(format('(123) 456 7890', '(***) ***-****')).to.deep.equal({
      raw: '1234567890',
      formatted: '(123) 456-7890',
    });
  });

  it('should return a formatted phone number (***) ***-****', () => {
    expect(format('1234567890', '(***) ***-****')).to.deep.equal({
      raw: '1234567890',
      formatted: '(123) 456-7890',
    });
  });

  it('should return a formatted phone number ***-***-****', () => {
    expect(format('1234567890', '***-***-****')).to.deep.equal({
      raw: '1234567890',
      formatted: '123-456-7890',
    });
  });

  it('should only allow numbers', () => {
    expect(format('304213abcd', '999-999-9999')).to.deep.equal({
      raw: '304213abcd',
      formatted: '304-213-',
    });
  });

  it('should only allow a mix of letters and numbers', () => {
    expect(format('C94749', 'A-99999')).to.deep.equal({
      raw: 'C94749',
      formatted: 'C-94749',
    });
  });
});

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

        expect(evt.value).to.equal('(888) 888-8888');

        resolve();
      });

      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
});
