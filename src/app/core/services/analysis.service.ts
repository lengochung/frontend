import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, AnalysisEntity, AnalysisFilterEntity, AnalysisSearchEntity, AnalysisStatisticEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AnalysisService extends BaseService {

    /**
     * Get analysis list
     *
     * @param {AnalysisSearchEntity} params AnalysisSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<AnalysisFilterEntity>
     */
    public getAnalysisList(params: AnalysisSearchEntity): Observable<JsonResultEntity<AnalysisFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<AnalysisFilterEntity>(`${environment.api_url_mockup}analysis/analysis_list.json`, params, opts);
        return this.returnHttpResponseObservable<AnalysisFilterEntity>(result);
    }

    /**
     * Get analysis detail
     * @author DuyPham
     *
     * @param {{id: number}} params analysis id
     * @returns {object} AnalysisEntity
     */
    public getAnalysisDetail(params: {id: number}): Observable<JsonResultEntity<AnalysisEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<AnalysisEntity>(`${environment.api_url_mockup}analysis/analysis_detail.json`, params, opts);
        return this.returnHttpResponseObservable<AnalysisEntity>(result);
    }

    /**
     * save analysis
     *
     * @param {AnalysisEntity} params AnalysisEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<AnalysisEntity>
     */
    public onSave(params: AnalysisEntity): Observable<JsonResultEntity<AnalysisEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<AnalysisEntity>(`${environment.api_url_mockup}analysis/analysis_detail.json`, params, opts);
        return this.returnHttpResponseObservable<AnalysisEntity>(result);
    }

    /**
     * get analysis statistic from - to date
     * @author DuyPham
     *
     * @param {string} fromDate from date
     * @param {string} toDate to date
     * @param {number} dateType dateType
     * @returns {AnalysisStatisticEntity[]} AnalysisStatisticEntity [{
     *  date: string,
     *  count: number
     * }]
     */
    public getAnalysisStatistic(fromDate: string, toDate: string, dateType: number): Observable<JsonResultEntity<AnalysisStatisticEntity[]>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {
            from_date: fromDate,
            to_date: toDate,
            dateType: dateType
        };
        const result = this.FLHttp.get<AnalysisStatisticEntity[]>(`${environment.api_url_mockup}analysis/analysis-statistic.json`, params, opts);
        return this.returnHttpResponseObservable<AnalysisStatisticEntity[]>(result);
    }

}
