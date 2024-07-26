import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { PreventionReportService, SubjectService } from '../../../core/services';
import { PreventionReportEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { PreventionReportValidator } from '../validator/prevention-report.validator';

@Component({
    templateUrl: './prevention-report-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        UploadComponent
    ],
})
export class PreventionReportDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public isEdit = false;
    public preventionReportInfo?: PreventionReportEntity;
    public validator: PreventionReportValidator;
    public form!: ReturnType<typeof this.validator.createRules>;

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.prevention_measures') as string,
            link: this.Constants.APP_URL.PREVENTION_REPORT.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.prevention_measures') as string,
            link: this.Constants.APP_URL.PREVENTION_REPORT.MODULE,
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

    public sourceList = [
        {
            id: 1,
            name: '自事業所の是正処置事例'
        },
        {
            id: 2,
            name: '社内他事業所の是正処置事例'
        },
        {
            id: 3,
            name: '社外・他社における是正処置事例'
        },
    ];
    public targetBusinessList = [
        {
            id: 1,
            name: '対象事業所1'
        },
        {
            id: 2,
            name: '対象事業所2'
        }
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
    public eventList = [
        {
            id: 1,
            name: '顧客クレーム'
        },
        {
            id: 2,
            name: '製造障害'
        },
        {
            id: 3,
            name: '原動障害'
        },
        {
            id: 4,
            name: '監査上の問題'
        },
    ];
    public reportList = [
        {
            id: 1,
            name: "有"
        },
        {
            id: 0,
            name: "無"
        }
    ];
    public effectivenessList = [
        {
            id: 1,
            name: "OK"
        },
        {
            id: 0,
            name: "NG"
        }
    ]

    /** Constructor */
    constructor(
        private _router: Router,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _preventionReportService: PreventionReportService,
        private _toastrService: ToastrService,
    ) {
        super();
        this.validator = new PreventionReportValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const preventionReportId = Number(id);
                this.isEdit = true;
                this._getPreventionReportDetail(preventionReportId);
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
        void this._router.navigate([this.Constants.APP_URL.PREVENTION_REPORT.MODULE]);
    }

    /**
     * Reset form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onCreateNew(): void {
        if (this.isEdit) {
            void this._router.navigate([`${this.Constants.APP_URL.PREVENTION_REPORT.MODULE}/${this.Constants.APP_URL.PREVENTION_REPORT.CREATE}`]);
        } else {
            this.form.reset();
            //reset file
        }
    }

    /**
     * get prevention report detail
     * @author DuyPham
     *
     * @param {number} id prevention report id
     * @returns {void}
     */
    private _getPreventionReportDetail(id: number): void {
        const params = {id: id};
        const sub = this._preventionReportService.getPreventionReportDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.preventionReportInfo = rsp.data;
                // this.Lib.assignDataFormControl(this.form.controls, this.preventionReportInfo);
                this.form.patchValue(this.preventionReportInfo);
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
        const params = Object.assign({}, this.form.value) as PreventionReportEntity;
        const sub = this._preventionReportService.onSave(params).subscribe({
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
