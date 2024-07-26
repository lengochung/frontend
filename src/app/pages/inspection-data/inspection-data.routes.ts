import { Routes } from '@angular/router';
import { InspectionDataListComponent } from './inspection-data-list/inspection-data-list.component';
import Constants from '../../utils/constants';
import { InspectionDataDetailComponent } from './inspection-data-detail/inspection-data-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: InspectionDataListComponent,
    },
    {
        path: `${Constants.APP_URL.INSPECTION_DATA.CREATE}`,
        component: InspectionDataDetailComponent
    }
];
