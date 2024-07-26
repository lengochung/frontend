import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { DemandService, SubjectService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import {
    FilterDisplay,
    FilterTableEntity,
} from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import { DemandEntity, DemandFilterEntity, DemandSearchEntity } from '../../../core/entities';

@Component({
    templateUrl: './demand-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective],
})
export class DemandListComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private _subscriptionList: Subscription[] = [];
    public searchForm!: FormGroup;
    public demandTable?: DemandFilterEntity;
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
    public formTypeData: FilterDisplay[] = [
        {
            id: 1,
            name: "初期設定票",
        },
        {
            id: 2,
            name: "管理票",
        },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _demandService: DemandService,
        private _subjectService: SubjectService
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._searchFormRules();
        this._getDemandList();
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
     * Get demand list
     * @param {FilterTableEntity} filter filter
     * @returns {void}
     */
    private _getDemandList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as DemandSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        const sub = this._demandService.getAllList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this.searchResultCount = 0;
                    this.demandTable = undefined;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                    return;
                }
                this.demandTable = rsp.data;
                this.searchResultCount = rsp.total_row;
                this.isPageLoaded = true;
                this.isSearching = false;
            },
            error: () => {
                this.demandTable = undefined;
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
        void this._getDemandList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getDemandList();
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
        this._getDemandList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @param {DemandEntity} item demand
     * @returns {void}
     */
    public onDetail(item?: DemandEntity): void {
        if (item?.form_type === 1) {
            void this._router.navigate([
                `${this.Constants.APP_URL.DEMAND.MODULE}/${this.Constants.APP_URL.DEMAND.INTI}/${item.id}`,
            ]);
        } else if (item?.form_type === 2) {
            void this._router.navigate([
                `${this.Constants.APP_URL.DEMAND.MODULE}/${this.Constants.APP_URL.DEMAND.DETAIL}/${item.id}`,
            ]);
        }
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

    /**
     * get form type
     * @author DuyPham
     *
     * @param {(string | number)} id id
     * @returns {string} form name
     */
    public getFormTypeName(id?: string | number): string {
        return this.formTypeData.find(p => p.id === id)?.name ?? ''
    }

}
