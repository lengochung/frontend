import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CommentEntity, JsonResultEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CommentService extends BaseService {

    /**
     * Get comment in notice
     * @author DuyPham
     *
     * @param {number} noticeId noticeId
     * @param {number} page page
     * @returns {Observable<JsonResultEntity<CommentEntity[]>>} comment list
     */
    public getCommentList(noticeId: number, page?: number): Observable<JsonResultEntity<CommentEntity[]>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {
            notice_id: noticeId,
            page: page
        }
        const result = this.FLHttp.get<CommentEntity[]>(`${environment.api_url_mockup}notice/comment_list.json`, params, opts);
        return this.returnHttpResponseObservable<CommentEntity[]>(result);
    }

    /**
     * save comment
     *
     * @param {CommentEntity} params comment
     * @returns {JsonResultEntity} @var JsonResultEntity<CommentEntity>
    */
    public onSave(params: CommentEntity):Observable<JsonResultEntity<CommentEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        opts.showLoading = false;
        const result = this.FLHttp.get<CommentEntity>(`${environment.api_url_mockup}notice/notice_detail.json`, params, opts);
        return this.returnHttpResponseObservable<CommentEntity>(result);
    }

    /**
     * Delete comment
     *
     * @param {number} id comment id
     * @returns {JsonResultEntity} @var JsonResultEntity<CommentEntity>
    */
    public onDelete(id: number):Observable<JsonResultEntity<CommentEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {
            comment_id: id
        }
        const result = this.FLHttp.get<CommentEntity>(`${environment.api_url_mockup}notice/comment_list.json`, params, opts);
        return this.returnHttpResponseObservable<CommentEntity>(result);
    }

}
