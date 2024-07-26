import { Subject } from "rxjs";
import { DivisionsEntity } from "./divisions.entity";

/**
 * hung.le
 * custom select loading data
 */
export class SelectLoadingEntity<T> {
    loading: boolean = false;
    typeHead$: Subject<string> = new Subject<string>();
    page: number = 0;
    list: T[] = [];

    //
    divisionE?: DivisionsEntity;
}
