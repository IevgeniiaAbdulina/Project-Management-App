import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { MaterialDesignModule } from '../shared/material-design/material-design.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './interceptors/api/api.interceptor';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { LoadingProgressBarComponent } from './components/loading-progress-bar/loading-progress-bar.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotFoundPageComponent,
    LoadingProgressBarComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MatSnackBarModule
  ],
  imports: [
    RouterModule,
    CommonModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    MatTooltipModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
})
export class CoreModule { }
