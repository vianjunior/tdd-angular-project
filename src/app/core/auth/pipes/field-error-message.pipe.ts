import { Pipe, type PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const ERROR_MESSAGES: Record<string, unknown> = {
  unknown: 'This fields has an unknown error',
  required: 'This field is required',
  minlength: (minLength = 4) => `Minimum length is ${minLength} characters`,
  email: 'Invalid e-mail address',
  emailInUse: 'E-mail already in use',
  pattern: 'Password must have at least 1 uppercase, 1 lowecase and 1 number',
  passwordMismatch: 'Password mismatch'
};

@Pipe({
  standalone: true,
  name: 'signUpMessageError'
})
export class SignUpFieldErrorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null | undefined): string {
    let errorMessage = '';

    if (errors) {
      errorMessage = this.defineErrorMessage(errors);
    }

    return errorMessage;
  }

  private defineErrorMessage(errors: ValidationErrors): string {
    return Object.entries(errors)
      .map(([key, value]) => {
        if (typeof value === 'string' && value.length > 0) {
          return value;
        } else if ((value === true || typeof value === 'object') && ERROR_MESSAGES[key]) {
          if (typeof ERROR_MESSAGES[key] === 'function') {
            return ERROR_MESSAGES[key]();
          }
          return ERROR_MESSAGES[key];
        } else {
          return ERROR_MESSAGES['unknown'];
        }
      })
      .join('. ');
  }
}
