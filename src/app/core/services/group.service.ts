import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, GroupEntity, GroupFilterEntity, GroupSearchEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class GroupService extends BaseService {

    /**
     * Get group list
     *
     * @param {GroupSearchEntity} params GroupSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<GroupFilterEntity>
     */
    public getGroupList(params: GroupSearchEntity): Observable<JsonResultEntity<GroupFilterEntity>> {
        const result = this.FLHttp.post<GroupFilterEntity>(this.Constants.API_URL.GROUPS.LIST, params);
        return this.returnHttpResponseObservable<GroupFilterEntity>(result);
    }

    /**
     * Get group detail
     * @author DuyPham
     *
     * @param {{id: number}} params group id
     * @returns {object} GroupEntity
     */
    public getGroupDetail(params: {group_id: number}): Observable<JsonResultEntity<GroupEntity>> {
        const result = this.FLHttp.post<GroupEntity>(this.Constants.API_URL.GROUPS.GROUP_INFO, params);
        return this.returnHttpResponseObservable<GroupEntity>(result);
    }

    /**
     * save group
     *
     * @param {GroupEntity} params GroupEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<GroupEntity>
     */
    public onSave(params: GroupEntity): Observable<JsonResultEntity<GroupEntity>> {
        const result = this.FLHttp.post<GroupEntity>(this.Constants.API_URL.GROUPS.SAVE, params);
        return this.returnHttpResponseObservable<GroupEntity>(result);
    }

    /**
     * Delete group
     *
     * @param {object} params {
     *  group_id: number;
     *  upd_datetime: string
     * }
     * @returns {JsonResultEntity} @var JsonResultEntity<GroupEntity>
     */
    public onDelete(params: {group_id?: number; upd_datetime?: string}):Observable<JsonResultEntity<GroupEntity>> {
        const result = this.FLHttp.post<GroupEntity>(this.Constants.API_URL.GROUPS.DELETE, params);
        return this.returnHttpResponseObservable<GroupEntity>(result);
    }

    /**
     * cancel change group
     *
     * @param {object} params {
     *  group_id: number;
     *  upd_datetime: string
     * }
     * @returns {JsonResultEntity} @var JsonResultEntity<GroupEntity>
     */
    public onCancel(params: {group_id?: number; upd_datetime?: string}): Observable<JsonResultEntity<GroupEntity>> {
        const result = this.FLHttp.post<GroupEntity>(this.Constants.API_URL.GROUPS.CANCEL, params);
        return this.returnHttpResponseObservable<GroupEntity>(result);
    }

    /**
     * send approval
     *
     * @param {object} params {
     *  group_id: number;
     *  upd_datetime: string
     * }
     * @returns {JsonResultEntity} @var JsonResultEntity<GroupEntity>
     */
    public onSendApproval(params: {group_id?: number; upd_datetime?: string}): Observable<JsonResultEntity<GroupEntity>> {
        const result = this.FLHttp.post<GroupEntity>(this.Constants.API_URL.GROUPS.SEND_APPROVAL, params);
        return this.returnHttpResponseObservable<GroupEntity>(result);
    }

    /**
     * approval
     *
     * @param {object} params {
     *  group_id: number;
     *  upd_datetime: string
     * }
     * @returns {JsonResultEntity} @var JsonResultEntity<GroupEntity>
     */
    public onApproval(params: {group_id?: number; upd_datetime?: string}): Observable<JsonResultEntity<GroupEntity>> {
        const result = this.FLHttp.post<GroupEntity>(this.Constants.API_URL.GROUPS.APPROVAL, params);
        return this.returnHttpResponseObservable<GroupEntity>(result);
    }

    /**
     * reject
     *
     * @param {object} params {
     *  group_id: number;
     *  upd_datetime: string
     * }
     * @returns {JsonResultEntity} @var JsonResultEntity<GroupEntity>
     */
    public onReject(params: {group_id?: number; upd_datetime?: string}): Observable<JsonResultEntity<GroupEntity>> {
        const result = this.FLHttp.post<GroupEntity>(this.Constants.API_URL.GROUPS.REJECT, params);
        return this.returnHttpResponseObservable<GroupEntity>(result);
    }

}
