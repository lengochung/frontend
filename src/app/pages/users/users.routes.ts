import { Routes } from '@angular/router';
import Constants from '../../utils/constants';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserAccountComponent } from './user-account/user-account.component';

export const routes: Routes = [
	{
		path: '',
		component: UserListComponent,
	},
    {
        path: Constants.APP_URL.USERS.CREATE,
        component: UserCreateComponent
    },
    {
        path: `${Constants.APP_URL.USERS.EDIT}/:id`,
        component: UserCreateComponent
    },
    {
        path: `${Constants.APP_URL.USERS.DETAIL}/:id`,
        component: UserDetailComponent
    },
    {
        path: `${Constants.APP_URL.USERS.USER_ACCOUNT}`,
        component: UserAccountComponent
    }
];
