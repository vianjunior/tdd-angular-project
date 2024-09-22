import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SignUpFieldErrorMessagePipe } from '../../pipes/field-error-message.pipe';
import { passWordMatchValidator, SignUpValidators } from '../../validators/sign-up.validators';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, SignUpFieldErrorMessagePipe]
})
export class SignUpComponent implements OnInit {
  public form!: UntypedFormGroup;

  constructor(private signUpValidators: SignUpValidators) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = new UntypedFormBuilder().group(
      {
        username: [null, [Validators.required, Validators.minLength(4)]],
        email: [
          null,
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [this.signUpValidators.validate.bind(this.signUpValidators)],
            updateOn: 'blur'
          }
        ],
        password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]],
        repeatPassword: [null, Validators.required]
      },
      {
        validators: passWordMatchValidator.bind(this)
      }
    );
  }
}
