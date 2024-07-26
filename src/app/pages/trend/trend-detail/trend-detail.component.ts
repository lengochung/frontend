import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { SubjectService, TrendService } from '../../../core/services';
import { TrendFilterEntity } from '../../../core/entities';

@Component({
    templateUrl: './trend-detail.component.html',
    standalone: true,
    imports: [SHARED_MODULE],
})
export class TrendDetailComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private _subscriptionList: Subscription[] = [];
    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.trend_management') as string,
            link: this.Constants.APP_URL.TREND.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public trendTable?: TrendFilterEntity;
    public items = [
        {
            id: 1,
            name: "タイプ1",
        },
        {
            id: 2,
            name: "タイプ2",
        },
    ];
    public commentList = [
        {
            id: 1,
            name: "有",
        },
        {
            id: 0,
            name: "無",
        },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _trendService: TrendService,
        private _subjectService: SubjectService,
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._getTrendList();
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * Get trend list
     * @returns {void}
     */
    private _getTrendList(): void {
        const params = {};
        const sub = this._trendService.getTrendList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.trendTable = rsp.data;
            },
        });
        this._subscriptionList.push(sub);
    }

    /**
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.TREND.MODULE]);
    }

}
