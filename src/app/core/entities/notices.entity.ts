import BaseEntity from './base.entity';
import { FilterTableEntity, SortEntity } from './filter-table.entity';
export class NoticesEntity extends BaseEntity {
    notice_no?: number;
    office_id?: number;
    status_id?: number;
    subject?: string;
    event_date?: string;
    building_id?: number;
    fuel_type?: number;
    facility_id?: number;
    facility_detail1?: string;
    facility_detail2?: string;
    user_id?: number;
    detail?: string;
    attached_file?: string;
    recipient_user_id?: number;
    recipient_group_id?: number;
    broadcast_user_id?: number;
    broadcast_datetime?: string;
    daily_report_trans_user_id?: number;
    daily_report_trans_datetime?: string;
    close_user_id?: number;
    close_datetime?: string;
    candidate?: string;
    /**
     * Extra field
     */
    user_id_name?: string;
    broadcast_user_name?: string;
    send_type?: string;
    recipient_ids?: string[];
    recipient_user_ids?: number[];
    recipient_group_ids?: number[];


    manager_name?: string;
    to_user_ids?: number[];

    transfer_user?: string;
    transfer_date?: string;

    office_name?: string;
    office_subname?: string;
}

export class NoticesSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: string[];
    };
    search?: {
        [key: string]: string;
    }
}

export class NoticesFilterEntity extends BaseEntity {
    data_source?: NoticesEntity[];
    filter_table?: FilterTableEntity;
}
