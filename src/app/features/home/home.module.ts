import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { MaterialDesignModule } from 'src/app/shared/material-design/material-design.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { HomeRoutingModule } from './home-routing.module';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages/error-messages.component';
import { MatInputModule } from '@angular/material/input';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    WelcomePageComponent,
    LoginPageComponent,
    SignUpPageComponent
  ],
  imports: [
    RouterModule,
    HomeRoutingModule,
    CommonModule,
    CoreModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    ErrorMessagesComponent,
  ],
  exports: [
    WelcomePageComponent,
    LoginPageComponent,
    SignUpPageComponent,
  ]
})
export class HomeModule { }
