import BaseEntity from './base.entity';
export class RoleEntity extends BaseEntity {
    role_id?: number;
    office_id?: number;
    role_name?: string;
    read_role?: number;
    notice_role?: number;
    update_role?: number;
    approval_role?: number;
    manager_role?: number;
    leader_role?: number;
    admin_role?: number;

    invalid?: boolean;
}
