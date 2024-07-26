import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { ItemsEntity, ItemsSearchEntity, JsonResultEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ItemsService extends BaseService {

    /**
     * Get item list
     * @author hung.le
     *
     * @param {ItemsSearchEntity} params ItemsSearchEntity
     * @returns {Observable<JsonResultEntity<ItemsEntity[]>>} ItemsEntity[]
     */
    public getAllList(params: ItemsSearchEntity): Observable<JsonResultEntity<ItemsEntity[]>> {
        const result = this.FLHttp.post<ItemsEntity[]>(this.Constants.API_URL.ITEMS.LIST, params);
        return this.returnHttpResponseObservable<ItemsEntity[]>(result);
    }

        /**
     * Get dropdown list division
     * @date 2024/07/24 10:38
     * @author DuyPham
     *
     * @public
     * @param {object} params params {
     *  function_name: string,
     *  page_name: string,
     *  page: number
     * }
     * @returns {Observable<JsonResultEntity<ItemsEntity[]>>} ItemsEntity[]
     */
    public getItemsDropdown(params: {function_name: string; page_name: string; page: number}) : Observable<JsonResultEntity<ItemsEntity[]>> {
        const result = this.FLHttp.post<ItemsEntity[]>(this.Constants.API_URL.ITEMS.DROPDOWN, params);
        return this.returnHttpResponseObservable<ItemsEntity[]>(result);
    }
    /**
     * Get item detail by item_no
     * @author hung.le
     * @date 2024/07/25
     * @param {ItemsEntity} params ItemsEntity
     * @returns {Observable<JsonResultEntity<ItemsEntity>>} ItemsEntity
     */
    public getDetail(params: ItemsEntity): Observable<JsonResultEntity<ItemsEntity>> {
        const result = this.FLHttp.post<ItemsEntity>(this.Constants.API_URL.ITEMS.DETAIL, params);
        return this.returnHttpResponseObservable<ItemsEntity>(result);
    }
}
