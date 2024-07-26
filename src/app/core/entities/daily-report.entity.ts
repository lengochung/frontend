import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
import { TopicsEntity } from './topics.entity';
export class DailyReportEntity extends BaseEntity {
    id?: number;
    target_datetime?: string;
    office_id?: number;
    status?: number;
    close_datetime?: string;
    office_name?: string;

    description?: string;
    holiday_workers?: string;
    leave_taker?: string;
    notice?: string;

    create_user?: string;
    transfer_user?: string;
    transfer_date?: string;
    approval_user1?: string;
    approval_datetime1?: string;
    approval_comment1?: string;
    approval_user2?: string;
    approval_datetime2?: string;
    approval_comment2?: string;
    topic_list?: TopicsEntity[];
}

export class DailyReportSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class DailyReportFilterEntity extends BaseEntity {
    records?: DailyReportEntity[];
    filter_table?: FilterTableEntity;
}
