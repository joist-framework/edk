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

export function format(value: string, pattern: string) {
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
  value: string = '';

  private mask = this.getAttribute('mask') || '';

  connectedCallback() {
    this.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement;
      const selectionStart = input.selectionStart;

      this.value = input.value;
      input.value = format(input.value, this.mask);

      const offset = input.value.length - this.value.length;

      if (selectionStart !== null) {
        if (PATTERN_CHARS.includes(this.mask[selectionStart - 1] as PatternChar) && offset >= 0) {
          input.setSelectionRange(selectionStart + offset, selectionStart + offset);
        } else {
          input.setSelectionRange(input.selectionStart, input.selectionStart);
        }
      }
    });

    this.addEventListener('keydown', (e) => {
      const input = e.target as HTMLInputElement;
      const offset = input.value.length - this.value.length;

      let patternChar: string | undefined;

      if (input.selectionStart !== null) {
        patternChar = this.mask[input.selectionStart + offset];
      }

      if (e.key.length === 1 && /^[a-z0-9]/i.test(e.key) && patternChar) {
        // check that the key is a single character and that it is a letter or number
        if (input.value.length >= this.mask.length) {
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
