import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { CorrectivesEntity, CorrectivesSearchEntity } from '../../../core/entities';
import { CorrectivesService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import { FilterEntity } from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    templateUrl: './corrective-report-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective],
})
export class CorrectiveReportListComponent extends BaseComponent implements OnInit {

    public searchForm!: FormGroup;
    public correctiveList?: CorrectivesEntity[] = [];
    private _filter?: FilterEntity;

    /** Constructor */
    constructor(private _router: Router, private _correctivesService: CorrectivesService) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._searchFormRules();
        this._getCorrectiveList();
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
     * Get corrective list
     * @returns {void}
     */
    private _getCorrectiveList(): void {
        if (this.isSearching) return;
        this.isSearching = true;
        const params = this.searchForm.value as CorrectivesSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        params.search = this._filter?.search;
        this._correctivesService
            .getCorrectiveList(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        this.searchResultCount = 0;
                        this.correctiveList = [];
                        this.isPageLoaded = true;
                        this.isSearching = false;
                        return;
                    }
                    this.correctiveList = rsp.data;
                    this.searchResultCount = rsp.total_row;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                },
                error: () => {
                    this.correctiveList = [];
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
        this._getCorrectiveList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getCorrectiveList();
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
        this._getCorrectiveList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @param {CorrectivesEntity} item corrective report
     * @returns {void}
     */
    public onDetail(item?: CorrectivesEntity): void {
        if (!item?.corrective_no) return;
        void this._router.navigate([`${this.Constants.APP_URL.CORRECTIVE_REPORT.MODULE}/${this.Constants.APP_URL.CORRECTIVE_REPORT.DETAIL}/${item?.corrective_no}`]);
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
     * @param {FilterEntity} data FilterEntity
     * @returns {void}
     */
    public filterChanged(data: FilterEntity): void {
        this._filter = data;
        this._getCorrectiveList();
    }
}
