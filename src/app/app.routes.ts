import { Routes } from '@angular/router';
import Constants from './utils/constants';
import { LoginComponent } from './pages/auth/login/login.component';
import { NotFoundComponent } from './pages/error-page/not-found/not-found.component';
import { MasterTemplateComponent } from './pages/templates/master-template/master-template.component';
import { SingleTemplateComponent } from './pages/templates/single-template/single-template.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: Constants.APP_URL.AUTH.MODULE,
        component: SingleTemplateComponent,
        children: [
            { path: Constants.APP_URL.AUTH.LOGIN, component: LoginComponent, }
        ]
    },
    {
        path: '',
        component: MasterTemplateComponent,
        children: [
            {
                path: '',
                redirectTo: `${Constants.APP_URL.DASHBOARD}`,
                pathMatch: 'full'
            },
            {
                path: `${Constants.APP_URL.DASHBOARD}`,
                component: DashboardComponent
            },
            {
                path: Constants.APP_URL.USERS.MODULE,
                loadChildren: ()=> import('./pages/users/users.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.MANAGEMENTS.MODULE,
                loadChildren: ()=> import('./pages/managements/managements.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.NOTICES.MODULE,
                loadChildren: ()=> import('./pages/notices/notices.routes').then(m => m.routes),
                data: {
                    page_no: 5
                }
            },
            {
                path: Constants.APP_URL.DAILY_REPORT.MODULE,
                loadChildren: ()=> import('./pages/daily-report/daily-report.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.INCIDENT_REPORT.MODULE,
                loadChildren: ()=> import('./pages/incident-report/incident-report.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.CORRECTIVE_REPORT.MODULE,
                loadChildren: ()=> import('./pages/corrective-report/corrective-report.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.PREVENTION_REPORT.MODULE,
                loadChildren: ()=> import('./pages/prevention-report/prevention-report.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.TOPIC.MODULE,
                loadChildren: ()=> import('./pages/topic/topic.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.GROUP.MODULE,
                loadChildren: ()=> import('./pages/groups/groups.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.IN_OPE_MANAGE.MODULE,
                loadChildren: ()=> import('./pages/in-ope-manage/in-ope-manage.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.CONSTRUCTION.MODULE,
                loadChildren: ()=> import('./pages/construction/construction.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.ALARM_HISTORY.MODULE,
                loadChildren: ()=> import('./pages/alarm-history/alarm-history.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.DEMAND.MODULE,
                loadChildren: ()=> import('./pages/demand/demand.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.STANDARD_DOCUMENT.MODULE,
                loadChildren: ()=> import('./pages/standard-document/standard-document.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.ANALYSIS.MODULE,
                loadChildren: ()=> import('./pages/analysis/analysis.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.INSPECTION_DATA.MODULE,
                loadChildren: ()=> import('./pages/inspection-data/inspection-data.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.CHANGE_ORDER.MODULE,
                loadChildren: ()=> import('./pages/change-order/change-order.routes').then(m => m.routes)
            },
            {
                path: Constants.APP_URL.TREND.MODULE,
                loadChildren: ()=> import('./pages/trend/trend.routes').then(m => m.routes)
            },
            {
                path: '**',
                component: NotFoundComponent
            }
        ]
    }
];
