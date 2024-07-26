import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class AlarmHistoryEntity extends BaseEntity {
    id?: number;
    occurrence_datetime?: string;
    alarm_name?: string;
    driving_type?: number;
    facility_name?: string;
    buiding_place?: string;
    alarm_rank?: string;
}

export class AlarmHistorySearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class AlarmHistoryFilterEntity extends BaseEntity {
    records?: AlarmHistoryEntity[];
    filter_table?: FilterTableEntity;
}
