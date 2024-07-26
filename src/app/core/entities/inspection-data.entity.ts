import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class InspectionDataEntity extends BaseEntity {
    id?: number;
    management_group?: string;
    is_management_group_edit?: boolean;
    facilities_processes?: string;
    is_facilities_processes_edit?: boolean;
    inspection_items?: string;
    is_inspection_items_edit?: boolean;
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
    inspection_frequency?: string;
}

export class InspectionDataSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class InspectionDataFilterEntity extends BaseEntity {
    records?: InspectionDataEntity[];
    filter_table?: FilterTableEntity;
}

export class InspectionDataStatisticEntity extends BaseEntity {
    date?: string;
    count?: number;
}
