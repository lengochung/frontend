import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { FormControl, FormGroup } from '@angular/forms';

import { SubjectService, TopicsService } from '../../../core/services';
import { TableFilterDirective } from '../../../core/directives/table-filter.directive';
import { FilterEntity } from '../../../core/entities/filter-table.entity';
import { ColumnFilterDirective } from '../../../core/directives/column-filter.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopicsEntity, TopicsSearchEntity } from '../../../core/entities';

@Component({
    templateUrl: './topic-list.component.html',
    standalone: true,
    imports: [SHARED_MODULE, TableFilterDirective, ColumnFilterDirective],
})
export class TopicListComponent extends BaseComponent implements OnInit {
    public searchForm!: FormGroup;
    public topicList?: TopicsEntity[] = [];
    private _filter?: FilterEntity;

    /** Constructor */
    constructor(
        private _router: Router,
        private _topicService: TopicsService,
        private _subjectService: SubjectService
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._searchFormRules();
        this._getTopicList();
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
     * Get topic list
     * @returns {void}
     */
    private _getTopicList(): void {
        if (this.isSearching) return;
        const params = this.searchForm.value as TopicsSearchEntity;
        params.page = this.currentPage;
        params.filter = this._filter?.filter;
        params.sort = this._filter?.sort;
        params.search = this._filter?.search;
        this._topicService
            .getTopicList(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        this.searchResultCount = 0;
                        this.topicList = [];
                        this.isPageLoaded = true;
                        this.isSearching = false;
                        return;
                    }
                    this.topicList = rsp.data;
                    this.searchResultCount = rsp.total_row;
                    this.isPageLoaded = true;
                    this.isSearching = false;
                },
                error: () => {
                    this.topicList = [];
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
        void this._getTopicList();
    }
    /**
     * Search
     *
     * @returns {void}
     */
    public onSearch(): void {
        this.Lib.insertParamToUrl(this.Constants.PAGINATION_PARAM, 1);
        this.currentPage = 0;
        this._getTopicList();
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
        this._getTopicList();
    }

    /**
     * Go to detail screen
     * @author DuyPham
     *
     * @param {TopicEntity} topic topic
     * @returns {void}
     */
    public onDetail(topic: TopicsEntity): void {
        if (!topic.target_id) return;
        let url = '';
        switch (topic.status_id) {
            case this.Constants.TOPIC_STATUS.PRECAUTION:
                url = `${this.Constants.APP_URL.PREVENTION_REPORT.MODULE}/${this.Constants.APP_URL.PREVENTION_REPORT.DETAIL}`;
                break;
            case this.Constants.TOPIC_STATUS.CORRECTIVE:
                url = `${this.Constants.APP_URL.CORRECTIVE_REPORT.MODULE}/${this.Constants.APP_URL.CORRECTIVE_REPORT.DETAIL}`;
                break;
            case this.Constants.TOPIC_STATUS.MALFUNCTION:
                url = `${this.Constants.APP_URL.INCIDENT_REPORT.MODULE}/${this.Constants.APP_URL.INCIDENT_REPORT.DETAIL}`;
                break;
            case this.Constants.TOPIC_STATUS.DAILY_REPORT:
                url = `${this.Constants.APP_URL.DAILY_REPORT.MODULE}/${this.Constants.APP_URL.DAILY_REPORT.DETAIL}`;
                break;
            default:
                return;
        }
        void this._router.navigate([`${url}/${topic.target_id}`]);
    }


    /**
     * Go to notice detail
     * @date 2024-07-18 07:32
     * @author DuyPham
     *
     * @public
     * @param {number} noticeId notice id
     * @returns {void}
     */
    public onGoNoticeDetail(noticeId?: number): void {
        if (!noticeId) return;
        void this._router.navigate([`${this.Constants.APP_URL.NOTICES.MODULE }/${ this.Constants.APP_URL.NOTICES.DETAIL}/${noticeId}`]);
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
        this._getTopicList();
    }
}
