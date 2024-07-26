import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { SubjectService, TrendService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import {
    FilterDisplay,
    FilterTableEntity,
} from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import moment from 'moment';
import { TrendFilterEntity, TrendSearchEntity, TrendEntity } from '../../../core/entities';
import { TableComponent } from '../../../core/components/table/table.component';

@Component({
    templateUrl: './trend-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective, TableComponent],
})
export class TrendListComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    @ViewChild('tableTrend') tableTrend?: ElementRef;
    private _subscriptionList: Subscription[] = [];
    public searchForm!: FormGroup;
    public trendTable?: TrendFilterEntity;
    private _filter?: FilterTableEntity;

    private _dayOfWeek = [
        this.translate.instant('label.sunday') as string,
        this.translate.instant('label.monday') as string,
        this.translate.instant('label.tuesday') as string,
        this.translate.instant('label.wednesday') as string,
        this.translate.instant('label.thursday') as string,
        this.translate.instant('label.friday') as string,
        this.translate.instant('label.saturday') as string
    ];
    public dayOfWeekArray: string[] = [];
    public lastDayOfMonth = 1;
    public dateSelected = moment().startOf('month').format('YYYY/MM/DD');
    private _todayMoment = moment();
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

    /** Constructor */
    constructor(
        private _router: Router,
        private _trendService: TrendService,
        private _subjectService: SubjectService,
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._buildDayOfWeek();
        this._searchFormRules();
        this._getTrendList();
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
     * Get trend list
     * @returns {void}
     */
    private _getTrendList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as TrendSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        const sub = this._trendService.getTrendList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this.searchResultCount = 0;
                    this.trendTable = undefined;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                    return;
                }
                this.trendTable = rsp.data;
                this.searchResultCount = rsp.total_row;
                this.isPageLoaded = true;
                this.isSearching = false;
            },
            error: () => {
                this.trendTable = undefined;
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
        void this._getTrendList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getTrendList();
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
        this._getTrendList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @returns {void}
     */
    public onDetail(): void {
        void this._router.navigate([
            `${this.Constants.APP_URL.TREND.MODULE}/${this.Constants.APP_URL.TREND.CREATE}`,
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
     * next month
     * @author DuyPham
     *
     * @return {void}
     */
    public onNextMonth(): void {
        this.dateSelected = this.Lib.addToDate(this.dateSelected, 1, 2, true);
        this._buildDayOfWeek();
        setTimeout(() => {
            (this.tableTrend?.nativeElement as HTMLElement).scrollLeft = this.tableTrend?.nativeElement.scrollWidth;
        }, 10);
    }

    /**
     * build day of week
     * @author DuyPham
     *
     * @return {void}
     */
    private _buildDayOfWeek(): void {
        this.lastDayOfMonth = moment(this.dateSelected, 'YYYY/MM/DD').daysInMonth();

        const dayOfWeekStartMonth = moment(this.dateSelected, 'YYYY/MM/DD').startOf('month').day();
        let dayOfWeekTemp = dayOfWeekStartMonth;
        this.dayOfWeekArray = [];
        for (let index = 0; index < this.lastDayOfMonth; index++) {
            this.dayOfWeekArray.push(this._dayOfWeek[dayOfWeekTemp]);
            dayOfWeekTemp++;
            if (dayOfWeekTemp > 6) dayOfWeekTemp = 0;
        }
    }

    /**
     * previous month
     * @author DuyPham
     *
     * @return {void}
     */
    public onPreviousMonth(): void {
        this.dateSelected = this.Lib.addToDate(this.dateSelected, 1, 2, false);
        this._buildDayOfWeek();
    }

    /**
     * display selected month
     * @author DuyPham
     *
     * @readonly
     * @type {string}
     */
    get displaySelectedMonth(): string {
        const selectedDate = moment(this.dateSelected, 'YYYY/MM/DD').format('YYYY M[月]');
        return selectedDate;
    }

    /**
     * right click group management
     * @author DuyPham
     *
     * @param {TrendEntity} item trend
     * @return {void}
     */
    public onRightClickGroup(item: TrendEntity): void {
        item.management_group = '';
    }

    /**
     * right click point name
     * @author DuyPham
     *
     * @param {TrendEntity} item trend
     * @return {void}
     */
    public onRightClickPointName(item: TrendEntity): void {
        item.point_name = '';
    }

    /**
     * check is today
     * @author DuyPham
     *
     * @param {number} day day check
     * @returns {boolean} isToday
     */
    public isToday(day: number): boolean {
        const dateSelectedMoment = moment(this.dateSelected, 'YYYY/MM/DD');
        if (day === this._todayMoment.date()
            && dateSelectedMoment.month() === this._todayMoment.month()
            && dateSelectedMoment.year() === this._todayMoment.year()
        ) {
            return true;
        }
        return false;
    }

    /**
     * management group changed
     * @author DuyPham
     *
     * @param {TrendEntity} item TrendEntity
     * @param {Event} event Event
     * @returns {void}
     */
    public onChangeManagementGroup(item: TrendEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (this.Lib.isBlank(value)) return;
        item.management_group = value;
        item.is_management_group_edit = false;
    }

    /**
     * point name changed
     * @author DuyPham
     *
     * @param {TrendEntity} item TrendEntity
     * @param {Event} event Event
     * @returns {void}
     */
    public onChangePointName(item: TrendEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (this.Lib.isBlank(value)) return;
        item.point_name = value;
        item.is_point_name_edit = false;
    }

}
