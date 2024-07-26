import { Routes } from '@angular/router';
import Constants from '../../utils/constants';
import { PreventionReportListComponent } from './prevention-report-list/prevention-report-list.component';
import { PreventionReportDetailComponent } from './prevention-report-detail/prevention-report-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: PreventionReportListComponent,
    },
    {
        path: `${Constants.APP_URL.PREVENTION_REPORT.DETAIL}/:id`,
        component: PreventionReportDetailComponent
    },
    {
        path: `${Constants.APP_URL.PREVENTION_REPORT.CREATE}`,
        component: PreventionReportDetailComponent
    }
];
