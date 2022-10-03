const RE_ALPHA = /[A-Za-z]/;
const RE_ALPHANUM = /[A-Za-z0-9]/;
const RE_NUM = /[0-9]/;
const RE_RESERVED = /[0aA]/;
const RE_STRIP = /([\W_])/g;

export function unformat(text: string) {
  return text.replace(RE_STRIP, "");
}

export function format(text: string, template: string) {
  const input = unformat(text);

  if (!input) {
    return "";
  }

  let index = 0;
  let value = "";

  for (const templateChar of template) {
    if (!RE_RESERVED.test(templateChar)) {
      value += templateChar;
      continue;
    }

    if (index === input.length) {
      break;
    }

    const inputChar = input.charAt(index);

    const isInvalid =
      (templateChar === "0" && !RE_NUM.test(inputChar)) ||
      (templateChar === "a" && !RE_ALPHA.test(inputChar)) ||
      (templateChar === "A" && !RE_ALPHANUM.test(inputChar));

    if (isInvalid) {
      break;
    }

    value += inputChar;
    index++;
  }

  return value;
}

export function patternize(template: string) {
  const format = template.replace(RE_STRIP, "\\$1");

  let pattern = "";

  for (const char of format) {
    if (!RE_RESERVED.test(char)) {
      pattern += char;
    } else if (char === "0") {
      pattern += "\\d";
    } else if (char === "a") {
      pattern += "[A-Za-z]";
    } else if (char === "A") {
      pattern += "[A-Za-z\\d]";
    }
  }

  return new RegExp(`^${pattern}$`);
}
