import { Routes } from '@angular/router';
import Constants from '../../utils/constants';
import { StandardDocumentDetailComponent } from './standard-document-detail/standard-document-detail.component';
import { StandardDocumentListComponent } from './standard-document-list/standard-document-list.component';

export const routes: Routes = [
    {
        path: '',
        component: StandardDocumentListComponent,
    },
    {
        path: `${Constants.APP_URL.STANDARD_DOCUMENT.DETAIL}/:id`,
        component: StandardDocumentDetailComponent
    },
    {
        path: `${Constants.APP_URL.STANDARD_DOCUMENT.CREATE}`,
        component: StandardDocumentDetailComponent
    }
];
