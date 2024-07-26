import { Routes } from '@angular/router';
import Constants from '../../utils/constants';
import { ConstructionDetailComponent } from './construction-detail/construction-detail.component';
import { ConstructionListComponent } from './construction-list/construction-list.component';

export const routes: Routes = [
    {
        path: '',
        component: ConstructionListComponent,
    },
    {
        path: `${Constants.APP_URL.CONSTRUCTION.DETAIL}/:id`,
        component: ConstructionDetailComponent
    },
    {
        path: `${Constants.APP_URL.CONSTRUCTION.CREATE}`,
        component: ConstructionDetailComponent
    }
];
