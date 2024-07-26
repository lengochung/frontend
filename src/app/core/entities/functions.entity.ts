import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';

/**
 * hung.le
 * 01/07/2024
 * Entity table functions
 */
export class FunctionsEntity extends BaseEntity {
    function_no?: number;
    function_name?: string;
}

export class FunctionsSearchEntity extends BaseEntity {
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class FunctionsFilterEntity extends BaseEntity {
    data_source?: FunctionsEntity[];
    filter_table?: FilterTableEntity;
}
