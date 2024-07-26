import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, NoticesCommentsEntity, NoticesCommentsSearchEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NoticesCommentsService extends BaseService {

    /**
     * Get notice comment list by notice_no
     * @param {NoticesCommentsSearchEntity} params NoticesCommentsSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<NoticesCommentsEntity[]>
     */
    public getNoticesCommentsByNoticeNo(params: NoticesCommentsSearchEntity): Observable<JsonResultEntity<NoticesCommentsEntity[]>> {
        const result = this.FLHttp.post<NoticesCommentsEntity[]>(this.Constants.API_URL.NOTICES_COMMENTS.LIST, params);
        return this.returnHttpResponseObservable<NoticesCommentsEntity[]>(result);
    }

    /**
     * save notice comment info
     * @param {NoticesCommentsEntity} params NoticesCommentsEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<NoticesCommentsEntity>
     */
    public onSave(params: NoticesCommentsEntity): Observable<JsonResultEntity<NoticesCommentsEntity>> {
        const result = this.FLHttp.post<NoticesCommentsEntity>(this.Constants.API_URL.NOTICES_COMMENTS.SAVE, params);
        return this.returnHttpResponseObservable<NoticesCommentsEntity>(result);
    }
    /**
     * Reaction notice comment
     * @author hung.le 2024/07/18
     * @param {NoticesCommentsEntity} params NoticesCommentsEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<NoticesCommentsEntity>
     */
    public onReaction(params: NoticesCommentsEntity): Observable<JsonResultEntity<NoticesCommentsEntity>> {
        const opts = new this.HTTPOptions();
        opts.showLoading = false;
        const result = this.FLHttp.post<NoticesCommentsEntity>(this.Constants.API_URL.NOTICES_COMMENTS.REACTION, params, opts);
        return this.returnHttpResponseObservable<NoticesCommentsEntity>(result);
    }
    /**
     * Update notice comment info
     * @param {NoticesCommentsEntity} params NoticesCommentsEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<NoticesCommentsEntity>
     */
    public onUpdate(params: NoticesCommentsEntity): Observable<JsonResultEntity<NoticesCommentsEntity>> {
        const result = this.FLHttp.post<NoticesCommentsEntity>(this.Constants.API_URL.NOTICES_COMMENTS.UPDATE, params);
        return this.returnHttpResponseObservable<NoticesCommentsEntity>(result);
    }

    /**
     * Delete comment
     * @param {NoticesCommentsEntity} params NoticesCommentsEntity id
     * @returns {JsonResultEntity} @var JsonResultEntity<CommentEntity>
    */
    public onDelete(params: NoticesCommentsEntity):Observable<JsonResultEntity<NoticesCommentsEntity>> {
        const result = this.FLHttp.post<NoticesCommentsEntity>(this.Constants.API_URL.NOTICES_COMMENTS.DELETE, params);
        return this.returnHttpResponseObservable<NoticesCommentsEntity>(result);
    }

}
