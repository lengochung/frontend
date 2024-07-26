import { Routes } from '@angular/router';
import { CorrectiveReportDetailComponent } from './corrective-report-detail/corrective-report-detail.component';
import Constants from '../../utils/constants';
import { CorrectiveReportListComponent } from './corrective-report-list/corrective-report-list.component';

export const routes: Routes = [
    {
        path: '',
        component: CorrectiveReportListComponent,
    },
    {
        path: `${Constants.APP_URL.CORRECTIVE_REPORT.DETAIL}/:id`,
        component: CorrectiveReportDetailComponent
    },
    {
        path: `${Constants.APP_URL.CORRECTIVE_REPORT.CREATE}`,
        component: CorrectiveReportDetailComponent
    }
];
