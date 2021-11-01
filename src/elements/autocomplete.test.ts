import { fixture, html } from '@open-wc/testing';

import { AutocompleteElement } from './autocomplete';

customElements.define('test-autocomplete', AutocompleteElement);

describe('AutocompleteElement', () => {
  it('should throw and Error if no list container provided', async () => {
    const el = await fixture<AutocompleteElement>(
      html`
        <test-autocomplete>
          <input name="phone" slot="input" />

          <ul slot="list"></ul>
        </test-autocomplete>
      `
    );
  });
});
