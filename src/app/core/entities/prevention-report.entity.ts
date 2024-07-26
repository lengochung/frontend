import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class PreventionReportEntity extends BaseEntity {
    id?: number;
    subject?: string;
    latest_version?: string;
    office_id?: number;
    office_name?: string;
    status?: number;
    occurrence_datetime?: string;
    deadline?: string;
    close_datetime?: string;

    source?: number;
    is_from_corrective?: number;
    target_business_type?: number;
    target_building_type?: string;
    driving_type?: number;
    facility_name?: string;
    facility_detail1?: string;
    facility_detail2?: string;
    event_type?: number;
    nonconformity_content?: string;
    corrective_action_detail?: string;
    corrective_action_result?: string;
    possible_causal_mechanisms?: string;
    prevention_measures_proposal?: string;
    judgment_necessity?: number;

    forward_proposer_user?: string;
    forward_proposer_date?: string;
    proposer_approval_user1?: string;
    proposer_approval_datetime1?: string;
    proposer_approval_comment1?: string;
    proposer_approval_user2?: string;
    proposer_approval_datetime2?: string;
    proposer_approval_comment2?: string;
}

export class PreventionReportSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class PreventionReportFilterEntity extends BaseEntity {
    records?: PreventionReportEntity[];
    filter_table?: FilterTableEntity;
}
