import { Routes } from '@angular/router';
import { ChangeOrderDetailComponent } from './change-order-detail/change-order-detail.component';
import Constants from '../../utils/constants';
import { ChangeOrderListComponent } from './change-order-list/change-order-list.component';

export const routes: Routes = [
    {
        path: '',
        component: ChangeOrderListComponent,
    },
    {
        path: `${Constants.APP_URL.CHANGE_ORDER.DETAIL}/:id`,
        component: ChangeOrderDetailComponent
    },
    {
        path: `${Constants.APP_URL.CHANGE_ORDER.CREATE}`,
        component: ChangeOrderDetailComponent
    }
];
