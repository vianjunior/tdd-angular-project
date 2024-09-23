import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SignUpFieldErrorMessagePipe } from '../../pipes/field-error-message.pipe';
import { AuthService } from '../../services/auth.service';
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
  public alertClass = '';
  public showUserFeedBack = false;
  public ongoingAPIRequest = false;
  public userFeedBackResponse = '';

  constructor(
    private signUpValidators: SignUpValidators,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createNewUser(): void {
    this.ongoingAPIRequest = true;

    const requestBody = this.form.value;
    delete requestBody?.repeatPassword;

    this.authService.signUp(requestBody).subscribe({
      next: (response) => {
        this.handleFeedBackFromServer('alert-success', response.feedBackMessage);
      },
      error: (httpError: HttpErrorResponse) => {
        this.handleFeedBackFromServer('alert-danger', httpError?.error?.feedBackMessage);
      }
    });
  }

  private handleFeedBackFromServer(alertClass: string, message: string): void {
    this.alertClass = `alert ${alertClass}`;
    this.showUserFeedBack = true;
    this.userFeedBackResponse = message;

    this.ongoingAPIRequest = false;

    this.changeDetector.detectChanges();
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
