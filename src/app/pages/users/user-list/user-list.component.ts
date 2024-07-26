import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { UserEntity, UserSearchEntity } from '../../../core/entities';
import { UserService } from '../../../core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../../core/components/modal/modal-confirm.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './user-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE],
})
export class UserListComponent extends BaseComponent implements OnInit {
    public searchForm!: FormGroup;
    public userList: Array<UserEntity> = [];

    /** Constructor */
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _modalService: NgbModal,
        private _toastrService: ToastrService,
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        void this._searchFormRules();
        void this._getUserList();
    }
    /**
     * Initializes the search form with its corresponding form controls.
     *
     * @returns {void}
     */
    private _searchFormRules(): void {
        this.searchForm = new FormGroup({
            keyword: new FormControl<string | null>(null),
        });
    }
    /**
     * Get user list
     * @returns {void}
     */
    private _getUserList(): void {
        if (this.isSearching) return;
        this.isSearching = true;
        const params = this.searchForm.value as UserSearchEntity;
        params.page = this.currentPage;
        this._userService
            .getAllUserList(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        this.searchResultCount = 0;
                        this.userList = [];
                        this.isPageLoaded = true;
                        this.isSearching = false;
                        return;
                    }
                    this.userList = rsp.data;
                    this.searchResultCount = rsp.total_row;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                },
                error: () => {
                    this.userList = [];
                    this.searchResultCount = 0;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                },
            });
    }
    /**
     * Callback function triggered when the pagination page changes.
     *
     * @param {number} page      The new page number selected.
     *
     * @returns {void}
     */
    public onPaginationChange(page: number): void {
        this.currentPage = page;
        this._getUserList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.setCurrentPage(0);
        this._getUserList();
    }
    /**
     * Reset seearch
     *
     * @returns {void}
     */
    public onResetSearch(): void {
        this._searchFormRules();
        this.setCurrentPage(0);
        this._getUserList();
    }

    /**
     * Go to edit screen
     * @author DuyPham
     *
     * @param {number} id user id
     * @returns {void}
     */
    public onEdit(id?: number): void {
        if (!id) return;
        void this._router.navigate([`${this.Constants.APP_URL.USERS.MODULE}/${this.Constants.APP_URL.USERS.EDIT}/${id}`]);
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @param {number} id user id
     * @returns {void}
     */
    public onDetail(id?: number): void {
        if (!id) return;
        void this._router.navigate([`${this.Constants.APP_URL.USERS.MODULE}/${this.Constants.APP_URL.USERS.DETAIL}/${id}`]);
    }

    /**
     * Delete user
     * @author DuyPham
     *
     * @param {UserEntity} userInfo user info
     * @returns {void}
     */
    public onDelete(userInfo: UserEntity): void {
        if (!userInfo) return;
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('message.delete_confirm', {field: `${userInfo.user_first_name ?? ''} ${userInfo.user_last_name ?? ''}`}) as string;

        modalInstance.confirm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            const params = {
                user_id: userInfo.user_id ?? 0,
                upd_datetime: userInfo.upd_datetime ?? '',
            };
            this._userService
                .deleteUser(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp.status) {
                            this._toastrService.error(this.translate.instant('message.delete_failed') as string);
                            return;
                        }
                        this._toastrService.success(this.translate.instant('message.delete_successfully') as string);
                        this._getUserList();
                    },
                });
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
}
