import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class IncidentReportEntity extends BaseEntity {
    id?: number;
    subject?: string;
    latest_version?: string;
    failure_rank?: number;
    root_cause_type?: number;
    office_id?: number;
    office_name?: string;
    status?: number;
    occurrence_datetime?: string;
    deadline?: string;
    close_datetime?: string;

    target_building_type?: string;
    driving_type?: number;
    facility_name?: string;
    facility_detail1?: string;
    facility_detail2?: string;
    discoverer?: string;
    description?: string;
    impact?: string;
    implementation_datetime?: string;
    report_detail?: string;
    treatment_detail?: string;
    possible_causes?: string;

    permanent_fix_proposal?: string;
    judgment_necessity?: number;
    forward_proposer_user?: string;
    forward_proposer_date?: string;
    proposer_approval_user1?: string;
    proposer_approval_datetime1?: string;
    proposer_approval_comment1?: string;
    proposer_approval_user2?: string;
    proposer_approval_datetime2?: string;
    proposer_approval_comment2?: string;

    plan_summary?: string;
    plan_provider?: string;
    plan_implementation_date?: string;
    forward_plan_user?: string;
    forward_plan_date?: string;
    plan_approval_user1?: string;
    plan_approval_datetime1?: string;
    plan_approval_comment1?: string;
    plan_approval_user2?: string;
    plan_approval_datetime2?: string;
    plan_approval_comment2?: string;

    result_summary?: string;
    efficacy_assessment?: number;
    forward_reporter_user?: string;
    forward_reporter_date?: string;
    reporter_approval_user1?: string;
    reporter_approval_datetime1?: string;
    reporter_approval_comment1?: string;
    reporter_approval_user2?: string;
    reporter_approval_datetime2?: string;
    reporter_approval_comment2?: string;

}

export class IncidentReportSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class IncidentReportFilterEntity extends BaseEntity {
    records?: IncidentReportEntity[];
    filter_table?: FilterTableEntity;
}
