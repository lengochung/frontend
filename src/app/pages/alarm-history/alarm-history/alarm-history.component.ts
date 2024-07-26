import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import {
    AlarmHistoryFilterEntity,
    AlarmHistorySearchEntity,
} from '../../../core/entities';
import { AlarmHistoryService, SubjectService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import { FilterTableEntity } from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAlarmHistoryComponent } from '../modal-alarm-history/modal-alarm-history.component';


@Component({
    templateUrl: './alarm-history.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective],
})
export class AlarmHistoryComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private _subscriptionList: Subscription[] = [];
    public searchForm!: FormGroup;
    public alarmHistoryTable?: AlarmHistoryFilterEntity;
    private _filter?: FilterTableEntity;

    public driveData = [
        {
            id: 1,
            name: '原動種類1',
        },
        {
            id: 2,
            name: '原動種類2',
        },
        {
            id: 3,
            name: '原動種類3',
        },
        {
            id: 4,
            name: '原動種類4',
        },
    ];


    /** Constructor */
    constructor(
        private _router: Router,
        private _alarmHistoryService: AlarmHistoryService,
        private _subjectService: SubjectService,
        private _modalService: NgbModal
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._searchFormRules();
        this._getAlarmHistoryList();
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
     * Get alarm history list
     * @returns {void}
     */
    private _getAlarmHistoryList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as AlarmHistorySearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        const sub = this._alarmHistoryService
            .getAlarmHistoryList(params)
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        this.searchResultCount = 0;
                        this.alarmHistoryTable = undefined;
                        this.isPageLoaded = true;
                        this.isSearching = false;
                        return;
                    }
                    this.alarmHistoryTable = rsp.data;
                    this.searchResultCount = rsp.total_row;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                },
                error: () => {
                    this.alarmHistoryTable = undefined;
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
        void this._getAlarmHistoryList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getAlarmHistoryList();
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
        this._getAlarmHistoryList();
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
     * get drive name
     * @author DuyPham
     *
     * @param {(string | number)} id drive type id
     * @returns {string} name
     */
    public getDriveName(id?: string | number): string {
        return this.driveData.find((p) => p.id === id)?.name ?? '';
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
     * Show chart
     * @author DuyPham
     *
     * @returns {void}
     */
    public onShowChartModal(): void {
        const modal = this._modalService.open(ModalAlarmHistoryComponent, {
            centered: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const modalInstance = modal.componentInstance as ModalAlarmHistoryComponent;

    }
}
