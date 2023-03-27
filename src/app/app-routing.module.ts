import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from './features/home/pages/login-page/login-page.component';
import { SignUpPageComponent } from './features/home/pages/sign-up-page/sign-up-page.component';
import { AuthGuard } from './core/guards/auth.guard';

const homeModule = () => import('./features/home/home.module').then(m => m.HomeModule);
const userModule = () => import('./features/user/user.module').then(m => m.UserModule);

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: homeModule},
  { path: 'users', loadChildren: userModule, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignUpPageComponent },

  // Page Not Found
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { enableTracing: true})], // log all Router events
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
