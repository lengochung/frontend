import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { InspectionDataService, SubjectService } from '../../../core/services';
import { InspectionDataFilterEntity } from '../../../core/entities';

@Component({
    templateUrl: './inspection-data-detail.component.html',
    standalone: true,
    imports: [SHARED_MODULE],
})
export class InspectionDataDetailComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private _subscriptionList: Subscription[] = [];
    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.inspection_data_recording_and_management') as string,
            link: this.Constants.APP_URL.INSPECTION_DATA.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public inspectionDataTable?: InspectionDataFilterEntity;
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
        private _inspectionDataService: InspectionDataService,
        private _subjectService: SubjectService,
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._getInspectionDataList();
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * Get inspection data list
     * @returns {void}
     */
    private _getInspectionDataList(): void {
        const params = {};
        const sub = this._inspectionDataService.getInspectionDataList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.inspectionDataTable = rsp.data;
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
        void this._router.navigate([this.Constants.APP_URL.INSPECTION_DATA.MODULE]);
    }

}
