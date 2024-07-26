import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class UserUnionGroupEntity extends BaseEntity {
    id?: number;
    name?: number;
    tag_name?: number;
    select_id?: number;
}

export class UserUnionGroupSearchEntity extends BaseEntity {
    sort?: SortEntity;
    keyword?: string;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
    notice_no?: number|null;
}

export class UserUnionGroupFilterEntity extends BaseEntity {
    data_source?: UserUnionGroupEntity[];
    filter_table?: FilterTableEntity;
}
