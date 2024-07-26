import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, StandardDocumentEntity, StandardDocumentFilterEntity, StandardDocumentSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class StandardDocumentService extends BaseService {

    /**
     * Get standard document list
     *
     * @param {StandardDocumentSearchEntity} params StandardDocumentSearchEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<StandardDocumentFilterEntity>
     */
    public getAllList(params: StandardDocumentSearchEntity): Observable<JsonResultEntity<StandardDocumentFilterEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<StandardDocumentFilterEntity>(`${environment.api_url_mockup}standard-document/standard_document_list.json`, params, opts);
        return this.returnHttpResponseObservable<StandardDocumentFilterEntity>(result);
    }

    /**
     * Get standard document detail
     * @author DuyPham
     *
     * @param {{id: number}} params standard-document id
     * @returns {object} StandardDocumentEntity
     */
    public getStandardDocumentDetail(params: {id: number}): Observable<JsonResultEntity<StandardDocumentEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<StandardDocumentEntity>(`${environment.api_url_mockup}standard-document/standard_document_detail.json`, params, opts);
        return this.returnHttpResponseObservable<StandardDocumentEntity>(result);
    }

    /**
     * save standard document info
     *
     * @param {StandardDocumentEntity} params StandardDocumentEntity
     * @returns {JsonResultEntity} @var JsonResultEntity<StandardDocumentEntity>
     */
    public onSave(params: StandardDocumentEntity): Observable<JsonResultEntity<StandardDocumentEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.FLHttp.get<StandardDocumentEntity>(`${environment.api_url_mockup}standard-document/standard_document_detail.json`, params, opts);
        return this.returnHttpResponseObservable<StandardDocumentEntity>(result);
    }

}
