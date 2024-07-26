import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';

export class ChangeOrderEntity extends BaseEntity {
    id?: number;
    office_id?: number;
    office_name?: string;
    status?: number;
    subject?: string;
    version_number?: number;
    application_period?: string;
    close_datetime?: string;
    latest_version?: number;
    change_item?: string;
    before_change?: string;
    content_change?: string;
    scope?: string;
    start_date_application?: string;
    end_date_application?: string;
    additional_explanation?: string;
    closing_comment?: string;
    is_end?: number;
    is_permanent?: number;
    transfer_user?: string;
    transfer_date?: string;
    approval_user1?: string;
    approval_datetime1?: string;
    approval_comment1?: string;
    approval_user2?: string;
    approval_datetime2?: string;
    approval_comment2?: string;
    complete_transfer_user?: string;
    complete_transfer_date?: string;
    complete_approval_user1?: string;
    complete_approval_datetime1?: string;
    complete_approval_comment1?: string;
    complete_approval_user2?: string;
    complete_approval_datetime2?: string;
    complete_approval_comment2?: string;
}

export class ChangeOrderSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class ChangeOrderFilterEntity extends BaseEntity {
    records?: ChangeOrderEntity[];
    filter_table?: FilterTableEntity;
}
