import { Meta } from '@storybook/web-components';
import { html } from 'lit-html';

import { InputMask } from './input-mask.element';

customElements.define('test-input-mask', InputMask);

export default {
  title: 'input-mask',
} as Meta;

export const Default = () => html`
  <test-input-mask mask="(999) 999-9999">
    <input name="phone" placeholder="Phone number" />
  </test-input-mask>
`;

export const Multiple = () => html`
  <test-input-mask mask="(999) 999-9999">
    <input name="phone1" placeholder="Home number" /> <br /><br />
    <input name="phone2" placeholder="Cell number" /> <br /><br />
    <input name="phone3" placeholder="Work number" /> <br /><br />
  </test-input-mask>
`;
