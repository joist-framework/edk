import { Meta } from '@storybook/web-components';
import { html } from 'lit-html';

import { InputMask } from './input-mask';

customElements.define('test-input-mask', InputMask);

export default {
  title: 'input-mask',
} as Meta;

export const Default = () => html`
  <style>
    input {
      padding: 0.5rem;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    test-input-mask {
      display: flex;
      flex-direction: column;
      max-width: 400px;
    }
  </style>

  <test-input-mask mask="(999) 999-9999">
    <input name="phone" placeholder="Phone number" />
  </test-input-mask>
`;

export const Multiple = () => html`
  <style>
    input {
      padding: 0.5rem;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    test-input-mask {
      display: flex;
      flex-direction: column;
      max-width: 400px;
    }
  </style>

  <test-input-mask mask="(999) 999-9999">
    <label>Home:</label>
    <input name="phone1" placeholder="(999) 999-9999" />

    <label>Cell:</label>
    <input name="phone2" placeholder="(999) 999-9999" />

    <label>Work:</label>
    <input name="phone3" placeholder="(999) 999-9999" />
  </test-input-mask>
`;
