import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { PowerEntity, JsonResultEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PowerService extends BaseService {

    /**
     * get power statistic from - to date
     * @author DuyPham
     *
     * @param {string} fromDate from date
     * @param {string} toDate to date
     * @returns {PowerEntity} PowerEntity {
     *  current?: number;
     *  month?: number;
     *  tomorrow?: number;
     * }
     */
    public getPowerStatistic(fromDate: string, toDate: string): Observable<JsonResultEntity<PowerEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {
            from_date: fromDate,
            to_date: toDate
        };
        const result = this.FLHttp.get<PowerEntity>(`${environment.api_url_mockup}power/power-statistic.json`, params, opts);
        return this.returnHttpResponseObservable<PowerEntity>(result);
    }

}
