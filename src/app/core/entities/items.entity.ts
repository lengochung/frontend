import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';

/**
 * hung.le
 * 01/07/2024
 * Entity table items
 */
export class ItemsEntity extends BaseEntity {
    item_no?: number;
    page_no?: number;
    item_name?: string;
}

export class ItemsSearchEntity extends BaseEntity {
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class ItemsFilterEntity extends BaseEntity {
    data_source?: ItemsEntity[];
    filter_table?: FilterTableEntity;
}
