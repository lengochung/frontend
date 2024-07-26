import BaseEntity from './base.entity';
import { FilterTableEntity, SortEntity } from './filter-table.entity';
export class DivisionsEntity extends BaseEntity {
    division_id?: number;
    function_id?: number;
    page_id?: number;
    item_id?: number;
    candidate?: string;

    /**
     * Extra field
     */
    division_name?: string;
    function_id_invalid?: boolean;
    page_id_invalid?: boolean;
    item_id_invalid?: boolean;
    candidate_invalid?: boolean;
    candidate_input_control?: boolean;

    is_edit?: boolean;
}

export class DivisionsSearchEntity extends BaseEntity {
    sort?: SortEntity;
    keyword?: string;
    filter?: {
        [key: string]: string[];
    };
    search?: {
        [key: string]: string;
    }
    /**
     *
     */
    function_id?: number;
    page_id?: number;
    item_id?: number;
}

export class DivisionsFilterEntity extends BaseEntity {
    data_source?: DivisionsEntity[];
    filter_table?: FilterTableEntity;
}
