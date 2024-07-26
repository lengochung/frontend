import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, PreventionReportEntity, PreventionReportFilterEntity, PreventionReportSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PreventionReportService extends BaseService {

    /**
     * Get prevention report list
     *
     * @param {PreventionReportSearchEntity} params PreventionReportSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<PreventionReportFilterEntity>
     */
    public getPreventionReportList(params: PreventionReportSearchEntity): Observable<JsonResultEntity<PreventionReportFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<PreventionReportFilterEntity>(`${environment.api_url_mockup}prevention-report/prevention_report_list.json`, params, opts);
        return this.returnHttpResponseObservable<PreventionReportFilterEntity>(result);
    }

    /**
     * Get prevention report detail
     * @author DuyPham
     *
     * @param {{id: number}} params prevention report id
     * @returns {object} PreventionReportEntity
     */
    public getPreventionReportDetail(params: {id: number}): Observable<JsonResultEntity<PreventionReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<PreventionReportEntity>(`${environment.api_url_mockup}prevention-report/prevention_report_detail.json`, params, opts);
        return this.returnHttpResponseObservable<PreventionReportEntity>(result);
    }

    /**
     * save prevention report
     *
     * @param {PreventionReportEntity} params PreventionReportEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<PreventionReportEntity>
     */
    public onSave(params: PreventionReportEntity): Observable<JsonResultEntity<PreventionReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<PreventionReportEntity>(`${environment.api_url_mockup}prevention-report/prevention_report_detail.json`, params, opts);
        return this.returnHttpResponseObservable<PreventionReportEntity>(result);
    }

}
