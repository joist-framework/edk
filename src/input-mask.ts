export enum PatternChar {
  Any = '*',
  Number = '9',
  Letter = 'A',
}

export const PATTERN_CHARS = Object.values(PatternChar);

const REG_EXPS = {
  Letters: /^[a-z]/i,
  Numbers: /^[0-9]/i,
};

export function format(value: string, pattern: string): string {
  const cleanedValue = value.replace(/[^a-z0-9]/gi, ''); // remove all special chars
  const chars = cleanedValue.split('');

  let count = 0;
  let formatted = '';

  for (var i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i];
    const char = chars[count];

    if (char && patternChar) {
      if (patternChar === PatternChar.Any) {
        // Any letter or number
        formatted += char;
        count++;
      } else if (patternChar === PatternChar.Number) {
        // Numbers only
        if (/^[0-9]/i.test(char)) {
          formatted += char;
        }

        count++;
      } else if (patternChar === PatternChar.Letter) {
        // Letters only
        if (/^[a-z]/i.test(char)) {
          formatted += char;
        }

        count++;
      } else {
        formatted += patternChar;
      }
    }
  }

  return formatted;
}

export class InputMask extends HTMLElement {
  private mask = this.getAttribute('mask') || '';

  connectedCallback() {
    this.addInputListener();
    this.addKeyDownListener();
  }

  attributeChangedCallback() {
    this.mask = this.getAttribute('mask') || '';
  }

  private addInputListener() {
    this.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement;
      const selectionStart = input.selectionStart || 0;
      const prevValue = input.value;

      input.value = format(input.value, this.mask);

      const offset = input.value.length - prevValue.length;
      const maskChar = this.mask[selectionStart - 1] as PatternChar | undefined;

      // check if the current value is not a space for characters and has an offset greater then 0
      if (maskChar && !PATTERN_CHARS.includes(maskChar) && offset > 0) {
        input.setSelectionRange(selectionStart + offset, selectionStart + offset);
      } else {
        input.setSelectionRange(selectionStart, selectionStart);
      }
    });
  }

  private addKeyDownListener() {
    this.addEventListener('keydown', (e) => {
      const input = e.target as HTMLInputElement;
      const patternChar = this.mask[input.selectionStart || 0];

      if (e.key.length === 1 && /^[a-z0-9]/i.test(e.key)) {
        // check that the key is a single character and that it is a letter or number

        if (input.value.length >= this.mask.length) {
          console.log('preventing!');
          // prevent default once value is the same as the mask length
          e.preventDefault();
        } else if (patternChar === PatternChar.Number) {
          if (!REG_EXPS.Numbers.test(e.key)) {
            // if pattern char specifies number and is not
            e.preventDefault();
          }
        } else if (patternChar === PatternChar.Letter) {
          if (!REG_EXPS.Letters.test(e.key)) {
            // if pattern char specifies letter and is not
            e.preventDefault();
          }
        }
      }
    });
  }
}
