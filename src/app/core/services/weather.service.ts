import { Injectable, inject } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity } from "../entities";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class WeatherService extends BaseService {
    private _http = inject(HttpClient);
   /**
    * Get weather
    * 
    * @returns {returnJsonResult} returnJsonResult<any>
     */
    public getWeather(): Observable<JsonResultEntity<any>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        opts.isHeader = false;
        const apiUrl = `${environment.weather.api_path}`
        const result = this.FLHttp.get<any>(apiUrl, {}, opts);
        return result.pipe(
            map((response: JsonResultEntity<any>) => {
                if (!response) {
                    return this.Lib.returnJsonResult<any>(false);
                }
                return this.Lib.returnJsonResult<any>(true, '', response);
            }),
            catchError((error: HttpErrorResponse) => {
                if (!error) {
                    return throwError(() => this.Lib.returnJsonResult(false));
                }
                return throwError(() => this.Lib.returnJsonResult<any>(false, error.message));
            })
        );
    }
}