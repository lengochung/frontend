import { Routes } from '@angular/router';
import { InOpeManageListComponent } from './in-ope-manage-list/in-ope-manage-list.component';
import { InOpeManageDetailComponent } from './in-ope-manage-detail/in-ope-manage-detail.component';
import Constants from '../../utils/constants';

export const routes: Routes = [
    {
        path: '',
        component: InOpeManageListComponent,
    },
    {
        path: `${Constants.APP_URL.IN_OPE_MANAGE.DETAIL}/:id`,
        component: InOpeManageDetailComponent
    },
    {
        path: `${Constants.APP_URL.IN_OPE_MANAGE.CREATE}`,
        component: InOpeManageDetailComponent
    }
];
