import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalConfirmComponent } from '../../../core/components/modal/modal-confirm.component';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { DivisionsEntity, DivisionsSearchEntity, ItemsEntity, NoticesEntity, PagesEntity, RoleEntity, SelectLoadingEntity, TopicsEntity, UploadedDataEntity, UploadFile, UserEntity, UserSearchEntity, UserUnionGroupEntity, UserUnionGroupSearchEntity } from '../../../core/entities';
import { NoticesCommentsEntity, NoticesCommentsSearchEntity } from '../../../core/entities/notices-comments.entity';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { DivisionsService, ItemsService, NoticesCommentsService, NoticesService, RoleService, TopicsService } from '../../../core/services';
import { UploadFileService } from '../../../core/services/upload.file.service';
import { UserUnionGroupService } from '../../../core/services/user-union-group.service';
import { UserService } from '../../../core/services/user.service';
import { NoticeValidator } from '../validator/notice.validator';
import { NoticesCommentsValidator } from '../validator/notices-comments.validator';
import { AutocompleteComponent } from '../../../core/components/autocomplete/autocomplete.component';

@Component({
    templateUrl: './notice-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        UploadComponent,
        AutocompleteComponent
    ],
})
export class NoticeDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public validator: NoticeValidator;
    public noticesCommentsValidator: NoticesCommentsValidator;
    public noticesCommentsUpdateValidator: NoticesCommentsValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public noticeCommentForm!: ReturnType<typeof this.noticesCommentsValidator.createRules>;
    public noticeCommentUpdateForm!: ReturnType<typeof this.noticesCommentsUpdateValidator.createRules>;
    /**
     *
     */
    public noticeInfo: NoticesEntity = {};
    public isEdit = false;
    public userList: UserEntity[] = [];

    /**
     * Upload file
     */
    public noticeUploadFiles?: UploadFile[];
    public noticeCommentUploadFiles?: UploadFile[];
    public commentUploadFiles?: UploadFile[];
    public noticeCommentFiles?: UploadFile[];

    public commentList: NoticesCommentsEntity[] = [];
    public commentListEdit: NoticesCommentsEntity[] = [];

    public statusList: DivisionsEntity[] = [];
    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.transfer') as string,
            link: this.Constants.APP_URL.NOTICES.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.transfer') as string,
            link: this.Constants.APP_URL.NOTICES.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];
    /**
     * ng-select
     */
    userSelectE = new SelectLoadingEntity<UserEntity>();
    recipientSelectE = new SelectLoadingEntity<UserUnionGroupEntity>();
    buildingSelectE = new SelectLoadingEntity<DivisionsEntity>();
    fuelTypeSelectE = new SelectLoadingEntity<ItemsEntity>();
    facilitySelectE = new SelectLoadingEntity<DivisionsEntity>();
    /**
     *
     */
    noticeCommentSearchE: NoticesCommentsSearchEntity = {};
    // Current route page
    dataPage?: PagesEntity;
    // Current user role
    userRole?: RoleEntity|null;
    public buildingParams = {
        type: 88
    };
    public fuelParams = {
        function_name: '共通',
        page_name: '原動種類',
        page: 0
    };
    public facilityParams = {
        type: 0
    };
    /** Constructor */
    constructor(
        private _router: Router,
        private _noticeService: NoticesService,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _userService: UserService,
        private _modalService: NgbModal,
        private _divisionService: DivisionsService,
        private _userUnionGroupService: UserUnionGroupService,
        private _noticesCommentsService: NoticesCommentsService,
        private _topicService: TopicsService,
        private _uploadFileService: UploadFileService,
        private _roleService: RoleService,
        private _itemsService: ItemsService
    ) {
        super();
        this.validator = new NoticeValidator();
        this.noticesCommentsValidator = new NoticesCommentsValidator();
        this.noticesCommentsUpdateValidator = new NoticesCommentsValidator();
        /**
         * Get user role
         * Check redirect and remote buttons
         */
        this._roleService.getRoleCurrentUser()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rs => {
                if(!rs || !rs.status || !rs.data) { // User has no roles
                    void this._router.navigate([this.Constants.APP_URL.DASHBOARD]);
                }
                // User has roled
                // If user notice_role is false, redirect to dashboard
                const role = rs.data;
                if(!role?.notice_role) {
                    void this._router.navigate([this.Constants.APP_URL.DASHBOARD]);
                }
                this.userRole = role;
            });
        /**
         * Get data of route
         */
        this.dataPage = this._route.snapshot.data as PagesEntity;
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        this.noticeCommentForm = this.noticesCommentsValidator.createRules();
        this.noticeCommentUpdateForm = this.noticesCommentsUpdateValidator.createRules();
        this._route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
            const id = params[this.Constants.PARAM_KEY.ID];
            if (id !== null && this.Lib.isNumber(id)) {
                const noticeId = Number(id);
                this.isEdit = true;
                this._getNoticeDetail(noticeId);
                this._getCommentList(noticeId, true);
            }
        });
        // Get status list (divisions)
        this._getStatusList();
        /**
         * Init data for select
         */
        this._getUserList();
        this._getBuildingList();
        this._getFuelList();
        this._getUserUnionGroupList(false);
    }

    /**
     * Get status list in divisions table from page_id
     * hung.le
     * @returns {void}
    */
    private _getStatusList (): void {
        const params = new DivisionsSearchEntity();
        params.page_id = this.dataPage?.page_no;
        this._divisionService.getStatusListByPageNo(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rs => {
                if(!rs || !rs.status || !rs.data) return;
                this.statusList = rs.data;
            });
    }
    /**
     * Get file list
     * hung.le
     * @params {string} folderPath
     * @returns {void}
    */
    private _getFiles (): void {
        const params = new UploadedDataEntity();
        let folderPath = `${this.userLogin.office_id  }/${this.Constants.APP_URL.NOTICES.MODULE}/${  this.noticeInfo.notice_no}`;
        const attached_file = this.noticeInfo.attached_file;
        folderPath += attached_file ? `/${attached_file}` : '';
        params.folderPath = folderPath;
        params.uploadUrl = this.Constants.API_URL.NOTICES.FILES;
        this._uploadFileService.getFiles(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rs => {
                if(!rs || !rs.status || !rs.data)
                    this.noticeUploadFiles = [];
                else
                    this.noticeUploadFiles = rs.data;
            });
    }
    /**
     * Get comment file list
     * hung.le
     * @params {string} folderPath
     * @returns {void}
    */
    private _getCommentFiles (): void {
        const params = new UploadedDataEntity();
        const folderPath = `${this.userLogin.office_id  }/${this.Constants.APP_URL.NOTICE_COMMENTS.MODULE}/${  this.noticeInfo.notice_no}`;
        params.folderPath = folderPath;
        params.uploadUrl = this.Constants.API_URL.NOTICES_COMMENTS.FILES;
        this._uploadFileService.getFiles(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rs => {
                if(!rs || !rs.status || !rs.data) return;
                    this.noticeCommentFiles = rs.data;
                    /**
                     * Map files for comment
                     */
                    this.commentList.forEach(comment => {
                        const folderPath = `${this.userLogin.office_id  }/${this.Constants.APP_URL.NOTICE_COMMENTS.MODULE}/${  comment.notice_no  }/${comment.index}`;
                        comment.files = this.noticeCommentFiles?.filter(file => file.file_path?.endsWith(folderPath));
                    });
            });
    }
    /**
     * Init data for select case edit
     *
     * @returns {void}
     */
    private _getDataEditSelect(): void {
        this._divisionService.getDetail({
            division_id: this.noticeInfo?.building_id ?? 0
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(rs => {
            if(!rs || !rs.status || !rs.data) return;
            const divisionE = rs.data;
            const exists = this.buildingSelectE.list.some(item => item.division_id === divisionE.division_id);
            if (!exists) {
                this.buildingSelectE.list.unshift(divisionE);
            }
        });

        /**
         * Init data user select just one record by notice.user_id
         */
        this._itemsService.getDetail({
            item_no: this.noticeInfo?.fuel_type ?? 0
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(rs => {
            if(!rs || !rs.status || !rs.data) return;
            const itemE = rs.data;
            const exists = this.fuelTypeSelectE.list.some(item => item.item_no === itemE.item_no);
            if (!exists) {
                this.fuelTypeSelectE.list.unshift(itemE);
            }
            /**
             * Init dropdown facility by fuel_type
             */
            const params = {...this.facilityParams};
            params.type = itemE.item_no ?? 0;
            this._divisionService
                .getDivisionsDropdown(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp || !rsp.status || !rsp.data) return;
                        this.facilitySelectE.list = rsp.data;
                        // Load detail division facility
                        this._divisionService.getDetail({
                            division_id: this.noticeInfo?.facility_id ?? 0
                        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(rs => {
                            if(!rs || !rs.status || !rs.data) return;
                            const divisionE = rs.data;
                            const exists = this.facilitySelectE.list.some(item => item.division_id === divisionE.division_id);
                            if (!exists) {
                                this.facilitySelectE.list.unshift(divisionE);
                            }
                        });
                    },
                });
        });
    }

    /**
     * get notice detail
     * @author DuyPham
     *
     * @param {number} notice_no notice_no
     * @returns {void}
     */
    private _getNoticeDetail(notice_no: number): void {
        const params = {notice_no};
        this._noticeService.getNoticeDetail(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.noticeInfo = rsp.data;
                    this.noticeInfo.event_date = this.Lib.dateFormat(this.noticeInfo.event_date, 'YYYY/mm/DD', 'YYYY-mm-DD');
                    this.Lib.assignDataFormControl(this.form.controls, this.noticeInfo);
                    /**
                     * Init data select when edit
                     */
                    this._getDataEditSelect();
                    this._getUserListByUserIds();
                    this._getUserUnionGroupList(true);
                    this._getFiles();
                }
            });
    }

    /**
     * Get user list
     * @returns {void}
     */
    private _getUserList(): void{
        const params = new UserSearchEntity();
        params.page = 0;
        params.isPaginate = true;
        this._userService.getUserListSelect(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rsp => {
                if (!rsp.status || !rsp.data) return;
                this.userSelectE.list = rsp.data;
            });
    }

    /**
     * Get user list by user ids
     * Run whern notice detail load success
     * @returns {void}
     */
    private _getUserListByUserIds(): void{
        const params = {
            user_ids: [
                this.noticeInfo.user_id,
                this.noticeInfo.broadcast_user_id,
                this.noticeInfo.close_user_id,
            ]
        } as UserSearchEntity;
        this._userService.getUserListByUserIds(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rsp => {
                if (!rsp.status || !rsp.data) return;
                this.userList = rsp.data;
                const userE = this.userList.find(u => u.user_id === this.noticeInfo.user_id);
                if(userE) {
                    const exists = this.userSelectE.list.some(u => u.user_id === userE.user_id);
                    if (!exists) {
                        this.userSelectE.list.unshift(userE);
                    }
                }
            });
    }
    /**
     * Get user/group list
     * @param {boolean} isEdit isEdit
     * @returns {void}
     */
    private _getUserUnionGroupList(isEdit: boolean): void {
        const params = {
            page: 0,
            notice_no: !this.isEdit ? null : this.noticeInfo.notice_no
        } as UserUnionGroupSearchEntity;
        this._userUnionGroupService.getUserUnionListSelect(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rsp => {
                if (!rsp.status || !rsp.data) return;
                /**
                 * Set value into form
                 */
                if(isEdit) {
                    const dataList = rsp.data;
                    dataList.forEach(user => {
                        const exists = this.recipientSelectE.list.some(u => u.select_id == user.select_id);
                        if (!exists) {
                            this.recipientSelectE.list.unshift(user);
                        }
                    });
                    const select_ids = dataList.map(m => m.select_id);
                    this.form.patchValue({
                        recipient_ids: select_ids
                    });
                } else {
                    this.recipientSelectE.list = rsp.data;
                }
            });
    }
    /**
     * Get comment list
     * @param {number} notice_no notice id
     * @param {boolean} isFirst The first time get data
     * @returns {void}
     */
    private _getCommentList(notice_no: number, isFirst = false): void{
        const params = this.noticeCommentSearchE;
        params.notice_no = notice_no;
        this._noticesCommentsService.getNoticesCommentsByNoticeNo(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rsp => {
                if (!rsp.status || !rsp.data) return;
                if(isFirst) {
                    const pages = Math.ceil(rsp.total_row / this.Constants.PAGINATE_LIMIT);
                    if (pages > 1) {
                        this.noticeCommentSearchE.total_row = rsp.total_row;
                        this.onPaginationNoticeCommentsChange(pages - 1);
                        return;
                    }
                }
                this.commentList = rsp.data;
                this.noticeCommentSearchE.total_row = rsp.total_row;
                this._getCommentFiles();
            });
    }

    /**
     * Callback function triggered when the pagination notices comments changes.
     * @param {number} page The new page number selected.
     * @returns {void}
     */
    public onPaginationNoticeCommentsChange(page: number): void {
        this.noticeCommentSearchE.page = page;
        this.noticeCommentSearchE.isPaginate = true;
        void this._getCommentList(this.noticeInfo.notice_no ?? 0);
    }

    /**
     * Submit form synch notice/send email
     * Save processing is the same onSave function
     * @author hung.le
     * @returns {void}
     */
    public onNoticeClose(): void {
        if(!this.hasRole()) return;
        /**
         * user can close notice with any status of notice
        */
        const params = new NoticesEntity();
        params.notice_no = this.noticeInfo.notice_no;
        params.status_id = this._getStatusId(this.Constants.STATUS_TEXTS.CLOSE);
        if(!params.status_id || params.status_id == 0) {
            this.validator.errors = this.getApiErrorMessages(this.translate.instant('message.notice_status_id'));
            return;
        }
        if(this.getStatusName(this.noticeInfo.status_id) == this.Constants.STATUS_TEXTS.CLOSE) {
            this.toastr.warning(this.translate.instant('message.notice_has_closed') as string);
            return;
        }
        params.close_user_id = this.userLogin.user_id;
        params.upd_datetime = this.noticeInfo.upd_datetime;
        params.edit_type = 3;
        this._noticeService.onSave(params).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rs => {
                if(!rs || !rs.status || !rs.data) {
                    this.toastr.error(rs.msg as string);
                    return;
                }
                // Reload info notice
                this._getNoticeDetail(this.noticeInfo.notice_no ?? 0);
                this.toastr.success(this.translate.instant('message.update_success', {
                    field: this.translate.instant('label.close_info')
                }));
            });
    }

    /**
     * Submit form
     * @author DuyPham
     * @param {number} edit_type == 2 => send-email in backend, update status (起票中) to (周知中)
     * @returns {void}
     */
    public async onSave(edit_type: number): Promise<void> {
        if(!this.hasRole()) return;
        if(edit_type === 0 && (this.noticeInfo.notice_no ?? 0 > 0)) edit_type = 1;
        if((edit_type === 1 || edit_type === 2) && this.getStatusName(this.noticeInfo.status_id) !== this.Constants.STATUS_TEXTS.ON_PROCESS) {
            this.toastr.warning(this.translate.instant('message.notice_has_synched') as string);
            return;
        }
        /** Validate */
        this.validator.makeValidator(this.form, this.validator.createErrorMessages());
        if (this.form.invalid) return;
        /**
         * params
         */
        const params = Object.assign({}, this.form.value) as NoticesEntity;
        params.edit_type = edit_type;
        params.notice_no = this.noticeInfo.notice_no;
        params.upd_datetime = this.noticeInfo.upd_datetime;
        /**
         * Create or update
         * if office_id, user_id, status_id are none
         * set default value for this fields
         * notice.office_id = user.office_id
         * notice.user_id = user.user_id
         * notice.status_id = '起票中'
         */
        params.office_id = this.Lib.isBlank(params.office_id) ? this.userLogin.office_id : params.office_id;
        params.user_id = this.Lib.isBlank(params.user_id) ? this.userLogin.office_id : params.user_id;
        params.broadcast_user_id = this.Lib.isBlank(params.broadcast_user_id) ? this.userLogin.office_id : params.broadcast_user_id;
        if(edit_type === 2) params.status_id = this._getStatusId(this.Constants.STATUS_TEXTS.SYNCHED);
        params.status_id = this.Lib.isBlank(params.status_id) ? this._getStatusId(this.Constants.STATUS_TEXTS.ON_PROCESS) : params.status_id;
        if(!params.status_id || params.status_id == 0) {
            this.validator.errors = this.getApiErrorMessages(this.translate.instant('message.notice_status_id'));
            return;
        }
        /**
         * Append file upload to FormData if exists file chosen.
         */
        if(this.noticeUploadFiles && this.noticeUploadFiles.length > 0) {
            let folderPath = `${this.userLogin.office_id  }/${this.Constants.APP_URL.NOTICES.MODULE}`;
            if(this.noticeInfo.notice_no)
                folderPath += `/${this.noticeInfo.notice_no}`;
            const uploadParams = {
                folderPath: folderPath,
                uploadUrl: this.Constants.API_URL.NOTICES.UPLOAD,
                deleteUrl: this.Constants.API_URL.NOTICES.DELETE_FILE,
                isPendingSubmit: true
            } as UploadedDataEntity;
            const resUploadedData = await this._uploadFileService.uploads(this.noticeUploadFiles, uploadParams);

            if(!resUploadedData) {
                this.toastr.error(this.translate.instant('message.upload_failed') as string);
                return;
            }
            params.attached_file = resUploadedData.attached_file;
            params.synchedFilesData = resUploadedData;
        }
        /**
         * Request save
         */
        this._noticeService.onSave(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp || !rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        this.validator.errors = errorList;
                        return;
                    }
                    /**
                     * if success, reload page with isEdit = true
                     */
                    const noticeInserted = rsp.data;
                    if(!noticeInserted.notice_no) return;
                    const noticeText = this.translate.instant('label.notice_content');
                    if(edit_type === 0) { // If create new sucess, redirect to page notice/detail/id
                        this._toastrService.success(this.translate.instant('message.create_success', {field: noticeText}) as string);
                        void this._router.navigate([`${this.Constants.APP_URL.NOTICES.MODULE  }/${this.Constants.APP_URL.NOTICES.DETAIL}/${noticeInserted.notice_no}`]);
                    } else {
                        this._toastrService.success(this.translate.instant('message.update_success', {field: noticeText}) as string);
                        this._getNoticeDetail(noticeInserted.notice_no);
                    }
                }
            });
    }
    /**
     * Save daily report for notice when status = (周知中)
     * @author hung.le
     * @returns {void}
     */
    public async onDailyReport(): Promise<void> {
        if(!this.hasRole()) return;
        /**
         * params
         */
        const params = Object.assign({}, this.form.value) as TopicsEntity;
        params.notice_no = this.noticeInfo.notice_no;
        params.topic_kbn = 0;
        params.office_id = this.noticeInfo.office_id;
        params.previous_user_id = this.userLogin.user_id;
        params.today_user_id = this.userLogin.user_id;
        params.is_deadline = false;
        if(!this.noticeInfo.status_id || this.noticeInfo.status_id == 0) {
            this.validator.errors = this.getApiErrorMessages(this.translate.instant('message.notice_status_id'));
            return;
        }
        // If notice has closed, return
        if(this.getStatusName(this.noticeInfo.status_id) == this.Constants.STATUS_TEXTS.CLOSE) {
            this.toastr.warning(this.translate.instant('message.notice_has_closed') as string);
            return;
        }
        /**
         * Validate
         */
        const topicForm = this.validator.createTopicRules();
        topicForm.patchValue(params);

        this.validator.makeValidator(topicForm, this.validator.createTopicErrorMessages());
        if (topicForm.invalid) return;
        /**
         * Append file upload to FormData if exists file chosen.
         */
        if(this.noticeUploadFiles && this.noticeUploadFiles.length > 0) {
            const folderPath = `${this.userLogin.office_id  }/${this.Constants.APP_URL.TOPIC.MODULE}`;
            const uploadParams = {
                folderPath: folderPath,
                uploadUrl: this.Constants.API_URL.TOPICS.UPLOAD,
                deleteUrl: this.Constants.API_URL.TOPICS.DELETE_FILE,
                isPendingSubmit: true
            } as UploadedDataEntity;
            const resUploadedData = await this._uploadFileService.uploads(this.noticeUploadFiles, uploadParams);
            if(!resUploadedData) {
                this.toastr.error(this.translate.instant('message.upload_failed') as string);
                return;
            }
            params.attached_file = resUploadedData.attached_file;
            params.synchedFilesData = resUploadedData;
        }
        /**
         * Request save
         */
        this._topicService.onSave(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp || !rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        this.validator.errors = errorList;
                        return;
                    }
                    /**
                     * if success
                     */
                    this._toastrService.success(this.translate.instant('message.save_successful', {field: ''}) as string);
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
        void this._router.navigate([this.Constants.APP_URL.NOTICES.MODULE]);
    }

    /**
     * Delete comment
     * @author DuyPham
     *
     * @param {NoticesCommentsEntity} noticeCommentE noticeCommentE
     * @returns {void}
     */
    public onDeleteComment(noticeCommentE?: NoticesCommentsEntity): void {
        if (!noticeCommentE || !noticeCommentE.notice_no || !noticeCommentE.index) return;
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('message.delete_confirm', {
            field: this.translate.instant('label.comment')
        }) as string;

        modalInstance.confirm.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((status: boolean) => {
                if (!status) {
                    return;
                }
                this._noticesCommentsService.onDelete(noticeCommentE)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                    next: (rsp) => {
                        if (!rsp.status || !rsp.data) {
                            return;
                        }
                        this.commentList = this.commentList?.filter(
                            comment => comment.index != noticeCommentE.index && comment.notice_no == noticeCommentE.notice_no
                        );
                    }
                });
            });
    }

    /**
     * get display status text
     * @author DuyPham
     *
     * @param {number} status_id status_id
     * @returns {string} display name
     */
    public getStatusName(status_id?: number): string {
        return this.statusList?.find(status => status.division_id === status_id)?.candidate ?? '';
    }
    /**
     * get display status text
     * @author DuyPham
     *
     * @param {string} status_text status_text
     * @returns {number} status_id
     */
    private _getStatusId(status_text?: string): any {
        return this.statusList?.find(status => status.candidate === status_text)?.division_id ?? null;
    }


    /**
     * Reset form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onCreateNew(): void {
        if(!this.hasRole()) return;
        if (this.isEdit) {
            void this._router.navigate([`${this.Constants.APP_URL.NOTICES.MODULE}/${this.Constants.APP_URL.NOTICES.CREATE}`]);
        } else {
            this.form.reset();
            //reset file
        }
    }
    /**
     * fetch more data for ng-select users
     * @param {SelectLoadingEntity} selectE selectE
     * @param {string|null} inputValue input value
     * @returns {void}
     */
    public fetchMoreDivisionSelect(selectE: SelectLoadingEntity<DivisionsEntity>, inputValue: string|null): void {
        selectE.page = selectE.page === 0 ? 1 : selectE.page;
        const params: DivisionsSearchEntity = {
            page: selectE.page,
            keyword: inputValue ?? '',
            isPaginate: true
        };
        selectE.loading = true;
        this._divisionService.getAllListSelect(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(
                rs => {
                    if(!rs || !rs.status || !rs.data) return;
                    selectE.loading = false;
                    selectE.page++;
                    selectE.list = [...selectE.list, ...rs.data];
                }
            );
    }
    /**
     * fetch more data for ng-select users
     * @param {SelectLoadingEntity} selectE selectE
     * @param {string|null} inputValue input Value
     * @returns {void}
     */
    public fetchMoreUserSelect(selectE: SelectLoadingEntity<UserEntity>, inputValue: string|null): void {
        selectE.page = selectE.page === 0 ? 1 : selectE.page;
        const params: UserSearchEntity = {
            page: selectE.page,
            keyword: inputValue ?? '',
            isPaginate: true
        };
        selectE.loading = true;
        this._userService.getUserListSelect(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(
                rs => {
                    if(!rs || !rs.status || !rs.data) return;
                    selectE.loading = false;
                    selectE.page++;
                    selectE.list = [...selectE.list, ...rs.data];
                }
            );
    }

    /**
     * fetch more data for ng-select user/group receiving email notice
     * @param {SelectLoadingEntity} selectE selectE
     * @param {string|null} inputValue input value
     * @returns {void}
     */
    public fetchMoreUserUnionGroupSelect(selectE: SelectLoadingEntity<UserUnionGroupEntity>, inputValue: string|null): void {
        selectE.page = selectE.page === 0 ? 1 : selectE.page;
        const params: UserUnionGroupSearchEntity = {
            page: selectE.page,
            keyword: inputValue ?? '',
            isPaginate: true
        };
        selectE.loading = true;
        this._userUnionGroupService.getUserUnionListSelect(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(
                rs => {
                    if(!rs || !rs.status || !rs.data) return;
                    selectE.loading = false;
                    selectE.page++;
                    selectE.list = [...selectE.list, ...rs.data];
                }
            );
    }
    /**
     * Get fullname user from user_id for notices.broadcast_user_id, notices.user_id, notices.close_user_id
     * @param {number} user_id user_id
     * @returns {string} user_fullname
     */
    public getUserFullNameByUserId (user_id: number): string {
        return this.userList.find(u => u.user_id == user_id)?.user_fullname ?? '';
    }

    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * Choose file attached for notice
     * @param {UploadFile[]} uploadFiles list file upload
     * @returns {void}
     */
    public noticeSelectedFilesChange (uploadFiles: UploadFile[]) {
        this.form.patchValue({
            attached_file: !uploadFiles || uploadFiles.length == 0 ? null : "valid"
        })
        this.noticeUploadFiles = uploadFiles;
    }
    /**
     * Choose file attached for notice
     * @param {UploadFile[]} uploadFiles list file upload
     * @returns {void}
     */
    public noticeCommentSelectedFilesChange (uploadFiles: UploadFile[]) {
        this.noticeCommentUploadFiles = uploadFiles;
    }
    /**
     * Choose file attached for notice
     * @param {UploadFile[]} uploadFiles list file upload
     * @returns {void}
     */
    public commentSelectedFilesChange (uploadFiles: UploadFile[]) {
        this.commentUploadFiles = uploadFiles;
    }

    /**
     * Submit form notice comment
     * @author hung.le
     *
     * @returns {void}
     */
    public async onSaveNoticeComment(): Promise<void> {
        this.noticesCommentsValidator.makeValidator(this.noticeCommentForm, this.noticesCommentsValidator.createErrorMessages());
        if (this.noticeCommentForm.invalid) return;

        const params = Object.assign({}, this.noticeCommentForm.value) as NoticesCommentsEntity;
        params.post_user_id = this.userLogin.user_id;
        params.notice_no = this.noticeInfo.notice_no;
        /**
         * Append file upload if exists file chosen.
         */
        if(this.commentUploadFiles && this.commentUploadFiles.length > 0) {
            const folderPath = `${this.userLogin.office_id  }/${this.Constants.APP_URL.NOTICE_COMMENTS.MODULE}/${  this.noticeInfo.notice_no}`;
            const uploadParams = {
                folderPath: folderPath,
                uploadUrl: this.Constants.API_URL.NOTICES_COMMENTS.UPLOAD,
                deleteUrl: this.Constants.API_URL.NOTICES_COMMENTS.DELETE_FILE,
                isPendingSubmit: true
            } as UploadedDataEntity;
            const resUploadedData = await this._uploadFileService.uploads(this.commentUploadFiles, uploadParams);
            if(!resUploadedData) {
                this.toastr.error(this.translate.instant('message.upload_failed') as string);
                return;
            }
            params.attached_file = resUploadedData.attached_file;
            params.synchedFilesData = resUploadedData;
        }

        this._noticesCommentsService.onSave(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(
                rs => {
                    if(!rs || ! rs.status || !rs.data) return;
                    // if save comment success, reload list with newest comments of notice
                    this.noticeCommentForm.patchValue({
                        'post_message': ''
                    });
                    this.noticesCommentsValidator.makeValidator(this.noticeCommentForm, {
                        'post_message': ''
                    });
                    this.commentUploadFiles = [];
                    this._getCommentList(this.noticeInfo.notice_no ?? 0, true);
                }
            );
    }
    /**
     * Update form notice comment
     * @author hung.le
     * @param {NoticesCommentsEntity} noticeCommentE noticeCommentE
     * @returns {void}
     */
    public async onUpdateNoticeComment(noticeCommentE: NoticesCommentsEntity): Promise<void> {
        if(!noticeCommentE.post_message) return;
        const params = noticeCommentE;
        /**
         * Append file upload if exists file chosen.
         */
        if(this.noticeCommentUploadFiles && this.noticeCommentUploadFiles.length > 0) {
            const folderPath = `${this.userLogin.office_id  }/notice-comments/${  this.noticeInfo.notice_no  }/${  noticeCommentE.index}`;
            const uploadParams = {
                folderPath: folderPath,
                uploadUrl: this.Constants.API_URL.NOTICES_COMMENTS.UPLOAD,
                deleteUrl: this.Constants.API_URL.NOTICES_COMMENTS.DELETE_FILE,
                isPendingSubmit: true
            } as UploadedDataEntity;
            const resUploadedData = await this._uploadFileService.uploads(this.noticeCommentUploadFiles, uploadParams);
            if(!resUploadedData) {
                this.toastr.error(this.translate.instant('message.upload_failed') as string);
                return;
            }
            params.attached_file = resUploadedData.attached_file;
            params.synchedFilesData = resUploadedData;
        }

        this._noticesCommentsService.onUpdate(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(rs => {
                if(!rs || ! rs.status || !rs.data) return;
                // if save comment success, reload list with newest comments of notice
                noticeCommentE.isEdit = false;
                const resComment = rs.data;
                noticeCommentE.post_message = resComment.post_message;
                noticeCommentE.like = resComment.like;
                noticeCommentE.good = resComment.good;
                noticeCommentE.smile = resComment.smile;
                noticeCommentE.surprise = resComment.surprise;
                noticeCommentE.upd_datetime = resComment.upd_datetime;
                this._getCommentFiles();
            }
        );
    }

    /**
     * Focus edit just one item comment in list comments of notice
     * @param {NoticesCommentsEntity} item NoticesCommentsEntity
     * @returns {void}
     */
    public onShowEditComment (item: NoticesCommentsEntity): void {
        this.commentList.forEach(c => c.isEdit = false);
        item.isEdit = true;
        this.commentListEdit = this.commentListEdit.filter(c => c.notice_no == item.notice_no && c.index != item.index);
        this.commentListEdit.push({...item});
        /**
         * Get files
         */
        // const folderPath = `${this.userLogin.office_id  }/notice-comments/${  this.noticeInfo.notice_no  }/${  item.index}`;
        this.noticeCommentUploadFiles = item.files;
    }
    /**
     * Cancel edit comment
     * @param {NoticesCommentsEntity} item NoticesCommentsEntity
     * @returns {void}
     */
    public onCancelEditComment (item: NoticesCommentsEntity): void {
        const find = this.commentListEdit.find(c => c.notice_no == item.notice_no && c.index == item.index);
        if(find) {
            item.post_message = find.post_message;
        }
        item.isEdit = false;
        this.noticeCommentUploadFiles = [];
    }

    /**
     * Reaction comment
     * @author hung.le 2024/07/18 14:33
     * @param {NoticesCommentsEntity} commentE NoticesCommentsEntity
     * @param {string} typeReaction string
     * @returns {void} void
     */
    public onReaction (commentE: NoticesCommentsEntity, typeReaction: string): void {
        // Check type and plus
        if(typeReaction == 'like') commentE.like = (commentE.like??0) + 1;
        if(typeReaction == 'good') commentE.good = (commentE.good??0) + 1;
        if(typeReaction == 'smile') commentE.smile = (commentE.smile??0) + 1;
        if(typeReaction == 'surprise') commentE.surprise = (commentE.surprise??0) + 1;
        // Request
        const params = {
            notice_no: commentE.notice_no,
            index: commentE.index,
            typeReaction: typeReaction
        } as NoticesCommentsEntity;
        this._noticesCommentsService.onReaction(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(res => {
                if(!res || !res.status || !res.data) {
                    // Revert when false
                    if(typeReaction === 'like') commentE.like = (commentE.like??0) - 1;
                    if(typeReaction === 'good') commentE.good = (commentE.good??0) - 1;
                    if(typeReaction === 'smile') commentE.smile = (commentE.smile??0) - 1;
                    if(typeReaction === 'surprise') commentE.surprise = (commentE.surprise??0) - 1;
                    return;
                }
                const resComment = res.data;
                commentE.post_message = resComment.post_message;
                commentE.like = resComment.like;
                commentE.good = resComment.good;
                commentE.smile = resComment.smile;
                commentE.surprise = resComment.surprise;
                commentE.upd_datetime = resComment.upd_datetime;
            });
    }

    /**
     * Check notice_role, update_role
     * @author hung.le 2024/07/18
     * @returns {boolean} true if user has role
     */
    private hasRole (): boolean {
        if(!this.userRole?.notice_role) {
            this.toastr.warning(this.translate.instant('message.update_role_denied'));
            return false;
        }
        if(!this.userRole?.update_role) {
            this.toastr.warning(this.translate.instant('message.update_role_denied'));
            return false;
        }
        return true;
    }
    /**
     * Fuel select change
     * @date 2024/07/24 11:54
     * @author DuyPham
     *
     * @public
     * @param {ItemsEntity} item item selected
     * @returns {void}
     */
    public fuelChange(item: ItemsEntity): void {
        if (this.Lib.isBlank(item?.item_name)) {
            this.facilitySelectE.list = [];
        } else {
            this._getFacilityList(item?.item_no ?? 0);
        }
        this.form.controls['facility_id'].setValue(null);
    }
    /**
     * Get facility list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @param {number} type type
     *
     * @returns {void}
     */
    private _getFacilityList(type: number): void {
        const params = {...this.facilityParams};
        params.type = type;
        this._divisionService
            .getDivisionsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.facilitySelectE.list = rsp.data;
                },
            });
    }

    /**
     * Get building list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @returns {void}
     */
    private _getBuildingList(): void {
        const params = {...this.buildingParams};
        this._divisionService
            .getDivisionsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.buildingSelectE.list = rsp.data;
                },
            });
    }

    /**
     * Get fuel list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @returns {void}
     */
    private _getFuelList(): void {
        const params = {...this.fuelParams};
        this._itemsService
            .getItemsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.fuelTypeSelectE.list = rsp.data;
                },
            });
    }

}
