import { Meta } from '@storybook/web-components';
import { html } from 'lit-html';

import { AutocompleteElement } from './autocomplete';

customElements.define('test-autocomplete', AutocompleteElement);

export default {
  title: 'autocomplte',
} as Meta;

export const Default = () => html`
  <style></style>

  <test-autocomplete .items=${['first', 'second', 'third', 'fourth']}>
    <input name="search" slot="input" />
  </test-autocomplete>
`;
