import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { UserService } from '../../../core/services/user.service';
import { AuthService, OfficeService, RoleService } from '../../../core/services';
import { OfficeEntity, RoleEntity, UserEntity, UserRoleEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../../core/components/modal/modal-confirm.component';
import { AutocompleteDirective } from '../../../core/directives/autocomplete.directive';
import { AutocompleteComponent } from '../../../core/components/autocomplete/autocomplete.component';
import { UserValidator } from '../validator/user.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray } from '@angular/forms';

@Component({
    templateUrl: './user-create.component.html',
    standalone: true,
    imports: [SHARED_MODULE, AutocompleteDirective, AutocompleteComponent],
})
export class UserCreateComponent extends BaseComponent implements OnInit {
    public validator: UserValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public isEdit = false;
    public roleList: RoleEntity[] = [];

    private _roleDefault: RoleEntity = {
        role_id: 0,
        role_name: this.translate.instant('label.can_not_login') as string
    };
    private _rolListMap: Map<number, RoleEntity[]> = new Map<number, RoleEntity[]>();

    public userInfo?: UserEntity;

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.user_management') as string,
            link: 'users',
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsEdit: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.user_management') as string,
            link: 'users',
        },
        { name: this.translate.instant('label.edit') as string, link: '' },
    ];
    public officeList?: OfficeEntity[];

    /** Constructor */
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _officeService: OfficeService,
        private _route: ActivatedRoute,
        private _roleService: RoleService,
        private _toastrService: ToastrService,
        private _modalService: NgbModal,
        private _authService: AuthService,
    ) {
        super();
        this.validator = new UserValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        this._getRoleList();
        this._route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const userId = Number(id);
                this.isEdit = true;
                this._getUserInfo(userId);
            } else {
                this._getOfficeInfo();
            }
        });
    }

    /**
     * Get my office info
     * @returns {void}
     */
    private _getOfficeInfo(): void {
        const params = {
            group_office_id: this.userLogin.group_office_id ?? 0
        }
        this._officeService
            .getOfficeList(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        if (errorList && errorList.length > 0) this._toastrService.error(errorList[0]);
                        return;
                    }
                    this.officeList = rsp.data;
                    if (this.officeList) {
                        const userRoleList = this.officeList.map(item => {
                            const role: UserRoleEntity = {
                                office_id: item.office_id,
                                office_subname: item.office_name,
                                role_id: 0
                            };
                            return role;
                        });
                        this._addRoleListToForm(userRoleList);
                    }
                },
            });
    }

    /**
     * Get role list
     * @returns {void}
     */
    private _getRoleList(): void {
        const params = {
            group_office_id: this.userLogin.group_office_id ?? 0,
        };
        this._roleService
            .getRoleList(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        if (errorList && errorList.length > 0) this._toastrService.error(errorList[0]);
                        return;
                    }
                    this.roleList = rsp.data;
                },
            });
    }

    /**
     * get user info
     * @author DuyPham
     *
     * @param {number} id user id
     * @returns {void}
     */
    private _getUserInfo(id: number): void {
        const params = { user_id: id };
        this._userService
            .getUserInfo(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        this._toastrService.error(this.translate.instant('message.user_not_found') as string);
                        return;
                    }
                    this.userInfo = rsp.data;
                    this.Lib.assignDataFormControl(this.form.controls, this.userInfo);
                    if (this.userInfo.role_list) {
                        this._addRoleListToForm(this.userInfo.role_list);
                    }
                },
            });
    }

    /**
     * Submit form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onSaveUser(): void {
        this.validator.makeValidator(this.form, this.validator.createErrorMessages());

        if (this.form.invalid) return;
        const params = Object.assign({}, this.form.value) as UserEntity;
        params.user_id = this.userInfo?.user_id;
        params.upd_datetime = this.userInfo?.upd_datetime;
        params.is_new = !this.isEdit;
        params.office_id = this.userInfo?.office_id;

        this._userService
            .onSave(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        this.validator.errors = errorList;
                        return;
                    }
                    const userInfo = rsp.data;
                    let successMsg = '';
                    if (this.isEdit) {
                        successMsg = this.translate.instant('message.update_user_success') as string;
                        if (userInfo) {
                            this.userInfo = userInfo;
                            const currentUser = this.userLogin;
                            if (currentUser && currentUser.user_id === this.userInfo.user_id) {
                                currentUser.user_first_name = this.userInfo.user_first_name;
                                currentUser.user_last_name = this.userInfo.user_last_name;
                                currentUser.mail = this.userInfo.mail;
                                this._authService.updateCurrentLoginUser(currentUser);
                            }
                        }
                    } else {
                        successMsg = this.translate.instant('message.create_user_success') as string;
                        void this._router.navigate([
                            `${this.Constants.APP_URL.USERS.MODULE}/${this.Constants.APP_URL.USERS.EDIT}/${userInfo?.user_id}`,
                        ]);
                    }
                    this._toastrService.success(successMsg);
                },
            });
    }

    /**
     * Reset password
     * @author DuyPham
     *
     * @returns {void}
     */
    public onResetPassword(): void {
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('message.initial_password_confirm') as string;

        modalInstance.confirm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            const params = {
                user_id: this.userInfo?.user_id ?? 0,
                upd_datetime: this.userInfo?.upd_datetime ?? '',
            };
            this._userService
                .resetPasswordUser(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp.status) {
                            const errorList = this.getApiErrorMessages(rsp.msg);
                            this.validator.errors = errorList;
                            return;
                        }
                        if (rsp.data && this.userInfo) {
                            this.userInfo.upd_datetime = rsp.data.upd_datetime;
                            this.userInfo.password_update_date = rsp.data.password_update_date;
                        }
                        this._toastrService.success(this.translate.instant('message.password_initial_success') as string);
                    },
                });
        });
    }

    /**
     * Get role list by office id
     * @author DuyPham
     *
     * @public
     * @param {number} officeId office id
     * @returns {RoleEntity[]} role list
     */
    public getRoleListByOffice(officeId: number): RoleEntity[] {
        if (!officeId) return [];
        if (this._rolListMap.has(officeId)) {
            return this._rolListMap.get(officeId) ?? [];
        }

        const filter = this.roleList.filter(item => item.office_id === officeId);
        const roles = [this._roleDefault, ...filter];
        this._rolListMap.set(officeId, roles);
        return roles;
    }

    /**
     * Get role formArray
     * @author DuyPham
     *
     * @readonly
     * @type {FormArray}
     */
    get roleListFormArray(): FormArray {
        return this.form.controls['role_list'] as FormArray;
    }

    /**
     * Add role list to formArray
     * @author DuyPham
     *
     * @param {UserRoleEntity[]} roleList role list
     * @returns {void}
     */
    private _addRoleListToForm(roleList: UserRoleEntity[]): void {
        roleList.forEach(item => {
            const formRule = this.validator.createRoleRules(item);
            this.roleListFormArray.push(formRule);
        })
    }

    /**
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.USERS.MODULE]);
    }
}
