import { expect } from '@open-wc/testing';
import { RequieSlots } from './require-slots';

describe('it should throw error when all required slots are not available', () => {
  class Test extends RequieSlots(HTMLElement, ['first', 'second']) {}
  customElements.define('test-el', Test);

  expect(() => new Test()).to.throw(
    'The following slots are required but could not be found. (first,second)'
  );
});
