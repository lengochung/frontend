import BaseEntity from './base.entity';
import { FilterEntity } from './filter-table.entity';

export class TopicsEntity extends BaseEntity {
    topic_no?: number;
    topic_kbn?: number;

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
    previous_user_id?: number;
    today_user_id?: number;
    detail?: string;
    attached_file?: string;
    is_deadline?: boolean;
    deadline?: string;
    completion_date?: string;
    target_id?: number;
    status?: string;

    user_id?: number;
    recipient_user_id?: number;
    recipient_group_id?: number;

    /**
     * Duy fields
     */
    topic_type?: number;

}

export class TopicsSearchEntity extends FilterEntity {
    keyword?: string;
}
