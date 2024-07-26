import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, TopicsEntity, TopicsSearchEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TopicsService extends BaseService {

    /**
     * Get topic list
     *
     * @param {TopicsSearchEntity} params TopicsSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<TopicsEntity[]>
     */
    public getTopicList(params: TopicsSearchEntity): Observable<JsonResultEntity<TopicsEntity[]>> {
        const result = this.FLHttp.post<TopicsEntity[]>(this.Constants.API_URL.TOPICS.LIST, params);
        return this.returnHttpResponseObservable<TopicsEntity[]>(result);
    }

    /**
     * save notice info
     *
     * @param {TopicsEntity} params TopicsEntity
     * @param {FormData} body FormData
     * @returns {JsonResultEntity} @var JsonResultEntity<TopicsEntity>
     */
    public onSave(params: TopicsEntity): Observable<JsonResultEntity<TopicsEntity>> {
        const result = this.FLHttp.post<TopicsEntity>(this.Constants.API_URL.TOPICS.SAVE, params);
        return this.returnHttpResponseObservable<TopicsEntity>(result);
    }

}
