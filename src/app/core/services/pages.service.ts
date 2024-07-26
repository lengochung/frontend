import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, PagesEntity, PagesSearchEntity } from "../entities";
import { Observable } from "rxjs";


/**
 * hung.le
 * 01/07/2024
 * Page service
 */
@Injectable({ providedIn: 'root' })
export class PagesService extends BaseService {

    /**
     * Get page list
     * @author hung.le
     *
     * @param {PagesSearchEntity} params PagesSearchEntity
     * @returns {Observable<JsonResultEntity<PagesEntity[]>>} PagesEntity[]
     */
    public getAllList(params: PagesSearchEntity): Observable<JsonResultEntity<PagesEntity[]>> {
        const result = this.FLHttp.post<PagesEntity[]>(this.Constants.API_URL.PAGES.LIST, params);
        return this.returnHttpResponseObservable<PagesEntity[]>(result);
    }
}
