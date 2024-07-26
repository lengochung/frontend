import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { IncidentReportFilterEntity, IncidentReportSearchEntity } from '../../../core/entities';
import { IncidentReportService, SubjectService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import {
    FilterDisplay,
    FilterTableEntity,
} from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';

@Component({
    templateUrl: './incident-report-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective],
})
export class IncidentReportListComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private _subscriptionList: Subscription[] = [];
    public searchForm!: FormGroup;
    public incidentReportTable?: IncidentReportFilterEntity;
    private _filter?: FilterTableEntity;

    public statusData: FilterDisplay[] = [
        {
            id: 1,
            name: " ステータス1",
        },
        {
            id: 2,
            name: " ステータス2",
        },
    ];

    public driveData = [
        {
            id: 1,
            name: '原動種類1'
        },
        {
            id: 2,
            name: '原動種類2'
        }
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _incidentReportService: IncidentReportService,
        private _subjectService: SubjectService
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._searchFormRules();
        this._getIncidentReportList();
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
     * Get incident report list
     * @returns {void}
     */
    private _getIncidentReportList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as IncidentReportSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        const sub = this._incidentReportService.getIncidentReportList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this.searchResultCount = 0;
                    this.incidentReportTable = undefined;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                    return;
                }
                this.incidentReportTable = rsp.data;
                this.searchResultCount = rsp.total_row;
                this.isPageLoaded = true;
                this.isSearching = false;
            },
            error: () => {
                this.incidentReportTable = undefined;
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
        void this._getIncidentReportList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getIncidentReportList();
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
        this._getIncidentReportList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @param {number} id incident report id
     * @returns {void}
     */
    public onDetail(id?: number): void {
        if (!id) return;
        void this._router.navigate([
            `${this.Constants.APP_URL.INCIDENT_REPORT.MODULE}/${this.Constants.APP_URL.INCIDENT_REPORT.DETAIL}/${id}`,
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
     * get drive name
     * @author DuyPham
     *
     * @param {(string | number)} id drive type id
     * @returns {string} name
     */
    public getDriveName(id?: string | number): string {
        return this.driveData.find(p => p.id === id)?.name ?? ''
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

}
