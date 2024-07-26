import { Routes } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import Constants from '../../utils/constants';
import { DivisionListComponent } from './division-list/division-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: Constants.APP_URL.MANAGEMENTS.ROLE,
        pathMatch: 'full'
    },
    {
        path: Constants.APP_URL.MANAGEMENTS.ROLE,
        component: RoleListComponent,
    },
    {
        path: Constants.APP_URL.MANAGEMENTS.DIVISIONS,
        component: DivisionListComponent
    },
];
