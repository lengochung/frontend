import { Routes } from '@angular/router';
import { IncidentReportDetailComponent } from './incident-report-detail/incident-report-detail.component';
import Constants from '../../utils/constants';
import { IncidentReportListComponent } from './incident-report-list/incident-report-list.component';

export const routes: Routes = [
    {
        path: '',
        component: IncidentReportListComponent,
    },
    {
        path: `${Constants.APP_URL.INCIDENT_REPORT.DETAIL}/:id`,
        component: IncidentReportDetailComponent
    },
    {
        path: `${Constants.APP_URL.INCIDENT_REPORT.CREATE}`,
        component: IncidentReportDetailComponent
    }
];
