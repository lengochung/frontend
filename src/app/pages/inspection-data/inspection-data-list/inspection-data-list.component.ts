import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { InspectionDataEntity, InspectionDataFilterEntity, InspectionDataSearchEntity } from '../../../core/entities';
import { InspectionDataService, SubjectService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import {
    FilterTableEntity,
} from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInspectionDataComponent } from '../modal-inspection-data/modal-inspection-data.component';
import { TableComponent } from '../../../core/components/table/table.component';

@Component({
    templateUrl: './inspection-data-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective, TableComponent],
})
export class InspectionDataListComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    @ViewChild('tableInspectionData') tableInspectionData?: ElementRef;
    private _subscriptionList: Subscription[] = [];
    public searchForm!: FormGroup;
    public inspectionDataTable?: InspectionDataFilterEntity;
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
        private _inspectionDataService: InspectionDataService,
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
        this._getInspectionDataList();
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
     * Get inspection data list
     * @returns {void}
     */
    private _getInspectionDataList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as InspectionDataSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        const sub = this._inspectionDataService.getInspectionDataList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this.searchResultCount = 0;
                    this.inspectionDataTable = undefined;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                    return;
                }
                this.inspectionDataTable = rsp.data;
                this.searchResultCount = rsp.total_row;
                this.isPageLoaded = true;
                this.isSearching = false;
            },
            error: () => {
                this.inspectionDataTable = undefined;
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
        void this._getInspectionDataList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getInspectionDataList();
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
        this._getInspectionDataList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @returns {void}
     */
    public onDetail(): void {
        void this._router.navigate([
            `${this.Constants.APP_URL.INSPECTION_DATA.MODULE}/${this.Constants.APP_URL.INSPECTION_DATA.CREATE}`,
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
            (this.tableInspectionData?.nativeElement as HTMLElement).scrollLeft = this.tableInspectionData?.nativeElement.scrollWidth;
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
     * @param {InspectionDataEntity} item inspection Data
     * @return {void}
     */
    public onRightClickGroup(item: InspectionDataEntity): void {
        item.management_group = '';
    }

    /**
     * right click facilities processes
     * @author DuyPham
     *
     * @param {InspectionDataEntity} item inspection Data
     * @return {void}
     */
    public onRightClickFacility(item: InspectionDataEntity): void {
        item.facilities_processes = '';
    }

    /**
     * right click inspection item
     * @author DuyPham
     *
     * @param {InspectionDataEntity} item inspection Data
     * @return {void}
     */
    public onRightClickInspectionItem(item: InspectionDataEntity): void {
        item.inspection_items = '';
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
        const modal = this._modalService.open(ModalInspectionDataComponent, {
            centered: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const modalInstance = modal.componentInstance as ModalInspectionDataComponent;

    }

    /**
     * management group changed
     * @author DuyPham
     *
     * @param {InspectionDataEntity} item InspectionDataEntity
     * @param {Event} event Event
     * @returns {void}
     */
    public onChangeManagementGroup(item: InspectionDataEntity, event: Event): void {
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
     * @param {InspectionDataEntity} item InspectionDataEntity
     * @param {Event} event Event
     * @returns {void}
     */
    public onChangeFacilitiesProcesses(item: InspectionDataEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (this.Lib.isBlank(value)) return;
        item.facilities_processes = value;
        item.is_facilities_processes_edit = false;
    }

    /**
     * inspection items changed
     * @author DuyPham
     *
     * @param {InspectionDataEntity} item InspectionDataEntity
     * @param {Event} event Event
     * @returns {void}
     */
    public onChangeInspectionItems(item: InspectionDataEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (this.Lib.isBlank(value)) return;
        item.inspection_items = value;
        item.is_inspection_items_edit = false;
    }

}
