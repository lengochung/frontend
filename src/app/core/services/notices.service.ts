import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, NoticesEntity, NoticesSearchEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NoticesService extends BaseService {

    /**
     * Get notice list
     *
     * @param {NoticesSearchEntity} params NoticesSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<NoticesEntity[]>
     */
    public getNoticeList(params: NoticesSearchEntity): Observable<JsonResultEntity<NoticesEntity[]>> {
        const result = this.FLHttp.post<NoticesEntity[]>(this.Constants.API_URL.NOTICES.LIST, params);
        return this.returnHttpResponseObservable<NoticesEntity[]>(result);
    }

    /**
     * Get notice detail
     * @author DuyPham
     *
     * @param {NoticesSearchEntity} params NoticesSearchEntity id
     * @returns {object} NoticesEntity
     */
    public getNoticeDetail(params: NoticesEntity): Observable<JsonResultEntity<NoticesEntity>> {
        const result = this.FLHttp.post<NoticesEntity>(this.Constants.API_URL.NOTICES.DETAIL, params);
        return this.returnHttpResponseObservable<NoticesEntity>(result);
    }

    /**
     * save notice info by edit_type
     *  0: create
     *  1: save update
     *  2: save update synch and send email
     *  3: close notice
     * @param {NoticesEntity} params NoticesEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<NoticesEntity>
     */
    public onSave(params: NoticesEntity): Observable<JsonResultEntity<NoticesEntity>> {
        const result = this.FLHttp.post<NoticesEntity>(this.Constants.API_URL.NOTICES.SAVE, params);
        return this.returnHttpResponseObservable<NoticesEntity>(result);
    }

}
