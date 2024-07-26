import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, DailyReportEntity, DailyReportFilterEntity, DailyReportSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class DailyReportService extends BaseService {

    /**
     * Get daily report list
     *
     * @param {DailyReportSearchEntity} params DailyReportSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<DailyReportFilterEntity>
     */
    public getDailyReportList(params: DailyReportSearchEntity): Observable<JsonResultEntity<DailyReportFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<DailyReportFilterEntity>(`${environment.api_url_mockup}daily-report/daily_report_list.json`, params, opts);
        return this.returnHttpResponseObservable<DailyReportFilterEntity>(result);
    }

    /**
     * Get daily report detail
     * @author DuyPham
     *
     * @param {{id: number}} params daily report id
     * @returns {object} DailyReportEntity
     */
    public getDailyReportDetail(params: {id: number}): Observable<JsonResultEntity<DailyReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<DailyReportEntity>(`${environment.api_url_mockup}daily-report/daily_report_detail.json`, params, opts);
        return this.returnHttpResponseObservable<DailyReportEntity>(result);
    }

    /**
     * save daily report
     *
     * @param {DailyReportEntity} params DailyReportEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<DailyReportEntity>
     */
    public onSave(params: DailyReportEntity): Observable<JsonResultEntity<DailyReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<DailyReportEntity>(`${environment.api_url_mockup}daily-report/daily_report_detail.json`, params, opts);
        return this.returnHttpResponseObservable<DailyReportEntity>(result);
    }

    /**
     * confirm daily report
     *
     * @param {string} message message confirm
     * @returns {JsonResultEntity} @var JsonResultEntity<DailyReportEntity>
     */
    public onConfirm(message: string): Observable<JsonResultEntity<DailyReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {
            message: message
        };
        const result = this.FLHttp.get<DailyReportEntity>(`${environment.api_url_mockup}daily-report/daily_report_confirm.json`, params, opts);
        return this.returnHttpResponseObservable<DailyReportEntity>(result);
    }

}
