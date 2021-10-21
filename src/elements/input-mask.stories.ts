import { Meta } from '@storybook/web-components';
import { html } from 'lit-html';

import { InputMaskElement } from './input-mask';

customElements.define('test-input-mask', InputMaskElement);

export default {
  title: 'input-mask',
} as Meta;

export const Default = () => html`
  <style>
    * {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
        'Open Sans', 'Helvetica Neue', sans-serif;
    }

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

  <h2>Default</h2>

  <test-input-mask mask="(999) 999-9999">
    <label>Phone:</label>
    <input name="phone" placeholder="(999) 999-9999" />
  </test-input-mask>

  <test-input-mask mask="99/99/9999">
    <label>Date:</label>
    <input name="date" placeholder="99/99/9999" />
  </test-input-mask>

  <h2>Multiple Fields</h2>

  <test-input-mask mask="(999) 999-9999">
    <label>Home:</label>
    <input name="phone1" placeholder="(999) 999-9999" />

    <label>Cell:</label>
    <input name="phone2" placeholder="(999) 999-9999" />

    <label>Work:</label>
    <input name="phone3" placeholder="(999) 999-9999" />
  </test-input-mask>
`;
