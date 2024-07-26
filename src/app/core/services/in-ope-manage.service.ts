import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, InOpeManageEntity, InOpeManageFilterEntity, InOpeManageSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class InOpeManageService extends BaseService {

    /**
     * Get in-ope management list
     *
     * @param {InOpeManageSearchEntity} params InOpeManageSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<InOpeManageFilterEntity>
     */
    public getAllList(params: InOpeManageSearchEntity): Observable<JsonResultEntity<InOpeManageFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<InOpeManageFilterEntity>(`${environment.api_url_mockup}in-ope-manage/in_ope_manage_list.json`, params, opts);
        return this.returnHttpResponseObservable<InOpeManageFilterEntity>(result);
    }

    /**
     * Get in-ope management detail
     * @author DuyPham
     *
     * @param {{id: number}} params in-ope management id
     * @returns {object} InOpeManageEntity
     */
    public getInOpeManageDetail(params: {id: number}): Observable<JsonResultEntity<InOpeManageEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<InOpeManageEntity>(`${environment.api_url_mockup}in-ope-manage/in_ope_manage_detail.json`, params, opts);
        return this.returnHttpResponseObservable<InOpeManageEntity>(result);
    }

    /**
     * save in-ope management info
     *
     * @param {InOpeManageEntity} params InOpeManageEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<InOpeManageEntity>
     */
    public onSave(params: InOpeManageEntity): Observable<JsonResultEntity<InOpeManageEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<InOpeManageEntity>(`${environment.api_url_mockup}in-ope-manage/in_ope_manage_detail.json`, params, opts);
        return this.returnHttpResponseObservable<InOpeManageEntity>(result);
    }

}
