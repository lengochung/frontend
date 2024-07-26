import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class AnalysisEntity extends BaseEntity {
    id?: number;
    management_group?: string;
    is_management_group_edit?: boolean;
    facilities_processes?: string;
    is_facilities_processes_edit?: boolean;
    analysis_items?: string;
    is_analysis_items_edit?: boolean;
    monthly_report_target?: boolean;
    status?: string;
    unit?: string;
    usl?: string;
    lsl?: string;
    ucl?: string;
    lcl?: string;
    sigma_management?: string;
    m_plus_sigma?: string;
    m_minus_sigma?: string;
    sigma_calculation_period?: string;
    review_cycle?: string;
    cp?: string;
    cpk?: string;
    trend_graph?: string;
    analysis_frequency?: string;
}

export class AnalysisSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class AnalysisFilterEntity extends BaseEntity {
    records?: AnalysisEntity[];
    filter_table?: FilterTableEntity;
}

export class AnalysisStatisticEntity extends BaseEntity {
    date?: string;
    count?: number;
}
