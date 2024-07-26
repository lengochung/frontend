import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, UserUnionGroupEntity, UserUnionGroupSearchEntity } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserUnionGroupService extends BaseService {
    /**
    * get user union group list for select
    *
    * @param {UserUnionGroupSearchEntity} params UserUnionGroupSearchEntity
    * @returns {JsonResultEntity} @var JsonResultEntity<UserUnionGroupEntity[]>
    */
    public getUserUnionListSelect(params: UserUnionGroupSearchEntity): Observable<JsonResultEntity<UserUnionGroupEntity[]>> {
        const opts = new this.HTTPOptions();
              opts.showLoading = false;
        const result = this.FLHttp.post<UserUnionGroupEntity[]>(this.Constants.API_URL.USERS.USER_UNION_GROUP, params, opts);
        return this.returnHttpResponseObservable<UserUnionGroupEntity[]>(result);
    }

}
