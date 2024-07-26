import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, IncidentReportEntity, IncidentReportFilterEntity, IncidentReportSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class IncidentReportService extends BaseService {

    /**
     * Get incident report list
     *
     * @param {IncidentReportSearchEntity} params IncidentReportSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<IncidentReportFilterEntity>
     */
    public getIncidentReportList(params: IncidentReportSearchEntity): Observable<JsonResultEntity<IncidentReportFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<IncidentReportFilterEntity>(`${environment.api_url_mockup}incident-report/incident_report_list.json`, params, opts);
        return this.returnHttpResponseObservable<IncidentReportFilterEntity>(result);
    }

    /**
     * Get incident report detail
     * @author DuyPham
     *
     * @param {{id: number}} params incident report id
     * @returns {object} IncidentReportEntity
     */
    public getIncidentReportDetail(params: {id: number}): Observable<JsonResultEntity<IncidentReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<IncidentReportEntity>(`${environment.api_url_mockup}incident-report/incident_report_detail.json`, params, opts);
        return this.returnHttpResponseObservable<IncidentReportEntity>(result);
    }

    /**
     * save incident report
     *
     * @param {IncidentReportEntity} params IncidentReportEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<IncidentReportEntity>
     */
    public onSave(params: IncidentReportEntity): Observable<JsonResultEntity<IncidentReportEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<IncidentReportEntity>(`${environment.api_url_mockup}incident-report/incident_report_detail.json`, params, opts);
        return this.returnHttpResponseObservable<IncidentReportEntity>(result);
    }

}
