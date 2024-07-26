import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { InOpeManageFilterEntity, InOpeManageSearchEntity } from '../../../core/entities';
import { InOpeManageService, SubjectService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import {
    FilterDisplay,
    FilterTableEntity,
} from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';

@Component({
    templateUrl: './in-ope-manage-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective],
})
export class InOpeManageListComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private _subscriptionList: Subscription[] = [];
    public searchForm!: FormGroup;
    public inOpeManageTable?: InOpeManageFilterEntity;
    private _filter?: FilterTableEntity;


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

    /** Constructor */
    constructor(
        private _router: Router,
        private _inOpeManageService: InOpeManageService,
        private _subjectService: SubjectService
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._searchFormRules();
        this._getInOpeManageList();
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
     * Get in-ope manage list
     * @param {FilterTableEntity} filter filter
     * @returns {void}
     */
    private _getInOpeManageList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as InOpeManageSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        const sub = this._inOpeManageService.getAllList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this.searchResultCount = 0;
                    this.inOpeManageTable = undefined;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                    return;
                }
                this.inOpeManageTable = rsp.data;
                this.searchResultCount = rsp.total_row;
                this.isPageLoaded = true;
                this.isSearching = false;
            },
            error: () => {
                this.inOpeManageTable = undefined;
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
        void this._getInOpeManageList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getInOpeManageList();
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
        this._getInOpeManageList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @param {number} id in-ope manage id
     * @returns {void}
     */
    public onDetail(id?: number): void {
        if (!id) return;
        void this._router.navigate([
            `${this.Constants.APP_URL.IN_OPE_MANAGE.MODULE}/${this.Constants.APP_URL.IN_OPE_MANAGE.DETAIL}/${id}`,
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
    public filterChanged(data: FilterTableEntity): void {
        this._filter = data;
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

}
