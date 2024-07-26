import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { OfficeEntity, JsonResultEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OfficeService extends BaseService {

    /**
     * get office list
     * @author DuyPham
     *
     * @param {object} params {
     *  group_office_id: number
     * }
     * @returns {OfficeEntity[]} OfficeEntity[] {
     *  office_id?: number;
     *  office_subname?: string;
     * }
     */
    public getOfficeList(params: {group_office_id: number}): Observable<JsonResultEntity<OfficeEntity[]>> {
        const result = this.FLHttp.post<OfficeEntity[]>(this.Constants.API_URL.OFFICES.LIST, params);
        return this.returnHttpResponseObservable<OfficeEntity[]>(result);
    }

}
