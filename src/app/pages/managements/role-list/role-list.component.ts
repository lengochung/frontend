import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { RoleService } from '../../../core/services';
import { RoleEntity } from '../../../core/entities';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../../core/components/modal/modal-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    templateUrl: './role-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE],
})
export class RoleListComponent extends BaseComponent implements OnInit {
    public roleList: RoleEntity[] = [];
    public readonly ROLE_NAME_ML: number = 20;
    private _roleIdEditting = 0;

    /** Constructor */
    constructor(private _router: Router, private _roleService: RoleService, private _modalService: NgbModal, private _toastrService: ToastrService) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._getRoleList();
    }

    /**
     * Get role list
     * @returns {void}
     */
    private _getRoleList(): void {
        const params = {
            office_id: this.userLogin.office_id,
        };
        this._roleService
            .getRoleList(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        this.roleList = [];
                        return;
                    }
                    this.roleList = rsp.data;
                },
                error: () => {
                    this.roleList = [];
                },
            });
    }

    /**
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.DASHBOARD]);
    }

    /**
     * Add new role
     * @returns {void}
     */
    public onAddNewRole(): void {
        const newRole = new RoleEntity();
        newRole.role_name = '';
        newRole.read_role = 0;
        newRole.notice_role = 0;
        newRole.update_role = 0;
        newRole.approval_role = 0;
        newRole.manager_role = 0;
        newRole.leader_role = 0;
        newRole.admin_role = 0;
        newRole.invalid = true;
        newRole.is_new = true;
        this.roleList.push(newRole);
    }

    /**
     * Delete role
     * @param {RoleEntity} roleValue role entity value
     * @param {number} index index row
     * @returns {void}
     */
    public onDeleteRole(roleValue: RoleEntity, index: number): void {
        if (!roleValue.role_id) {
            this.roleList.splice(index, 1);
            return;
        }
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('message.delete_confirm', { field: `(${roleValue.role_name ?? ''})` }) as string;

        modalInstance.confirm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            if (!roleValue.role_id) return;
            const params = {
                role_id: roleValue.role_id,
                upd_datetime: roleValue.upd_datetime,
            };
            this._roleService
                .onDelete(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp.status || !rsp.data) {
                            const errorList = this.getApiErrorMessages(rsp.msg);
                            if (errorList && errorList.length > 0) this._toastrService.error(errorList[0]);
                            return;
                        }
                        this.roleList = this.roleList.filter((role) => role.role_id != roleValue.role_id);
                        this._toastrService.success(this.translate.instant('message.delete_successfully') as string);
                    },
                });
        });
    }

    /**
     * role checkbox change
     * @author DuyPham
     *
     * @public
     * @param {RoleEntity} roleValue roleEntity value
     * @param {string} roleType role type
     * @param {Event} event event
     * @param {HTMLInputElement} roleName role name input
     * @returns {void}
     */
    public onCheckboxChanged(roleValue: RoleEntity, roleType: string, event: Event, roleName: HTMLInputElement): void {
        const target = event.target as HTMLInputElement;
        const isChecked = target.checked ? 1 : 0;
        const roleNamValue = roleName.value.trim();
        if (roleValue.invalid) {
            //revert checked status
            target.checked = !target.checked;
            roleName.focus();
            return;
        } else {
            const isDuplicateName =
                this.roleList.findIndex(
                    (p) => p.role_name?.trim().toLowerCase() === roleNamValue.toLowerCase() && p.role_id !== roleValue.role_id,
                ) != -1;

            if (isDuplicateName || roleNamValue === '') {
                //revert checked status
                target.checked = !target.checked;
                return;
            }
        }
        switch (roleType) {
            case this.Constants.ROLE.READ_ROLE:
                roleValue.read_role = isChecked;
                break;
            case this.Constants.ROLE.APPROVAL_ROLE:
                roleValue.approval_role = isChecked;
                break;
            case this.Constants.ROLE.MANAGER_ROLE:
                roleValue.manager_role = isChecked;
                break;
            case this.Constants.ROLE.NOTICE_ROLE:
                roleValue.notice_role = isChecked;
                break;
            case this.Constants.ROLE.UPDATE_ROLE:
                roleValue.update_role = isChecked;
                break;
            case this.Constants.ROLE.TEAM_LEADER_ROLE:
                roleValue.leader_role = isChecked;
                break;
            case this.Constants.ROLE.CHIEF_ROLE:
                roleValue.admin_role = isChecked;
                break;
            default:
                break;
        }

        if (!roleValue.role_id) return;
        if (this._roleIdEditting === roleValue.role_id) {
            return;
        }
        this._roleService
            .onSave(roleValue)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        if (errorList && errorList.length > 0) this._toastrService.error(errorList[0]);
                        //revert checked status
                        target.checked = !target.checked;
                        return;
                    }
                    roleValue.upd_datetime = rsp.data.upd_datetime;
                    roleValue.is_new = false;
                },
            });
    }

    /**
     * role name typing
     * @author DuyPham
     *
     * @public
     * @param {RoleEntity} roleValue roleEntity value
     * @param {Event} event event
     * @returns {void}
     */
    public onRoleNameTyping(roleValue: RoleEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (value !== '') {
            roleValue.invalid = false;
        } else {
            roleValue.invalid = true;
        }
    }

    /**
     * role name changed event
     * @author DuyPham
     *
     * @public
     * @param {RoleEntity} roleValue roleEntity value
     * @param {Event} event event
     * @returns {void}
     */
    public async onRoleNameChanged(roleValue: RoleEntity, event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (roleValue.role_name === value) return;

        this._roleIdEditting = roleValue.role_id ?? 0;
        await new Promise((f) => setTimeout(f, 200));
        this._roleIdEditting = 0;

        if (this.roleList.indexOf(roleValue) === -1) return;
        const isDuplicateName =
            this.roleList.findIndex((p) => p.role_name?.trim().toLowerCase() === value.toLowerCase() && p.role_id !== roleValue.role_id) != -1;

        if (roleValue.invalid && (isDuplicateName || value === '')) {
            return;
        }

        if (isDuplicateName) {
            const roleNameHeader = this.translate.instant('label.authority_name') as string;
            this._toastrService.error(this.translate.instant('message.item_exists', { field: roleNameHeader }) as string);
            roleValue.invalid = true;
            return;
        } else {
            roleValue.invalid = false;
        }

        roleValue.role_name = value;
        this._roleService
            .onSave(roleValue)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        if (errorList && errorList.length > 0) this._toastrService.error(errorList[0]);
                        return;
                    }
                    roleValue.upd_datetime = rsp.data.upd_datetime;
                    roleValue.is_new = false;
                    roleValue.role_id = rsp.data.role_id;
                },
            });
    }
}
