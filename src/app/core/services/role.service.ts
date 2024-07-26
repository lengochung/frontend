import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { RoleEntity, JsonResultEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RoleService extends BaseService {

    /**
     * Get role list management
     * @author DuyPham
     *
     * @param {object} params {
     *   office_id: number
     * }
     * @returns {JsonResultEntity} @var JsonResultEntity<RoleEntity[]>
     */
    public getRoleList(params: {
        office_id?: number;
        group_office_id?: number;
    }): Observable<JsonResultEntity<RoleEntity[]>> {
        const result = this.FLHttp.post<RoleEntity[]>(this.Constants.API_URL.ROLES.LIST, params);
        return this.returnHttpResponseObservable<RoleEntity[]>(result);
    }

    /**
     * Delete role
     * @author DuyPham
     *
     * @param {object} params {
     *  role_id: number;
     *  upd_datetime: string;
     * }
     * @returns {RoleEntity} @var JsonResultEntity<RoleEntity>
     */
    public onDelete(params: { role_id?: number; upd_datetime?: string;}): Observable<JsonResultEntity<RoleEntity>> {
        const result = this.FLHttp.post<RoleEntity>(this.Constants.API_URL.ROLES.DELETE, params);
        return this.returnHttpResponseObservable<RoleEntity>(result);
    }

    /**
     * Update role
     * @author DuyPham
     *
     * @param {RoleEntity} roleUpdate role data
     * @returns {RoleEntity} @var JsonResultEntity<RoleEntity>
     */
    public onSave(roleUpdate: RoleEntity): Observable<JsonResultEntity<RoleEntity>> {
        const result = this.FLHttp.post<RoleEntity>(this.Constants.API_URL.ROLES.SAVE, roleUpdate);
        return this.returnHttpResponseObservable<RoleEntity>(result);
    }

    /**
     * get role current user
     * @author DuyPham
     *
     * @returns {RoleEntity} @var JsonResultEntity<RoleEntity>
     */
    public getRoleCurrentUser(): Observable<JsonResultEntity<RoleEntity>> {
        const result = this.FLHttp.post<RoleEntity>(this.Constants.API_URL.ROLES.USER);
        return this.returnHttpResponseObservable<RoleEntity>(result);
    }

}
