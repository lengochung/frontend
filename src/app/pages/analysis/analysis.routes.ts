import { Routes } from '@angular/router';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import Constants from '../../utils/constants';
import { AnalysisDetailComponent } from './analysis-detail/analysis-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: AnalysisListComponent,
    },
    {
        path: `${Constants.APP_URL.ANALYSIS.CREATE}`,
        component: AnalysisDetailComponent
    }
];
