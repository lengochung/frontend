import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { FunctionsEntity, FunctionsSearchEntity, JsonResultEntity } from "../entities";
import { Observable } from "rxjs";


/**
 * hung.le
 * 01/07/2024
 * Function service
 */
@Injectable({ providedIn: 'root' })
export class FunctionsService extends BaseService {

    /**
     * Get function list management
     * @author hung.le
     *
     * @param {DivisionsSearchEntity} params DivisionsSearchEntity
     * @returns {Observable<JsonResultEntity<FunctionsEntity[]>>} FunctionsEntity[]
     */
    public getAllList(params: FunctionsSearchEntity): Observable<JsonResultEntity<FunctionsEntity[]>> {
        const result = this.FLHttp.post<FunctionsEntity[]>(this.Constants.API_URL.FUNCTIONS.LIST, params);
        return this.returnHttpResponseObservable<FunctionsEntity[]>(result);
    }
}
