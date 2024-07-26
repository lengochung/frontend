import BaseEntity from './base.entity';
export class UserManagementEntity extends BaseEntity {
    user_id?: number;
    affiliation?: string;
    employee_no?: string;
    office_id?: number;
    office_name?: string;
    user_first_name?: string;
    user_last_name?: string;
    position?: string;
    mail?: string;
    password_update_date?: string;
    role_id?: number;
    role_name?: string;
    role_update_date?: string;
    password?: string;
    new_password?: string;
}


