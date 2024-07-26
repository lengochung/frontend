import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, ChangeOrderEntity, ChangeOrderFilterEntity, ChangeOrderSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ChangeOrderService extends BaseService {

    /**
     * Get change order list
     *
     * @param {ChangeOrderSearchEntity} params ChangeOrderSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<ChangeOrderFilterEntity>
     */
    public getChangeOrderList(params: ChangeOrderSearchEntity): Observable<JsonResultEntity<ChangeOrderFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<ChangeOrderFilterEntity>(`${environment.api_url_mockup}change-order/change_order_list.json`, params, opts);
        return this.returnHttpResponseObservable<ChangeOrderFilterEntity>(result);
    }

    /**
     * Get change order detail
     * @author DuyPham
     *
     * @param {{id: number}} params change order id
     * @returns {object} ChangeOrderEntity
     */
    public getChangeOrderDetail(params: {id: number}): Observable<JsonResultEntity<ChangeOrderEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<ChangeOrderEntity>(`${environment.api_url_mockup}change-order/change_order_detail.json`, params, opts);
        return this.returnHttpResponseObservable<ChangeOrderEntity>(result);
    }

    /**
     * save change order
     *
     * @param {ChangeOrderEntity} params ChangeOrderEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<ChangeOrderEntity>
     */
    public onSave(params: ChangeOrderEntity): Observable<JsonResultEntity<ChangeOrderEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<ChangeOrderEntity>(`${environment.api_url_mockup}change-order/change_order_detail.json`, params, opts);
        return this.returnHttpResponseObservable<ChangeOrderEntity>(result);
    }

}
