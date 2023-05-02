import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit{
  constructor(
    private authUserService: AuthUserService,
    private router: Router
  ) {}

  ngOnInit() {
    if(this.authUserService.tokenValue) {
      this.router.navigate(['users/dashboard'])
    }
  }

}
