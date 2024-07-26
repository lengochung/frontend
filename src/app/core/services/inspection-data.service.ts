import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, InspectionDataEntity, InspectionDataFilterEntity, InspectionDataSearchEntity, InspectionDataStatisticEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class InspectionDataService extends BaseService {

    /**
     * Get inspection data list
     *
     * @param {InspectionDataSearchEntity} params InspectionDataSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<InspectionDataFilterEntity>
     */
    public getInspectionDataList(params: InspectionDataSearchEntity): Observable<JsonResultEntity<InspectionDataFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<InspectionDataFilterEntity>(`${environment.api_url_mockup}inspection-data/inspection_data_list.json`, params, opts);
        return this.returnHttpResponseObservable<InspectionDataFilterEntity>(result);
    }

    /**
     * Get inspection data detail
     * @author DuyPham
     *
     * @param {{id: number}} params inspection data id
     * @returns {object} InspectionDataEntity
     */
    public getInspectionDataDetail(params: {id: number}): Observable<JsonResultEntity<InspectionDataEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<InspectionDataEntity>(`${environment.api_url_mockup}inspection-data/inspection_data_detail.json`, params, opts);
        return this.returnHttpResponseObservable<InspectionDataEntity>(result);
    }

    /**
     * save inspection data
     *
     * @param {InspectionDataEntity} params InspectionDataEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<InspectionDataEntity>
     */
    public onSave(params: InspectionDataEntity): Observable<JsonResultEntity<InspectionDataEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<InspectionDataEntity>(`${environment.api_url_mockup}inspection-data/inspection_data_detail.json`, params, opts);
        return this.returnHttpResponseObservable<InspectionDataEntity>(result);
    }

    /**
     * get inspection data statistic from - to date
     * @author DuyPham
     *
     * @param {string} fromDate from date
     * @param {string} toDate to date
     * @param {number} dateType dateType
     * @returns {InspectionDataStatisticEntity[]} InspectionDataStatisticEntity [{
     *  date: string,
     *  count: number
     * }]
     */
    public getInspectionDataStatistic(fromDate: string, toDate: string, dateType: number): Observable<JsonResultEntity<InspectionDataStatisticEntity[]>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {
            from_date: fromDate,
            to_date: toDate,
            dateType: dateType
        };
        const result = this.FLHttp.get<InspectionDataStatisticEntity[]>(`${environment.api_url_mockup}inspection-data/inspection_data_statistic.json`, params, opts);
        return this.returnHttpResponseObservable<InspectionDataStatisticEntity[]>(result);
    }

}
