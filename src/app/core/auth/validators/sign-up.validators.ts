import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpValidators implements AsyncValidator {
  constructor(private authService: AuthService) {}

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.authService.isEmailInUse(control.value).pipe(
      map((response) => (response ? { emailInUse: true } : null)),
      catchError(() => of(null))
    );
  }
}

export const passWordMatchValidator: ValidatorFn = (
  formControl: AbstractControl
): ValidationErrors | null => {
  const passwordControl = formControl.get('password');
  const passwordValue = passwordControl?.value;

  const repeatPasswordControl = formControl.get('repeatPassword');
  const repeatPasswordValue = repeatPasswordControl?.value;

  if (passwordValue !== repeatPasswordValue) {
    const controlErrors = repeatPasswordControl?.errors;
    repeatPasswordControl?.setErrors({ ...controlErrors, passwordMismatch: true });
  } else if (repeatPasswordControl?.hasError('passwordMismatch')) {
    delete repeatPasswordControl.errors?.['passwordMismatch'];
  }

  return null;
};
