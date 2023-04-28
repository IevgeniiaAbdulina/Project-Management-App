import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from './features/user/models/user';
import { AuthUserService } from './features/user/services/auth-user/auth-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  user?: User | null;
  constructor(public authUserService: AuthUserService) {
    this.authUserService.user.subscribe(u => this.user = u);
  }

  logout() {
    this.authUserService.logout();
  }
}
