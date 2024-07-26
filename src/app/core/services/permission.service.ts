import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { RoleEntity, JsonResultEntity } from "../entities";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PermissionService extends BaseService {

    public userPermissionSubject = new BehaviorSubject<RoleEntity | null>(null);
    public userPermission: RoleEntity | null = null;
    /** constructor */
    constructor() {
        super();

        this._getRoleCurrentUser().subscribe({
            next: (rsp) =>{
                if (!rsp.status || !rsp.data) {
                    this.userPermissionSubject.next(null);
                }
                this.userPermission = rsp.data;
                this.userPermissionSubject.next(rsp.data);
            },
            error: () => {
                this.userPermissionSubject.next(null);
            }
        });
    }

    /**
     * get role current user
     * @author DuyPham
     *
     * @returns {RoleEntity} @var JsonResultEntity<RoleEntity>
     */
    private _getRoleCurrentUser(): Observable<JsonResultEntity<RoleEntity>> {
        const result = this.FLHttp.post<RoleEntity>(this.Constants.API_URL.ROLES.USER);
        return this.returnHttpResponseObservable<RoleEntity>(result);
    }

}
