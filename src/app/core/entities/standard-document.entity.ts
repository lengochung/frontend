import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class StandardDocumentEntity extends BaseEntity {
    id?: number;
    office_id?: number;
    office_name?: string;
    status?: number;
    standard_document_number?: string;
    standard_document_name?: string;
    version_number?: number;
    standard_classification?: string;
    target_business_establishment?: number;
    driven_type?: number;
    last_update_date?: string;

    new_summary?: string;
    new_standard_forward_user?: string;
    new_standard_forward_date?: string;
    new_standard_approval_user1?: string;
    new_standard_approval_datetime1?: string;
    new_standard_approval_comment1?: string;
    new_standard_approval_user2?: string;
    new_standard_approval_datetime2?: string;
    new_standard_approval_comment2?: string;
}

export class StandardDocumentSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class StandardDocumentFilterEntity extends BaseEntity {
    data_source?: StandardDocumentEntity[];
    filter_table?: FilterTableEntity;
}
