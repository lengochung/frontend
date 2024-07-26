import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { StandardDocumentService, SubjectService } from '../../../core/services';
import { NoticesEntity, StandardDocumentEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { StandardDocumentValidator } from '../validator/standard-document.validator';
import { FormArray } from '@angular/forms';
import { ModalUserSelectComponent } from '../../../core/components/modal/modal-user-select.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './standard-document-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE
    ],
})
export class StandardDocumentDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public validator: StandardDocumentValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public standardDocumentInfo?: StandardDocumentEntity;
    public isEdit = false;

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

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.standard_document_management') as string,
            link: this.Constants.APP_URL.STANDARD_DOCUMENT.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.standard_document_management') as string,
            link: this.Constants.APP_URL.STANDARD_DOCUMENT.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _standardDocumentService: StandardDocumentService,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _modalService: NgbModal,
    ) {
        super();
        this.validator = new StandardDocumentValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const standardDocumentId = Number(id);
                this.isEdit = true;
                this._getStandardDocumentDetail(standardDocumentId);
            }
            this.createComment();
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
     * get notice detail
     * @author DuyPham
     *
     * @param {number} id notice id
     * @returns {void}
     */
    private _getStandardDocumentDetail(id: number): void {
        const params = {id: id};
        const sub = this._standardDocumentService.getStandardDocumentDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.standardDocumentInfo = rsp.data;

                this.Lib.assignDataFormControl(this.form.controls, this.standardDocumentInfo);

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
        const params = Object.assign({}, this.form.value) as NoticesEntity;
        const sub = this._standardDocumentService.onSave(params).subscribe({
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
        void this._router.navigate([this.Constants.APP_URL.STANDARD_DOCUMENT.MODULE]);
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
            void this._router.navigate([`${this.Constants.APP_URL.STANDARD_DOCUMENT.MODULE}/${this.Constants.APP_URL.STANDARD_DOCUMENT.CREATE}`]);
        } else {
            // this.form.reset();
            //reset file
        }
    }

    /**
     * Get comment formArray
     * @author DuyPham
     *
     * @readonly
     * @type {FormArray}
     */
    get commentFormArray(): FormArray {
        return this.form.controls['comment_list'] as FormArray;
    }

    /**
     * create comment
     * @author DuyPham
     *
     * @returns {void}
     */
    public createComment(): void {
        this.commentFormArray.push(this.validator.createCommentRules());
    }

    /**
     * select user
     * @author DuyPham
     *
     * @returns {void}
     */
    public onSelectUser(): void {
        const modal = this._modalService.open(ModalUserSelectComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalUserSelectComponent;

        const modalSubscription = modalInstance.userChange.subscribe((p) => {
            if (!p) {
                return;
            }


        });
        this._subscriptionList.push(modalSubscription);
    }
}
