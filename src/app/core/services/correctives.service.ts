import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, CorrectivesEntity, CorrectivesSearchEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CorrectivesService extends BaseService {

    /**
     * Get corrective list
     * @date 2024/07/22 06:12
     * @param {CorrectivesSearchEntity} params CorrectivesSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<CorrectivesEntity[]>
     */
    public getCorrectiveList(params: CorrectivesSearchEntity): Observable<JsonResultEntity<CorrectivesEntity[]>> {
        const result = this.FLHttp.post<CorrectivesEntity[]>(this.Constants.API_URL.CORRECTIVES.LIST, params);
        return this.returnHttpResponseObservable<CorrectivesEntity[]>(result);
    }

    /**
     * Get corrective detail
     * @date 2024/07/22 06:12
     * @author DuyPham
     *
     * @param {{corrective_no: number}} params corrective no
     * @returns {object} CorrectivesEntity
     */
    public getCorrectiveDetail(params: {corrective_no: number}): Observable<JsonResultEntity<CorrectivesEntity>> {
        const result = this.FLHttp.post<CorrectivesEntity>(this.Constants.API_URL.CORRECTIVES.DETAIL, params);
        return this.returnHttpResponseObservable<CorrectivesEntity>(result);
    }

    /**
     * save corrective
     *
     * @param {CorrectivesEntity} params CorrectivesEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<CorrectivesEntity>
     */
    public onSave(params: CorrectivesEntity): Observable<JsonResultEntity<CorrectivesEntity>> {
        const result = this.FLHttp.post<CorrectivesEntity>(this.Constants.API_URL.CORRECTIVES.SAVE, params);
        return this.returnHttpResponseObservable<CorrectivesEntity>(result);
    }

}
