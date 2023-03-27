import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardPageComponent } from "./pages/dashboard-page/dashboard-page.component";
import { BoardPageComponent } from "./pages/board-page/board-page.component";
import { EditUserProfileComponent } from "./pages/edit-user-profile/edit-user-profile.component";

const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent},
  { path: 'boards/:id', component: BoardPageComponent },
  { path: 'profile', component: EditUserProfileComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule {}
