import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';

/**
 * hung.le
 * 01/07/2024
 * Entity table pages
 */
export class PagesEntity extends BaseEntity {
    page_no?: number;
    function_no?: number;
    page_name?: string;
    slug_name?: string;
}

export class PagesSearchEntity extends BaseEntity {
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class PagesFilterEntity extends BaseEntity {
    data_source?: PagesEntity[];
    filter_table?: FilterTableEntity;
}
