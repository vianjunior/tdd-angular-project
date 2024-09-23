import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SignUpComponent } from './sign-up.component';

describe('sign-up.component.spe.ts | SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Layout validations', () => {
    it('has Sign Up header', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const h1 = signUp.querySelector('h1');
      expect(h1?.textContent).toBe('Sign Up');
    });

    it('has username input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="username"]');
      const input = signUp.querySelector('input[id="username"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Username');
    });

    it('has email input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="email"]');
      const input = signUp.querySelector('input[id="email"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('E-mail');
    });

    it('has password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="password"]');
      const input = signUp.querySelector('input[id="password"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Password');
    });

    it('has password type for password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="password"]') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has password repeat input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="repeatPassword"]');
      const input = signUp.querySelector('input[id="repeatPassword"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Repeat Password');
    });

    it('has password type for password repeat input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="repeatPassword"]') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has Sign Up button', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button');
      expect(button?.textContent).toContain('Sign Up');
    });

    it('disables the button initially', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button');
      expect(button?.disabled).toBeTruthy();
    });
  });

  describe('Interactions from user', () => {
    let signUpButton: HTMLButtonElement | null;
    let signUp: HTMLElement;

    beforeEach(async () => {
      await setupForm();
    });

    const setupForm = async () => {
      httpTestingController = TestBed.inject(HttpTestingController);

      signUp = fixture.nativeElement as HTMLElement;

      component.form.patchValue({
        username: 'junior.vian',
        email: 'junior.vian@email.com',
        password: 'Password123',
        repeatPassword: 'Password123'
      });

      fixture.detectChanges();
      signUpButton = signUp.querySelector('button');
    };

    it('enables the button when all the fields have valid input', async () => {
      expect(signUpButton?.disabled).toBeFalsy();
    });

    it('sends username, email and password to backend after clicking the button', async () => {
      //when
      signUpButton?.click();

      //then
      const req = httpTestingController.expectOne('/api/1.0/auth/signup');
      const requestBody = req.request.body;
      expect(requestBody).toEqual({
        username: 'junior.vian',
        email: 'junior.vian@email.com',
        password: 'Password123'
      });
    });

    it('disable the button when there is an ongoing api call', async () => {
      //when
      signUpButton?.click();
      fixture.detectChanges();
      signUpButton?.click();

      //then
      httpTestingController.expectOne('/api/1.0/auth/signup');
      expect(signUpButton?.disabled).toBeTruthy();
    });

    it('displays spinner after clicking the submit', async () => {
      //then
      expect(signUp.querySelector('span[role="status"]')).toBeFalsy();

      //when
      signUpButton?.click();
      fixture.detectChanges();
      //then
      expect(signUp.querySelector('span[role="status"]')).toBeTruthy();
    });

    it('displays account activation notification after successful sign up request', async () => {
      //given
      const feedBackMessage = 'Success! Please check your e-mail to activate your account';
      //then
      expect(signUp.querySelector('.alert-success')).toBeFalsy();

      //when
      signUpButton?.click();

      //then
      httpTestingController.expectOne('/api/1.0/auth/signup').flush({ feedBackMessage: feedBackMessage });

      //when
      fixture.detectChanges();

      //then
      const message = signUp.querySelector('.alert-success');
      expect(message?.textContent).toContain(feedBackMessage);
    });

    it('displays validation error coming from backend after submit failure', async () => {
      //when
      signUpButton?.click();

      const req = httpTestingController.expectOne('/api/1.0/auth/signup');
      req.flush(
        {
          feedBackMessage: 'E-mail already in use'
        },
        {
          status: 500,
          statusText: 'Server side error'
        }
      );
      fixture.detectChanges();

      //then
      const message = signUp.querySelector('.alert-danger');
      expect(message?.textContent).toContain('E-mail already in use');
    });

    it('hides spinner after sign up request fails', async () => {
      //when
      signUpButton?.click();

      const req = httpTestingController.expectOne('/api/1.0/auth/signup');
      req.flush(
        {
          feedBackMessage: 'E-mail in use'
        },
        {
          status: 500,
          statusText: 'Server side error'
        }
      );
      fixture.detectChanges();

      //then
      expect(signUp.querySelector('span[role="status"]')).toBeFalsy();
    });
  });
});
