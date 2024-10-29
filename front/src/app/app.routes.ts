import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    {path:"", component: LobbyComponent},
    {path:"dashboard", component: DashboardComponent},
    {path:"admin", component: AdminComponent}
];
