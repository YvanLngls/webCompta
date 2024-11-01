import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { AdminTableComponent } from './admin/admin-table/admin-table.component';

export const routes: Routes = [
    {path:"", component: LobbyComponent},
    {path:"dashboard", component: DashboardComponent},
    {path:"admin", component: AdminComponent},
    {path:"admin/table", component: AdminTableComponent}
];
