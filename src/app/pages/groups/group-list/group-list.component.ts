import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { GroupEntity, GroupFilterEntity, GroupSearchEntity } from '../../../core/entities';
import { GroupService, PermissionService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import { FilterTableEntity } from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../../core/components/modal/modal-confirm.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './group-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective, OverlayscrollbarsModule],
})
export class GroupListComponent extends BaseComponent implements OnInit {
    public searchForm!: FormGroup;
    public groupTable?: GroupFilterEntity;
    private _filter?: FilterTableEntity;
    public isAdmin = false;

    /** Constructor */
    constructor(
        private _router: Router,
        private _groupService: GroupService,
        private _modalService: NgbModal,
        private _toastrService: ToastrService,
        private _permissionService: PermissionService,
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._searchFormRules();
        this._getGroupList();
        this._permissionService.userPermissionSubject
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((p) => (this.isAdmin = p?.admin_role ? true : false));
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
     * Get group list
     * @returns {void}
     */
    private _getGroupList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as GroupSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        params.page = this.currentPage + 1;
        this._groupService
            .getGroupList(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        this.searchResultCount = 0;
                        this.groupTable = undefined;
                        this.isPageLoaded = true;
                        this.isSearching = false;
                        return;
                    }
                    this.groupTable = rsp.data;
                    this.searchResultCount = rsp.total_row;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                },
                error: () => {
                    this.groupTable = undefined;
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
        void this._getGroupList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.setCurrentPage(0);
        this._getGroupList();
    }
    /**
     * Reset seearch
     *
     * @returns {void}
     */
    public onResetSearch(): void {
        this._searchFormRules();
        this.setCurrentPage(0);
        this._getGroupList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @param {number} id group id
     * @returns {void}
     */
    public onDetail(id?: number): void {
        if (!id) return;
        void this._router.navigate([`${this.Constants.APP_URL.GROUP.MODULE}/${this.Constants.APP_URL.GROUP.DETAIL}/${id}`]);
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
     * filter changed
     * @author DuyPham
     *
     * @param {FilterTableEntity} data FilterTableEntity
     * @returns {void}
     */
    public filterChanged(data: FilterTableEntity): void {
        this._filter = data;
    }

    /**
     * Delete group
     * @author DuyPham
     *
     * @param {GroupEntity} item GroupEntity
     * @returns {void}
     */
    public onDelete(item?: GroupEntity): void {
        if (!item?.group_id) return;
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('message.delete_confirm', { field: item.group_name }) as string;

        modalInstance.confirm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            const params = {
                group_id: item.group_id,
                upd_datetime: item.upd_datetime,
            };
            this._groupService
                .onDelete(params)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (rsp) => {
                        if (!rsp.status || !rsp.data) {
                            this._toastrService.error(this.translate.instant('message.delete_failed') as string);
                            return;
                        }
                        this._toastrService.success(this.translate.instant('message.delete_successfully') as string);
                        this._getGroupList();
                    },
                });
        });
    }
}
