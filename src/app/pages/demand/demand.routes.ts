import { Routes } from '@angular/router';
import Constants from '../../utils/constants';
import { DemandListComponent } from './demand-list/demand-list.component';
import { DemandInitialComponent } from './demand-initial/demand-initial.component';
import { DemandDetailComponent } from './demand-detail/demand-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: DemandListComponent,
    },
    {
        path: `${Constants.APP_URL.DEMAND.DETAIL}/:id`,
        component: DemandDetailComponent
    },
    {
        path: `${Constants.APP_URL.DEMAND.CREATE}`,
        component: DemandInitialComponent
    },
    {
        path: `${Constants.APP_URL.DEMAND.INTI}/:id`,
        component: DemandInitialComponent
    }
];
