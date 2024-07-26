import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { IncidentReportService, SubjectService } from '../../../core/services';
import { IncidentReportEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { IncidentReportValidator } from '../validator/incident-report.validator';

@Component({
    templateUrl: './incident-report-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        UploadComponent
    ],
})
export class IncidentReportDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public isEdit = false;
    public incidentReportInfo?: IncidentReportEntity;
    public validator: IncidentReportValidator;
    public form!: ReturnType<typeof this.validator.createRules>;

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.problem_reporting') as string,
            link: this.Constants.APP_URL.INCIDENT_REPORT.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.problem_reporting') as string,
            link: this.Constants.APP_URL.INCIDENT_REPORT.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    public statusList = [
        {
            id: 1,
            name: "ステータス1",
        },
        {
            id: 2,
            name: "ステータス2",
        },
    ];

    public buildingList = [
        {
            id: 1,
            name: '対象建屋1'
        },
        {
            id: 2,
            name: '対象建屋2'
        }
    ];
    public driveList = [
        {
            id: 1,
            name: '原動種類1'
        },
        {
            id: 2,
            name: '原動種類2'
        }
    ];
    public failureRankList = [
        {
            id: 1,
            name: '障害ランク1'
        },
        {
            id: 2,
            name: '障害ランク2'
        }
    ];
    public necessityList = [
        {
            id: 1,
            name: this.translate.instant('label.essential') as string
        },
        {
            id: 0,
            name: this.translate.instant('label.not') as string
        }
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _incidentReportService: IncidentReportService,
        private _toastrService: ToastrService,
    ) {
        super();
        this.validator = new IncidentReportValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const incidentReportId = Number(id);
                this.isEdit = true;
                this._getIncidentReportDetail(incidentReportId);
            }
        });
        this._subscriptionList.push(sub);
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.INCIDENT_REPORT.MODULE]);
    }

    /**
     * Reset form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onCreateNew(): void {
        if (this.isEdit) {
            void this._router.navigate([`${this.Constants.APP_URL.INCIDENT_REPORT.MODULE}/${this.Constants.APP_URL.INCIDENT_REPORT.CREATE}`]);
        } else {
            this.form.reset();
            //reset file
        }
    }

    /**
     * get incident report detail
     * @author DuyPham
     *
     * @param {number} id incident report id
     * @returns {void}
     */
    private _getIncidentReportDetail(id: number): void {
        const params = {id: id};
        const sub = this._incidentReportService.getIncidentReportDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.incidentReportInfo = rsp.data;
                this.Lib.assignDataFormControl(this.form.controls, this.incidentReportInfo);
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * Submit form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onSave(): void {
        this.validator.makeValidator(this.form, this.validator.createErrorMessages());

        if (this.form.invalid) return;
        const params = Object.assign({}, this.form.value) as IncidentReportEntity;
        const sub = this._incidentReportService.onSave(params).subscribe({
            next: (rsp) => {
                if (!rsp.status) {
                    const errorList = this.getApiErrorMessages(rsp.msg);
                    this.validator.errors = errorList;
                    return;
                }
                this._toastrService.success(this.translate.instant('message.update_success', {field: ''}) as string);
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * get display status
     * @author DuyPham
     *
     * @param {number} id id
     * @returns {string} display name
     */
    public getStatusName(id?: number): string {
        return this.statusList?.find(p => p.id === id)?.name ?? '';
    }

}
