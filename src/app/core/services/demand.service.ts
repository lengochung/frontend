import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, DemandEntity, DemandFilterEntity, DemandSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class DemandService extends BaseService {

    /**
     * Get demand list
     *
     * @param {DemandSearchEntity} params DemandSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<DemandFilterEntity>
     */
    public getAllList(params: DemandSearchEntity): Observable<JsonResultEntity<DemandFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<DemandFilterEntity>(`${environment.api_url_mockup}demand/demand_list.json`, params, opts);
        return this.returnHttpResponseObservable<DemandFilterEntity>(result);
    }

    /**
     * Get demand detail
     * @author DuyPham
     *
     * @param {{id: number}} params demand id
     * @returns {object} DemandEntity
     */
    public getDemandDetail(params: {id: number}): Observable<JsonResultEntity<DemandEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<DemandEntity>(`${environment.api_url_mockup}demand/demand_detail.json`, params, opts);
        return this.returnHttpResponseObservable<DemandEntity>(result);
    }

    /**
     * save demand info
     *
     * @param {DemandEntity} params DemandEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<DemandEntity>
     */
    public onSave(params: DemandEntity): Observable<JsonResultEntity<DemandEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<DemandEntity>(`${environment.api_url_mockup}demand/demand_detail.json`, params, opts);
        return this.returnHttpResponseObservable<DemandEntity>(result);
    }

}
