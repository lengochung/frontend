import BaseEntity from './base.entity';
export class OfficeEntity extends BaseEntity {
    office_id?: number;
    office_name?: string;
    office_subname?: string;
    group_office_id?: number;
    zip?: string;
    address?: string;
    tel?: string;
    fax?: string;
    expiry_date?: string;
}
