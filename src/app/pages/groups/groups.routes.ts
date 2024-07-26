import { Routes } from '@angular/router';
import Constants from '../../utils/constants';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupListComponent } from './group-list/group-list.component';

export const routes: Routes = [
    {
        path: '',
        component: GroupListComponent,
    },
    {
        path: `${Constants.APP_URL.GROUP.DETAIL}/:id`,
        component: GroupDetailComponent
    },
    {
        path: `${Constants.APP_URL.GROUP.CREATE}`,
        component: GroupDetailComponent
    }
];
