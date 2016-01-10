import {Control} from "angular2/common";

export function rangeValidator(control: Control): {[s: string]: boolean} {
  let result = null;

  if (control.value) {
    const value = parseInt(control.value);

    if (String(value) === "NaN") {
      result = {invalidNumber: true};
    }
    else if (value < 1 || value > 10) {
      result = {invalidRange: true};
    }
  }
  return result;
}
