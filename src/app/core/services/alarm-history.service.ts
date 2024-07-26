import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, AlarmHistoryFilterEntity, AlarmHistorySearchEntity, AlertEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AlarmHistoryService extends BaseService {

    /**
     * Get alarm history list
     *
     * @param {AlarmHistorySearchEntity} params AlarmHistorySearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<AlarmHistoryFilterEntity>
     */
    public getAlarmHistoryList(params: AlarmHistorySearchEntity): Observable<JsonResultEntity<AlarmHistoryFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<AlarmHistoryFilterEntity>(`${environment.api_url_mockup}alarm-history/alarm_history_list.json`, params, opts);
        return this.returnHttpResponseObservable<AlarmHistoryFilterEntity>(result);
    }

    /**
     * get alert statistic from - to date
     * @author DuyPham
     *
     * @param {string} fromDate from date
     * @param {string} toDate to date
     * @param {number} dateType dateType
     * @returns {AlertEntity[]} AlertEntity [{
     *  date: string,
     *  count: number
     * }]
     */
    public getAlertStatistic(fromDate: string, toDate: string, dateType: number): Observable<JsonResultEntity<AlertEntity[]>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {
            from_date: fromDate,
            to_date: toDate,
            dateType: dateType
        };
        const result = this.FLHttp.get<AlertEntity[]>(`${environment.api_url_mockup}alert/alert-statistic.json`, params, opts);
        return this.returnHttpResponseObservable<AlertEntity[]>(result);
    }
}
