import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, TrendEntity, TrendFilterEntity, TrendSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class TrendService extends BaseService {

    /**
     * Get trend list
     *
     * @param {TrendSearchEntity} params TrendSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<TrendFilterEntity>
     */
    public getTrendList(params: TrendSearchEntity): Observable<JsonResultEntity<TrendFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<TrendFilterEntity>(`${environment.api_url_mockup}trend/trend_list.json`, params, opts);
        return this.returnHttpResponseObservable<TrendFilterEntity>(result);
    }

    /**
     * Get trend detail
     * @author DuyPham
     *
     * @param {{id: number}} params trend id
     * @returns {object} TrendEntity
     */
    public getTrendDetail(params: {id: number}): Observable<JsonResultEntity<TrendEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<TrendEntity>(`${environment.api_url_mockup}trend/trend_detail.json`, params, opts);
        return this.returnHttpResponseObservable<TrendEntity>(result);
    }

    /**
     * save trend
     *
     * @param {TrendEntity} params TrendEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<TrendEntity>
     */
    public onSave(params: TrendEntity): Observable<JsonResultEntity<TrendEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<TrendEntity>(`${environment.api_url_mockup}trend/trend_detail.json`, params, opts);
        return this.returnHttpResponseObservable<TrendEntity>(result);
    }

}
