import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, ConstructionEntity, ConstructionFilterEntity, ConstructionSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ConstructionService extends BaseService {

    /**
     * Get construction list
     *
     * @param {ConstructionSearchEntity} params ConstructionSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<ConstructionFilterEntity>
     */
    public getAllList(params: ConstructionSearchEntity): Observable<JsonResultEntity<ConstructionFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<ConstructionFilterEntity>(`${environment.api_url_mockup}construction/construction_list.json`, params, opts);
        return this.returnHttpResponseObservable<ConstructionFilterEntity>(result);
    }

    /**
     * Get construction detail
     * @author DuyPham
     *
     * @param {{id: number}} params construction id
     * @returns {object} ConstructionEntity
     */
    public getConstructionDetail(params: {id: number}): Observable<JsonResultEntity<ConstructionEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<ConstructionEntity>(`${environment.api_url_mockup}construction/construction_detail.json`, params, opts);
        return this.returnHttpResponseObservable<ConstructionEntity>(result);
    }

    /**
     * save construction info
     *
     * @param {ConstructionEntity} params ConstructionEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<ConstructionEntity>
     */
    public onSave(params: ConstructionEntity): Observable<JsonResultEntity<ConstructionEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<ConstructionEntity>(`${environment.api_url_mockup}construction/construction_detail.json`, params, opts);
        return this.returnHttpResponseObservable<ConstructionEntity>(result);
    }

}
