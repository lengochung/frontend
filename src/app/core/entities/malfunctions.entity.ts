import BaseEntity from './base.entity';
import { FilterEntity } from './filter-table.entity';

export class MalfunctionsEntity extends BaseEntity {
    malfunction_no?: number;
    edition_no?: number;
    office_id?: number;
    status?: number;
    notice_no?: number;
    subject?: string;
    incident_datetime?: string;
    building_id?: number;
    fuel_type?: number;
    facility_id?: number;
    facility_detail1?: string;
    failicty_detail2?: string;
    severity_level?: number;
    find_user?: string;
    detail?: string;
    impact?: string;
    attached_file?: string;
    close_date?: number;

}

export class MalfunctionsSearchEntity extends FilterEntity {
    keyword?: string;
}
