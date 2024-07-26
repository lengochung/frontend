import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, CorrectiveReportEntity, CorrectiveReportFilterEntity, CorrectiveReportSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CorrectiveReportService extends BaseService {

    /**
     * Get corrective report list
     *
     * @param {CorrectiveReportSearchEntity} params CorrectiveReportSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<CorrectiveReportFilterEntity>
     */
    public getCorrectiveReportList(params: CorrectiveReportSearchEntity): Observable<JsonResultEntity<CorrectiveReportFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<CorrectiveReportFilterEntity>(`${environment.api_url_mockup}corrective-report/corrective_report_list.json`, params, opts);
        return this.returnHttpResponseObservable<CorrectiveReportFilterEntity>(result);
    }

    /**
     * Get corrective report detail
     * @author DuyPham
     *
     * @param {{id: number}} params corrective report id
     * @returns {object} CorrectiveReportEntity
     */
    public getCorrectiveReportDetail(params: {id: number}): Observable<JsonResultEntity<CorrectiveReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<CorrectiveReportEntity>(`${environment.api_url_mockup}corrective-report/corrective_report_detail.json`, params, opts);
        return this.returnHttpResponseObservable<CorrectiveReportEntity>(result);
    }

    /**
     * save corrective report
     *
     * @param {CorrectiveReportEntity} params CorrectiveReportEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<CorrectiveReportEntity>
     */
    public onSave(params: CorrectiveReportEntity): Observable<JsonResultEntity<CorrectiveReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<CorrectiveReportEntity>(`${environment.api_url_mockup}corrective-report/corrective_report_detail.json`, params, opts);
        return this.returnHttpResponseObservable<CorrectiveReportEntity>(result);
    }

}
