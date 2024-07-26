import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { DivisionsEntity, DivisionsSearchEntity, JsonResultEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class DivisionsService extends BaseService {

    /**
     * Get division list management
     * @author DuyPham
     *
     * @param {DivisionsSearchEntity} params DivisionsSearchEntity
     * @returns {Observable<JsonResultEntity<DivisionsEntity[]>>} DivisionsEntity[]
     */
    public getAllList(params: DivisionsSearchEntity): Observable<JsonResultEntity<DivisionsEntity[]>> {
        const result = this.FLHttp.post<DivisionsEntity[]>(this.Constants.API_URL.DIVISIONS.LIST, params);
        return this.returnHttpResponseObservable<DivisionsEntity[]>(result);
    }
    /**
     * Get division list management
     * @author hung.le
     *
     * @param {DivisionsSearchEntity} params DivisionsSearchEntity
     * @returns {Observable<JsonResultEntity<DivisionsEntity[]>>} DivisionsEntity[]
     */
    public getStatusListByPageNo(params: DivisionsSearchEntity): Observable<JsonResultEntity<DivisionsEntity[]>> {
        const result = this.FLHttp.post<DivisionsEntity[]>(this.Constants.API_URL.DIVISIONS.STATUS_LIST, params);
        return this.returnHttpResponseObservable<DivisionsEntity[]>(result);
    }
    /**
     * Get division list management
     * @author hung.le
     *
     * @param {DivisionsSearchEntity} params DivisionsSearchEntity
     * @returns {Observable<JsonResultEntity<DivisionsEntity[]>>} DivisionsEntity[]
     */
    public getAllListSelect(params: DivisionsSearchEntity): Observable<JsonResultEntity<DivisionsEntity[]>> {
        const opts = new this.HTTPOptions();
        opts.showLoading = false;
        const result = this.FLHttp.post<DivisionsEntity[]>(this.Constants.API_URL.DIVISIONS.LIST, params, opts);
        return this.returnHttpResponseObservable<DivisionsEntity[]>(result);
    }
    /**
     * Get division detail by division_id
     * @author hung.le
     *
     * @param {DivisionsEntity} params DivisionsEntity
     * @returns {Observable<JsonResultEntity<DivisionsEntity>>} DivisionsEntity
     */
    public getDetail(params: DivisionsEntity): Observable<JsonResultEntity<DivisionsEntity>> {
        const result = this.FLHttp.post<DivisionsEntity>(this.Constants.API_URL.DIVISIONS.DETAIL, params);
        return this.returnHttpResponseObservable<DivisionsEntity>(result);
    }

    /**
     * delete record by id
     * @author DuyPham
     *
     * @param {number} id id
     * @returns {DivisionsEntity} DivisionsEntity {
     *  division_id?: number;
     * }
     */
    public onDelete(id: number): Observable<JsonResultEntity<DivisionsEntity>> {
        const params = {
            division_id: id
        };
        const result = this.FLHttp.post<DivisionsEntity>(this.Constants.API_URL.DIVISIONS.DELETE, params);
        return this.returnHttpResponseObservable<DivisionsEntity>(result);
    }

    /**
     * add or update
     * @author DuyPham
     *
     * @param {DivisionsEntity} params division data
     * @returns {DivisionsEntity} DivisionsEntity {
     * }
     */
    public onSave(params: DivisionsEntity): Observable<JsonResultEntity<DivisionsEntity>> {
        const result = this.FLHttp.post<DivisionsEntity>(this.Constants.API_URL.DIVISIONS.SAVE, params);
        return this.returnHttpResponseObservable<DivisionsEntity>(result);
    }

    /**
     * get Business List
     * @author DuyPham
     *
     * @returns {Observable<object[]>} object[]
     */
    public getBusinessList(): Observable<JsonResultEntity<{ id: number; name: string }[]>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {};
        const result = this.FLHttp.get<{ id: number; name: string }[]>(`${environment.api_url_mockup}division/business-list.json`, params, opts);
        return this.returnHttpResponseObservable<{ id: number; name: string }[]>(result);
    }

    /**
     * get Report List
     * @author DuyPham
     *
     * @returns {Observable<object[]>} object[]
     */
    public getReportList(): Observable<JsonResultEntity<{ id: number; name: string }[]>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {};
        const result = this.FLHttp.get<{ id: number; name: string }[]>(`${environment.api_url_mockup}division/report-list.json`, params, opts);
        return this.returnHttpResponseObservable<{ id: number; name: string }[]>(result);
    }

    /**
     * get Field List
     * @author DuyPham
     *
     * @returns {Observable<object[]>} object[]
     */
    public getFieldList(): Observable<JsonResultEntity<{ id: number; name: string }[]>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {};
        const result = this.FLHttp.get<{ id: number; name: string }[]>(`${environment.api_url_mockup}division/field-list.json`, params, opts);
        return this.returnHttpResponseObservable<{ id: number; name: string }[]>(result);
    }
    /**
     * Get list filter search
     * @author hung.le
     * @date 2024/07/23
     * @param {DivisionsSearchEntity} params DivisionsSearchEntity
     * @returns {Observable<JsonResultEntity<DivisionsEntity[]>>} DivisionsEntity[]
     */
    public getListFilterSearch(params: DivisionsSearchEntity): Observable<JsonResultEntity<DivisionsEntity[]>> {
        const result = this.FLHttp.post<DivisionsEntity[]>(this.Constants.API_URL.DIVISIONS.FILTER_SEARCH, params);
        return this.returnHttpResponseObservable<DivisionsEntity[]>(result);
    }

    /**
     * Get dropdown list division
     * @date 2024/07/24 10:38
     * @author DuyPham
     *
     * @public
     * @param {object} params params {
     *  type: number,
     *  page: number
     * }
     * @returns {Observable<JsonResultEntity<DivisionsEntity[]>>} DivisionsEntity[]
     */
    public getDivisionsDropdown(params: {type: number; page?: number}) : Observable<JsonResultEntity<DivisionsEntity[]>> {
        const result = this.FLHttp.post<DivisionsEntity[]>(this.Constants.API_URL.DIVISIONS.DROPDOWN, params);
        return this.returnHttpResponseObservable<DivisionsEntity[]>(result);
    }

}
