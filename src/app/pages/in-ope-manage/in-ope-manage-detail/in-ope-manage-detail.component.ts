import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { InOpeManageService, SubjectService } from '../../../core/services';
import { CommentEntity, InOpeManageEntity, NoticesEntity, UserManagementEntity, UserSearchEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { UserService } from '../../../core/services/user.service';
import { InOpeManageValidator } from '../validator/in-ope-manage.validator';

@Component({
    templateUrl: './in-ope-manage-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        UploadComponent
    ],
})
export class InOpeManageDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public validator: InOpeManageValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public inOpeManageInfo?: InOpeManageEntity;
    public isEdit = false;
    public userList: UserManagementEntity[] = [];
    public commentList: CommentEntity[] = [];
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

    public resultList = [
        {
            id: 1,
            name: "完了",
        },
        {
            id: 2,
            name: "未完了",
        },
    ];

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.in_ope_manage') as string,
            link: this.Constants.APP_URL.IN_OPE_MANAGE.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.in_ope_manage') as string,
            link: this.Constants.APP_URL.IN_OPE_MANAGE.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _inOpeManageService: InOpeManageService,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _userService: UserService
    ) {
        super();
        this.validator = new InOpeManageValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._getUserList();
        this.form = this.validator.createRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const noticeId = Number(id);
                this.isEdit = true;
                this._getInOpeManageDetail(noticeId);
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
     * get notice detail
     * @author DuyPham
     *
     * @param {number} id notice id
     * @returns {void}
     */
    private _getInOpeManageDetail(id: number): void {
        const params = {id: id};
        const sub = this._inOpeManageService.getInOpeManageDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.inOpeManageInfo = rsp.data;
                this.Lib.assignDataFormControl(this.form.controls, this.inOpeManageInfo)
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * Get user list
     * @returns {void}
     */
    private _getUserList(): void{
        const params = {} as UserSearchEntity;
        const sub = this._userService.getUserList(params).subscribe(rsp => {
            if (!rsp.status || !rsp.data) return;
            this.userList = rsp.data;
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
        const sub = this._inOpeManageService.onSave(params).subscribe({
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
        void this._router.navigate([this.Constants.APP_URL.IN_OPE_MANAGE.MODULE]);
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
            void this._router.navigate([`${this.Constants.APP_URL.IN_OPE_MANAGE.MODULE}/${this.Constants.APP_URL.IN_OPE_MANAGE.CREATE}`]);
        } else {
            this.form.reset();
            //reset file
        }
    }

}
