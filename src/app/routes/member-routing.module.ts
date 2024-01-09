import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../modules/member/register/register.component';
import { LoginComponent } from '../modules/member/login/login.component';
import { ForgotPasswordComponent } from '../modules/member/forgot-password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../modules/member/forgot-password/reset-password/reset-password.component';
import { RegisterSuccessComponent } from '../modules/views/register-success/register-success.component';

const MemberRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'activation/:activation', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:code', component: ResetPasswordComponent },
  { path: 'register-success', component: RegisterSuccessComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(MemberRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class MemberRoutingModule { }
