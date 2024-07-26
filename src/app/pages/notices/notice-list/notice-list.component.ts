import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { NoticesSearchEntity, NoticesFilterEntity, RoleEntity } from '../../../core/entities';
import { NoticesService, RoleService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import {
    FilterDisplay,
    FilterEntity,
} from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    templateUrl: './notice-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective],
})
export class NoticeListComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private _subscriptionList: Subscription[] = [];
    public searchForm!: FormGroup;
    public noticeTable?: NoticesFilterEntity;
    private _filter?: FilterEntity;

    public noticeTypeData: FilterDisplay[] = [
        {
            id: 1,
            name: this.translate.instant('label.transmission') as string,
        },
        {
            id: 2,
            name: this.translate.instant('label.reception') as string,
        },
    ];

    public statusData: FilterDisplay[] = [
        {
            id: 1,
            name: "status 1",
        },
        {
            id: 2,
            name: "status 2",
        },
    ];
    // Current user role
    userRole?: RoleEntity|null;

    /** Constructor */
    constructor(
        private _router: Router,
        private _noticeService: NoticesService,
        private _roleService: RoleService,
    ) {
        super();
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
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._searchFormRules();
        this._getNoticeList();
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
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
     * Get notice list
     * @param {FilterTableEntity} filter filter
     * @returns {void}
     */
    private _getNoticeList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as NoticesSearchEntity;
        params.isPaginate = true;

        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        params.search = this._filter?.search;
        const sub = this._noticeService.getNoticeList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this.searchResultCount = 0;
                    this.noticeTable = undefined;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                    return;
                }
                if(!this.noticeTable) this.noticeTable = new NoticesFilterEntity();
                this.noticeTable.data_source = rsp.data;
                this.searchResultCount = rsp.total_row;
                this.isPageLoaded = true;
                this.isSearching = false;
            },
            error: () => {
                this.noticeTable = undefined;
                this.searchResultCount = 0;
                this.isPageLoaded = true;
                this.isSearching = false;
            },
        });
        this._subscriptionList.push(sub);
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
        void this._getNoticeList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getNoticeList();
    }
    /**
     * Reset seearch
     *
     * @returns {void}
     */
    public onResetSearch(): void {
        this._searchFormRules();
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getNoticeList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @param {number} notice_no notice id
     * @returns {void}
     */
    public onDetail(notice_no?: number): void {
        if (!notice_no) return;
        void this._router.navigate([
            `${this.Constants.APP_URL.NOTICES.MODULE}/${this.Constants.APP_URL.NOTICES.DETAIL}/${notice_no}`,
        ]);
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
    public filterChanged(data: FilterEntity): void {
        this._filter = data;
        this._getNoticeList();
    }

    /**
     * get status name
     * @author DuyPham
     *
     * @param {(string | number)} id status id
     * @returns {string} name
     */
    public getStatusName(id?: string | number): string {
        return this.statusData.find(p => p.id === id)?.name ?? ''
    }

    /**
     * get notice type name
     * @author DuyPham
     *
     * @param {(string | number)} id type id
     * @returns {string} name
     */
    public getNoticeTypeName(id?: string | number): string {
        return this.noticeTypeData.find(p => p.id === id)?.name ?? ''
    }

}
