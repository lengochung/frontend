import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class GroupEntity extends BaseEntity {

    group_id?: number;
    office_id?: number;
    group_name?: string;
    description?: string;
    request_user_id?: number;
    request_user_name?: string;
    request_date?: string;
    approval1_user_id?: number;
    approval1_user_name?: string;
    approval1_date?: string;
    approval1_comment?: string;
    approval2_user_id?: number;
    approval2_user_name?: string;
    approval2_date?: string;
    approval2_comment?: string;
    group_add_date?: string;
    group_update_date?: string;
    member_count?: number;
    group_member_list?: MemberGroupEntity[];
    member_id_list?: number[];
    is_admin?: number;
    is_send_request?: number;
    is_approval?: number;
}

export class GroupSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class GroupFilterEntity extends BaseEntity {
    records?: GroupEntity[];
    filter_table?: FilterTableEntity;
}

export class MemberGroupEntity extends BaseEntity {
    user_id?: number;
    user_full_name?: string;
    user_first_name?: string;
    user_last_name?: string;
}
