import { Routes } from '@angular/router';
import { DailyReportDetailComponent } from './daily-report-detail/daily-report-detail.component';
import Constants from '../../utils/constants';
import { DailyReportListComponent } from './daily-report-list/daily-report-list.component';

export const routes: Routes = [
    {
        path: '',
        component: DailyReportListComponent,
    },
    {
        path: `${Constants.APP_URL.DAILY_REPORT.DETAIL}/:id`,
        component: DailyReportDetailComponent
    },
    {
        path: `${Constants.APP_URL.DAILY_REPORT.CREATE}`,
        component: DailyReportDetailComponent
    }
];
