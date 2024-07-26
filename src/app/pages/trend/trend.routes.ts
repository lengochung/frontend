import { Routes } from '@angular/router';
import Constants from '../../utils/constants';
import { TrendListComponent } from './trend-list/trend-list.component';
import { TrendDetailComponent } from './trend-detail/trend-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: TrendListComponent,
    },
    {
        path: `${Constants.APP_URL.INSPECTION_DATA.CREATE}`,
        component: TrendDetailComponent
    }
];
