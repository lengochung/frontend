import { Routes } from '@angular/router';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { NoticeDetailComponent } from './notice-detail/notice-detail.component';
import Constants from '../../utils/constants';
import { NoticeMobileComponent } from './notice-mobile/notice-mobile.component';

export const routes: Routes = [
    {
        path: '',
        component: NoticeListComponent,
    },
    {
        path: `${Constants.APP_URL.NOTICES.DETAIL}/:${Constants.PARAM_KEY.ID}`,
        component: NoticeDetailComponent
    },
    {
        path: `${Constants.APP_URL.NOTICES.CREATE}`,
        component: NoticeDetailComponent
    },
    {
        path: `${Constants.APP_URL.NOTICES.MOBILE}/:${Constants.PARAM_KEY.ID}`,
        component: NoticeMobileComponent
    },
];
