import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { UserService } from '../../../core/services/user.service';
import { RoleService } from '../../../core/services';
import { RoleEntity, UserEntity, UserRoleEntity } from '../../../core/entities';
import { UserValidator } from '../validator/user.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './user-detail.component.html',
    standalone: true,
    imports: [SHARED_MODULE],
})
export class UserDetailComponent extends BaseComponent implements OnInit {
    public validator: UserValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public roleList: RoleEntity[] = [];

    private _roleDefault: RoleEntity = {
        role_id: 0,
        role_name: this.translate.instant('label.can_not_login') as string,
    };
    private _rolListMap: Map<number, RoleEntity[]> = new Map<number, RoleEntity[]>();
    public userInfo?: UserEntity;

    public breadcrumbs: Array<{
        name: string;
        link: string;
    }> = [
        { name: this.translate.instant('label.user_management') as string, link: 'users' },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _roleService: RoleService,
        private _toastrService: ToastrService,
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
                this._getUserInfo(userId);
            }
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
                    this.roleList.push(...rsp.data);
                    this.roleList = [...this.roleList];
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
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        if (errorList && errorList.length > 0) this._toastrService.error(errorList[0]);
                        return;
                    }
                    this.userInfo = rsp.data;
                    this.Lib.assignDataFormControl(this.form.controls, this.userInfo);
                    if (this.userInfo.role_list) {
                        this._addRoleListToForm(this.userInfo.role_list);
                    }
                    this.form.disable();
                },
            });
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
        roleList.forEach((item) => {
            const formRule = this.validator.createRoleRules(item);
            this.roleListFormArray.push(formRule);
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

        const filter = this.roleList.filter((item) => item.office_id === officeId);
        const roles = [this._roleDefault, ...filter];
        this._rolListMap.set(officeId, roles);
        return roles;
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
