import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class TrendEntity extends BaseEntity {
    id?: number;
    management_group?: string;
    is_management_group_edit?: boolean;
    point_name?: string;
    is_point_name_edit?: boolean;
    point_id?: string;
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
    confirmation_frequency?: string;
}

export class TrendSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class TrendFilterEntity extends BaseEntity {
    records?: TrendEntity[];
    filter_table?: FilterTableEntity;
}

