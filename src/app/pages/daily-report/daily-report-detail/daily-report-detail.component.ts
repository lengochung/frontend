import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { CommentService, DailyReportService, SubjectService } from '../../../core/services';
import { DailyReportEntity, TopicsEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { UserService } from '../../../core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../../core/components/modal/modal-confirm.component';
import { ModalDailyReportConfirmComponent } from '../modal-daily-report-confirm/modal-daily-report-confirm.component';
import { FormArray } from '@angular/forms';
import { DailyReportValidator } from '../validator/daily-report.validator';

@Component({
    templateUrl: './daily-report-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        UploadComponent,
        ModalDailyReportConfirmComponent
    ],
})
export class DailyReportDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public validator: DailyReportValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public dailyReportInfo?: DailyReportEntity;
    public isEdit = false;
    public managerMessage = "";
    public customerMessage = "";
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

    public continueList = [
        {
            id: 1,
            name: this.translate.instant('label.continuation') as string
        },
        {
            id: 0,
            name: this.translate.instant('label.end') as string
        }
    ]

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.daily_report') as string,
            link: this.Constants.APP_URL.DAILY_REPORT.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.daily_report') as string,
            link: this.Constants.APP_URL.DAILY_REPORT.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _dailyReportService: DailyReportService,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _userService: UserService,
        private _commentService: CommentService,
        private _modalService: NgbModal
    ) {
        super();
        this.validator = new DailyReportValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const dailyReportId = Number(id);
                this.isEdit = true;
                this._getDailyReportDetail(dailyReportId);
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
     * get dailyReport detail
     * @author DuyPham
     *
     * @param {number} id dailyReport id
     * @returns {void}
     */
    private _getDailyReportDetail(id: number): void {
        const params = {id: id};
        const sub = this._dailyReportService.getDailyReportDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.dailyReportInfo = rsp.data;
                // this.Lib.assignDataFormControl(this.form.controls, this.dailyReportInfo);
                this.form.patchValue(this.dailyReportInfo);

                if (this.dailyReportInfo.topic_list) {
                    this._addTopicList(this.dailyReportInfo.topic_list);
                }
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
        const params = Object.assign({}, this.form.value) as DailyReportEntity;
        const sub = this._dailyReportService.onSave(params).subscribe({
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
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.DAILY_REPORT.MODULE]);
    }

    /**
     * confirm
     * @author DuyPham
     *
     * @returns {void}
     */
    public onConfirm(): void {
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = "確認してよろしいですか？";

        const modalSubscription = modalInstance.confirm.subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            const sub = this._dailyReportService.onConfirm(this.managerMessage).subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                }
            });
            this._subscriptionList.push(sub);

        });
        this._subscriptionList.push(modalSubscription);
    }

    /**
     * Show user confirm list
     * @author DuyPham
     *
     * @returns {void}
     */
    public onShowUserConfirm(): void {
        const modal = this._modalService.open(ModalDailyReportConfirmComponent, {
            centered: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const modalInstance = modal.componentInstance as ModalDailyReportConfirmComponent;

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


    /**
     * Reset form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onCreateNew(): void {
        if (this.isEdit) {
            void this._router.navigate([`${this.Constants.APP_URL.DAILY_REPORT.MODULE}/${this.Constants.APP_URL.DAILY_REPORT.CREATE}`]);
        } else {
            this.form.reset();
            //reset file
        }
    }

    /**
     * Get topic formArray
     * @author DuyPham
     *
     * @readonly
     * @type {FormArray}
     */
    get topicsFormArray(): FormArray {
        return this.form.controls['topic_list'] as FormArray;
    }

    /**
     * Add topic list to formArray
     * @author DuyPham
     *
     * @param {TopicEntity[]} topicList topicList
     * @returns {void}
     */
    private _addTopicList(topicList: TopicsEntity[]): void {
        topicList.forEach(item => {
            const formRule = this.validator.createTopicRules(item);
            this.topicsFormArray.push(formRule);
        })
    }

    /**
     * deadline select change
     * @author DuyPham
     *
     * @param {{id: number}} value selected value
     * @param {number} index formarray index
     * @returns {void}
     */
    public onDeadlineChanged(value: {id: number}, index: number): void {
        const controls  = this.topicsFormArray.at(index);
        if (!controls) return;
        if (value.id) {
            controls.get('deadline')?.enable();
            controls.get('complete_date')?.enable();
        } else {
            controls.get('deadline')?.disable();
            controls.get('complete_date')?.disable();
        }
    }

}
