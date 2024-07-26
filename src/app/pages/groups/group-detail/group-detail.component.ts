import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { GroupService } from '../../../core/services';
import { GroupEntity, MemberGroupEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserSelectComponent } from '../../../core/components/modal/modal-user-select.component';
import { GroupValidator } from '../validator/group.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalApprovalComponent } from '../../../core/components/modal/modal-approval.component';
import { ModalConfirmComponent } from '../../../core/components/modal/modal-confirm.component';

@Component({
    templateUrl: './group-detail.component.html',
    standalone: true,
    imports: [SHARED_MODULE],
})
export class GroupDetailComponent extends BaseComponent implements OnInit {
    public isEditMode = false;
    public groupInfo?: GroupEntity;
    public validator: GroupValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public memberList: MemberGroupEntity[] = [{}];
    public isRequired = false;

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.group_management') as string,
            link: this.Constants.APP_URL.GROUP.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.group_management') as string,
            link: this.Constants.APP_URL.GROUP.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _groupService: GroupService,
        private _toastrService: ToastrService,
        private _modalService: NgbModal,
    ) {
        super();
        this.validator = new GroupValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        this._route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const groupId = Number(id);
                this.isEditMode = true;
                this._getGroupDetail(groupId);
            } else {
                this.isRequired = true;
            }
        });
    }

    /**
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.GROUP.MODULE]);
    }

    /**
     * get group detail
     * @author DuyPham
     *
     * @param {number} id group id
     * @returns {void}
     */
    private _getGroupDetail(id: number): void {
        const params = { group_id: id };
        this._groupService
            .getGroupDetail(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.isRequired = true;
                    this.groupInfo = rsp.data;
                    this._updateFormData();
                },
            });
    }

    /**
     * update form
     * @author DuyPham
     *
     * @returns {void}
     */
    private _updateFormData(): void {
        if (this.groupInfo) {
            this.Lib.assignDataFormControl(this.form.controls, this.groupInfo);
            if (this.groupInfo.group_member_list && this.groupInfo.group_member_list.length > 0) {
                this.memberList = this.groupInfo.group_member_list;
            }
            if (this.groupInfo.is_send_request || !this.isAdmin) {
                this.form.disable();
                this.isRequired = false;
            } else if (this.isAdmin) {
                this.form.enable();
                this.isRequired = true;
            }
        }
        this.validator.errors = [];
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

        const memberIdList = this.memberList.filter((p) => p.user_id).map((p) => p.user_id ?? 0);
        if (memberIdList.length === 0) {
            const memLabel = this.translate.instant('label.member') as string;
            const errorList = this.translate.instant('validation.required', {field: memLabel}) as string;
            this.validator.errors = [errorList];
            return;
        }

        const params = Object.assign({}, this.form.value) as GroupEntity;
        params.is_new = !this.isEditMode;
        params.group_id = this.groupInfo?.group_id;
        params.upd_datetime = this.groupInfo?.upd_datetime;
        params.member_id_list = memberIdList;
        this._groupService
            .onSave(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        this.validator.errors = errorList;
                        return;
                    }
                    this._toastrService.success(this.translate.instant('message.save_completed') as string);
                    if (this.isEditMode) {
                        this.groupInfo = rsp.data;
                        this._updateFormData();
                    } else {
                        const groupId = rsp.data.group_id;
                        void this._router.navigate([
                            `${this.Constants.APP_URL.GROUP.MODULE}/${this.Constants.APP_URL.GROUP.DETAIL}/${groupId}`,
                        ]);
                    }
                },
            });
    }

    /**
     * Cancel change group
     * @author DuyPham
     *
     * @returns {void}
     */
    public onCancel(): void {
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('message.cancel_confirm') as string;

        modalInstance.confirm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            const params = {
                group_id: this.groupInfo?.group_id,
                upd_datetime: this.groupInfo?.upd_datetime
            }
            this._groupService
                .onCancel(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp.status || !rsp.data) {
                            const errorList = this.getApiErrorMessages(rsp.msg);
                            this.validator.errors = errorList;
                            return;
                        }
                        this.groupInfo = rsp.data;
                        this._updateFormData();
                        this._toastrService.success(this.translate.instant('message.cancel_completed') as string);
                    },
                });
        });
    }

    /**
     * Send to approver
     * @author DuyPham
     *
     * @returns {void}
     */
    public onSendApproval(): void {
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('message.forward_confirm') as string;

        modalInstance.confirm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            const params = {
                group_id: this.groupInfo?.group_id,
                upd_datetime: this.groupInfo?.upd_datetime
            }
            this._groupService
                .onSendApproval(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp.status || !rsp.data) {
                            const errorList = this.getApiErrorMessages(rsp.msg);
                            this.validator.errors = errorList;
                            return;
                        }
                        this.groupInfo = rsp.data;
                        this._updateFormData();
                        this._toastrService.success(this.translate.instant('message.forward_approver_completed') as string);
                    },
                });
        });
    }

    /**
     * Approval
     * @author DuyPham
     *
     * @returns {void}
     */
    public onApproval(): void {
        const modal = this._modalService.open(ModalApprovalComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalApprovalComponent;

        modalInstance.comment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((comment: string) => {
            const params = {
                group_id: this.groupInfo?.group_id,
                upd_datetime: this.groupInfo?.upd_datetime,
                comment: comment
            }
            this._groupService
                .onApproval(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp.status || !rsp.data) {
                            const errorList = this.getApiErrorMessages(rsp.msg);
                            this.validator.errors = errorList;
                            return;
                        }
                        this.groupInfo = rsp.data;
                        this._updateFormData();
                        this._toastrService.success(this.translate.instant('message.approval_success') as string);
                    },
                });
        });

    }

    /**
     * Approval
     * @author DuyPham
     *
     * @returns {void}
     */
    public onReject(): void {
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('message.reject_confirm') as string;

        modalInstance.confirm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            const params = {
                group_id: this.groupInfo?.group_id,
                upd_datetime: this.groupInfo?.upd_datetime
            }
            this._groupService
                .onReject(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp.status || !rsp.data) {
                            const errorList = this.getApiErrorMessages(rsp.msg);
                            this.validator.errors = errorList;
                            return;
                        }
                        this.groupInfo = rsp.data;
                        this._updateFormData();
                        this._toastrService.success(this.translate.instant('message.reject_success') as string);
                    },
                });
        });
    }

    /**
     * add new member
     * @author DuyPham
     *
     * @returns {void}
     */
    public onAddMember(): void {
        this.memberList.push({});
    }

    /**
     * delete member
     * @author DuyPham
     *
     * @param {number} index index
     * @returns {void}
     */
    public onDeleteMember(index: number): void {
        if (this.memberList.length === 1) {
            this.memberList[0].user_id = undefined;
            this.memberList[0].user_full_name = "";
        } else {
            this.memberList.splice(index, 1);
        }
    }

    /**
     * select user
     * @author DuyPham
     *
     * @param {number} index index
     * @returns {void}
     */
    public onSelectUser(index: number): void {
        const modal = this._modalService.open(ModalUserSelectComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalUserSelectComponent;
        const memberIdList = this.memberList.filter((p) => p.user_id).map((p) => p.user_id ?? 0);
        modalInstance.ignoreUserIdList = memberIdList;

        modalInstance.userChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((p) => {
            if (!p) {
                return;
            }
            const user = {
                user_id: p.user_id,
                user_full_name: `${p.user_first_name  } ${ p.user_last_name}`
            }
            this.memberList[index] = user;
        });
    }

    /**
     * check group waiting for approval
     * @author DuyPham
     *
     * @readonly
     * @type {boolean}
     */
    get isSendRequest(): boolean {
        return this.groupInfo?.is_send_request ? true : false;
    }

    /**
     * check role user is admin
     * @author DuyPham
     *
     * @readonly
     * @type {boolean}
     */
    get isAdmin(): boolean {
        return this.groupInfo?.is_admin ? true : false;
    }

    /**
     * check role user is approval
     * @author DuyPham
     *
     * @readonly
     * @type {boolean}
     */
    get isApproval(): boolean {
        return this.groupInfo?.is_approval ? true : false;
    }
}
