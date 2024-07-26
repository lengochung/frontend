import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { DivisionsService, FunctionsService, ItemsService, PagesService } from '../../../core/services';
import { DivisionsEntity, DivisionsSearchEntity, FunctionsEntity, ItemsEntity, PagesEntity } from '../../../core/entities';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../../core/components/modal/modal-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { InfiniteScrollDirective, InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FilterDisplay, FilterEntity, FilterTableEntity } from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import { OverlayScrollbarsDirective, OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DivisionValidator } from '../validator/division.validator';

@Component({
    templateUrl: './division-list.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        InfiniteScrollModule,
        TableFilterDirective,
        ColumnFilterDirective,
        OverlayscrollbarsModule
    ],
})
export class DivisionListComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(InfiniteScrollDirective) infiniteScroll?: InfiniteScrollDirective
    private _subscriptionList: Subscription[] = [];
    private _divisionEditingList: DivisionsEntity[] = [];
    private _isStopLoadMore = false;
    private _filter?: FilterEntity;

    public divisionList: DivisionsEntity[] = [];
    public filter?: FilterTableEntity;
    public functionList?: FunctionsEntity[];
    public functionListSelect?: FunctionsEntity[];
    public filterDisplayFunctionList?: FilterDisplay[];
    public pageList?: PagesEntity[];
    public pageListSelect?: PagesEntity[];
    public filterDisplayPageList?: FilterDisplay[];
    public itemList?: ItemsEntity[];
    public itemListSelect?: ItemsEntity[];
    public filterDisplayItemList?: FilterDisplay[];

    @ViewChild('scrollbar', { read: OverlayScrollbarsDirective })
    private osDirective?: OverlayScrollbarsDirective;
    @ViewChild('scrollbar')
    private targetEl?: ElementRef<HTMLElement>;
    @ViewChild('viewPort')
    private viewPort?: ElementRef<HTMLElement>;

    // validator division
    public validator: DivisionValidator;
    /** Constructor */
    constructor(
        private _router: Router,
        private _divisionService: DivisionsService,
        private _modalService: NgbModal,
        private _toastrService: ToastrService,
        private _functionsService: FunctionsService,
        private _pageService: PagesService,
        private _itemService: ItemsService
    ) {
        super();
        this.validator = new DivisionValidator();
        this.validator.showMessageBelowControl = false;
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._getSelectList();
        this._getDivisionList();
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }
    /**
     * @returns {void}
     */
    ngAfterViewInit(): void {
        this.osDirective?.osInitialize({
            target: this.targetEl!.nativeElement,
            elements: {
                viewport: this.viewPort?.nativeElement
            },
        });
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
     * Get division list
     *
     * @param {boolean} isLoadMore is load more
     * @returns {void}
     */
    private _getDivisionList(isLoadMore = false): void {
        if (this.isSearching) return;
        const params = {} as DivisionsSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        params.search = this._filter?.search;
        params.isPaginate = true;

        const sub = this._divisionService.getListFilterSearch(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (rsp) => {
                if (!rsp || !rsp.status || !rsp.data) {
                    this.searchResultCount = 0;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                    if (!isLoadMore) this.divisionList = [];
                    return;
                }
                if (isLoadMore) {
                    this.divisionList.push(...rsp.data);
                } else {
                    this.divisionList = rsp.data;
                    // scroll top
                    (this.viewPort?.nativeElement as HTMLElement).scrollTo({top: 0, left: 0, behavior: 'instant'});
                    this.infiniteScroll?.destroyScroller();
                    this.infiniteScroll?.setup();
                }
                this.searchResultCount = rsp.total_row;
                this.isPageLoaded = true;
                this.isSearching = false;
                if (rsp.data.length < this.Constants.PAGINATE_LIMIT) {
                    this._isStopLoadMore = true;
                } else {
                    this._isStopLoadMore = false;
                }
            },
            error: () => {
                this.searchResultCount = 0;
                this.isPageLoaded = true;
                this.isSearching = false;
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * Add new division
     * @returns {void}
     */
    public onAddNew(): void {
        const newDivision = new DivisionsEntity();
        newDivision.is_edit = true;
        this.divisionList.unshift(newDivision);
        (this.viewPort?.nativeElement as HTMLElement).scrollTo({top: 0, left: 0, behavior: 'smooth'});
        this._getSelectList();
    }

    /**
     * Edit mode
     * @param {DivisionsEntity} dataE division data
     * @returns {void}
     */
    public onEdit(dataE: DivisionsEntity): void {
        dataE.is_edit = true;
        this._divisionEditingList.push({...dataE});
        dataE.candidate_input_control = this._controlCandidateInput(dataE);
        /**
         * Load list select by division data
         */
        this.selectFunctionChanged(dataE);
        this.selectPageChanged(dataE);
    }

    /**
     * cancel
     * @param {DivisionsEntity} dataE division data
     * @param {number} index index
     * @returns {void}
     */
    public onCancel(dataE: DivisionsEntity, index: number): void {
        if (!dataE.division_id) {
            this.divisionList.splice(index, 1);
            return;
        }
        dataE.is_edit = false;
        const dataOld = this._divisionEditingList.find(p => p.division_id === dataE.division_id);

        if (dataOld) {
            dataE.function_id = dataOld.function_id;
            dataE.page_id = dataOld.page_id;
            dataE.item_id = dataOld.item_id;
            dataE.candidate = dataOld.candidate;
            this._divisionEditingList = this._divisionEditingList.filter(p => p.division_id !== dataE.division_id);
        }
    }

    /**
     * select Function changed
     * @author hung.le
     * @date 2024/07/05
     * @param {DivisionsEntity} dataE division data
     * @returns {void}
     */
    public selectFunctionChanged(dataE: DivisionsEntity): void {
        dataE.function_id_invalid = false;
        /**
         * Filter cho PageList select theo function_id
         */
        this.pageListSelect = this.pageList?.filter(p => p.function_no === dataE.function_id && p.page_name);
        /**
         * Check page_id of dataE exists
         */
        if(!this.pageListSelect?.find(p => p.page_no === dataE.page_id)?.page_name) {
            dataE.page_id = undefined;
            dataE.item_id = undefined;
        }
        dataE.candidate_input_control = this._controlCandidateInput(dataE);
    }

    /**
     * select report changed
     * @author hung.le
     * @date 2024/07/05
     * @param {DivisionsEntity} dataE division data
     * @returns {void}
     */
    public selectPageChanged(dataE: DivisionsEntity): void {
        dataE.page_id_invalid = false;
        /**
         * Filter cho ItemList select theo page_id
         */
        this.itemListSelect = this.itemList?.filter(i => i.page_no === dataE.page_id && i.item_name);
        /**
         * Check item_id of dataE exists
         */
        if(!this.itemListSelect?.find(i => i.item_no === dataE.item_id)?.item_name) {
            dataE.item_id = undefined;
        }
        dataE.candidate_input_control = this._controlCandidateInput(dataE);
    }

    /**
     * select field changed
     * @author hung.le
     * @date 2024/07/05
     * @param {DivisionsEntity} dataE division data
     * @returns {void}
     */
    public selectItemChanged(dataE: DivisionsEntity): void {
        dataE.item_id_invalid = false;
        dataE.candidate_input_control = this._controlCandidateInput(dataE);
    }

    /**
     * name typing
     * @author DuyPham
     *
     * @param {DivisionsEntity} dataE division data
     * @param {Event} event event
     * @returns {void}
     */
    public onCandidateTyping(dataE: DivisionsEntity, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.trim();
        if (this.Lib.isBlank(value)) {
            dataE.candidate_invalid = true;
        } else {
            dataE.candidate_invalid = false;
        }
    }

    /**
     * Save/update division
     * @param {DivisionsEntity} dataE division data
     * @returns {void}
     * @author hung.le
     * @date 2024/07/05
     */
    public onSave(dataE: DivisionsEntity): void {
        /**
         * Validate
         */
        const form = this.validator.createRules();
        form.patchValue(dataE);
        this.validator.makeValidator(form, this.validator.createErrorMessages());
        Object.keys(form.controls).forEach(controlName => {
            const control = form.get(controlName);
            // Check control errors
            if (control?.errors) {
                (dataE as any)[`${controlName  }_invalid` as keyof typeof dataE] = true;
            }
          });
        if (form.invalid) {
            // this.toastr.warning(this.validator.errors.join('\n'));
                    // Hidden message error delay time 5s
            setTimeout(() => {
                this.validator.errors = [];
            }, 5000);
            return;
        }
        this.validator.errors = [];
        if (dataE.division_id) {
            this._divisionEditingList = this._divisionEditingList.filter(p => p.division_id !== dataE.division_id);
        }
        // Params
        const params: DivisionsEntity = {
            division_id: dataE.division_id,
            function_id: dataE.function_id,
            page_id: dataE.page_id,
            item_id: dataE.item_id,
            candidate: dataE.candidate,
            upd_datetime: dataE.upd_datetime,
            is_new: !dataE.division_id || dataE.division_id < 0
        }
        const sub = this._divisionService.onSave(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    const errorList = this.getApiErrorMessages(rsp.msg);
                    this.validator.errors = errorList;
                    return;
                }
                dataE.is_edit = false;
                let successMsg = this.translate.instant('message.create_success', {field: ''}) as string;
                if (params.division_id) {
                    successMsg = this.translate.instant('message.update_success', {field: ''}) as string;
                }
                this._toastrService.success(successMsg);
                // Reload division when save success
                const rspDivisionE = rsp.data;
                dataE.division_id = rspDivisionE.division_id;
                dataE.function_id = rspDivisionE.function_id;
                dataE.page_id = rspDivisionE.page_id;
                dataE.item_id = rspDivisionE.item_id;
                dataE.candidate = rspDivisionE.candidate;
                dataE.upd_datetime = rspDivisionE.upd_datetime;
                // Reload data functions/pages/items
                this._getSelectList();
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * delete
     * @param {DivisionsEntity} dataE division data
     * @param {number} index index row
     * @returns {void}
     * @author hung.le
     * @date 2024/07/05
     */
    public onDelete(dataE: DivisionsEntity, index: number): void {
        if (!dataE.division_id) {
            this.divisionList.splice(index, 1);
            return;
        }
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.translate.instant('label.confirm_delete_division') as string;
        modalInstance.modalTitle = this.translate.instant('label.modal_title_message') as string;
        modalInstance.okText = this.translate.instant('label.modal_ok') as string;
        modalInstance.cancelText = this.translate.instant('label.modal_cancel') as string;

        const modalSubscription = modalInstance.confirm.subscribe((status: boolean) => {
            if (!status) {
                return;
            }
            if (!dataE.division_id) return;
            const sub = this._divisionService.onDelete(dataE.division_id)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.divisionList = this.divisionList.filter(p => p.division_id != dataE.division_id);
                    const successMsg = this.translate.instant(
                        'message.delete_successfully'
                    ) as string;
                    this._toastrService.success(successMsg);
                }
            });
            this._subscriptionList.push(sub);

        });
        this._subscriptionList.push(modalSubscription);
    }

    /**
     * Load more
     * @returns {void}
     */
    public onLoadMore(): void {
        if (!this._isStopLoadMore) {
            this.currentPage++;
            this._getDivisionList(true);
        }
    }

    /**
     * Get all select
     * @returns {void}
     */
    private _getSelectList(): void {
        /**
         * FunctionsList select
         */
        const functionSubscription = this._functionsService.getAllList({})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.functionList = rsp.data;
                this.functionListSelect = rsp.data;
                this.filterDisplayFunctionList = this.functionList.map(f => {
                    return {
                        id: f.function_no,
                        name: f.function_name
                    } as FilterDisplay;
                });
            }});
        this._subscriptionList.push(functionSubscription);

        /**
         * Page list select
         */
        const pageSubscription = this._pageService.getAllList({})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.pageList = rsp.data;
                this.filterDisplayPageList = this.pageList.map(p => {
                    return {
                        id: p.page_no,
                        name: p.page_name
                    } as FilterDisplay;
                });
            }});
        this._subscriptionList.push(pageSubscription);

        /**
         * Item list select
         */
        const itemSubscription = this._itemService.getAllList({})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.itemList = rsp.data;
                this.filterDisplayItemList = this.itemList.map(i => {
                    return {
                        id: i.item_no,
                        name: i.item_name
                    } as FilterDisplay;
                });
            }});
        this._subscriptionList.push(itemSubscription);
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
        this.currentPage = 0;
        this._getDivisionList();
    }

    /**
     * Get business name
     * @author DuyPham
     *
     * @param {number} function_id function_id
     * @returns {string} name
     */
    public getFunctionName(function_id?: number): string {
        return this.functionList?.find(p => p.function_no === function_id)?.function_name ?? '';
    }

    /**
     * Get report name
     * @author DuyPham
     *
     * @param {number} page_id page_id
     * @returns {string} name
     */
    public getPageName(page_id?: number): string {
        return this.pageList?.find(p => p.page_no === page_id)?.page_name ?? '';
    }

    /**
     * Get field name
     * @author DuyPham
     *
     * @param {number} item_id item_id
     * @returns {string} name
     */
    public getItemName(item_id?: number): string {
        return this.itemList?.find(i => i.item_no === item_id)?.item_name ?? '';
    }
    /**
     * When function_id, page_id, item_id has value => enabled input candidate
     * @author hung.le
     * @date 2024/07/23
     * @param {DivisionsEntity} dataE DivisionsEntity
     * @returns {boolean} boolean
     */
    private _controlCandidateInput(dataE: DivisionsEntity): boolean {
        if((this.Lib.isBlank(dataE.function_id) || this.Lib.isBlank(dataE.page_id) || this.Lib.isBlank(dataE.item_id)) && !dataE.division_id)
            return false;
        else
            return true;
    }

}
