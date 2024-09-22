import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/auth/components/sign-up/sign-up.component').then((c) => c.SignUpComponent)
  }
];
