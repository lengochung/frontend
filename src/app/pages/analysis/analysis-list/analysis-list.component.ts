import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { AnalysisEntity, AnalysisFilterEntity, AnalysisSearchEntity } from '../../../core/entities';
import { AnalysisService, SubjectService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import {
    FilterTableEntity,
} from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAnalysisComponent } from '../modal-analysis/modal-analysis.component';
import { TableComponent } from '../../../core/components/table/table.component';

@Component({
    templateUrl: './analysis-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective, TableComponent],
})
export class AnalysisListComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    @ViewChild('tableAnalysis') tableAnalysis?: ElementRef;
    private _subscriptionList: Subscription[] = [];
    public searchForm!: FormGroup;
    public analysisTable?: AnalysisFilterEntity;
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

    /** Constructor */
    constructor(
        private _router: Router,
        private _analysisService: AnalysisService,
        private _subjectService: SubjectService,
        private _modalService: NgbModal
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._buildDayOfWeek();
        this._searchFormRules();
        this._getAnalysisList();
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
     * Get analysis list
     * @returns {void}
     */
    private _getAnalysisList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as AnalysisSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        const sub = this._analysisService.getAnalysisList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this.searchResultCount = 0;
                    this.analysisTable = undefined;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                    return;
                }
                this.analysisTable = rsp.data;
                this.searchResultCount = rsp.total_row;
                this.isPageLoaded = true;
                this.isSearching = false;
            },
            error: () => {
                this.analysisTable = undefined;
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
        void this._getAnalysisList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getAnalysisList();
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
        this._getAnalysisList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @returns {void}
     */
    public onDetail(): void {
        void this._router.navigate([
            `${this.Constants.APP_URL.ANALYSIS.MODULE}/${this.Constants.APP_URL.ANALYSIS.CREATE}`,
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
            (this.tableAnalysis?.nativeElement as HTMLElement).scrollLeft = this.tableAnalysis?.nativeElement.scrollWidth;
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
     * @param {AnalysisEntity} analysis analysis
     * @return {void}
     */
    public onRightClickGroup(analysis: AnalysisEntity): void {
        analysis.management_group = '';
    }

    /**
     * right click facilities processes
     * @author DuyPham
     *
     * @param {AnalysisEntity} analysis analysis
     * @return {void}
     */
    public onRightClickFacility(analysis: AnalysisEntity): void {
        analysis.facilities_processes = '';
    }

    /**
     * right click analysis item
     * @author DuyPham
     *
     * @param {AnalysisEntity} analysis analysis
     * @return {void}
     */
    public onRightClickAnalysisItem(analysis: AnalysisEntity): void {
        analysis.analysis_items = '';
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
     * Show chart
     * @author DuyPham
     *
     * @returns {void}
     */
    public onShowChartModal(): void {
        const modal = this._modalService.open(ModalAnalysisComponent, {
            centered: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const modalInstance = modal.componentInstance as ModalAnalysisComponent;

    }

    /**
     * management group changed
     * @author DuyPham
     *
     * @param {AnalysisEntity} item AnalysisEntity
     * @param {Event} event Event
     * @returns {void}
     */
    public onChangeManagementGroup(item: AnalysisEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (this.Lib.isBlank(value)) return;
        item.management_group = value;
        item.is_management_group_edit = false;
    }

    /**
     * facilities processes changed
     * @author DuyPham
     *
     * @param {AnalysisEntity} item AnalysisEntity
     * @param {Event} event Event
     * @returns {void}
     */
    public onChangeFacilitiesProcesses(item: AnalysisEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (this.Lib.isBlank(value)) return;
        item.facilities_processes = value;
        item.is_facilities_processes_edit = false;
    }

    /**
     * analysis items changed
     * @author DuyPham
     *
     * @param {AnalysisEntity} item AnalysisEntity
     * @param {Event} event Event
     * @returns {void}
     */
    public onChangeAnalysisItems(item: AnalysisEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (this.Lib.isBlank(value)) return;
        item.analysis_items = value;
        item.is_analysis_items_edit = false;
    }

}
