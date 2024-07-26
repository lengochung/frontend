import BaseEntity from "./base.entity";

export class UserRoleEntity extends BaseEntity {
    office_id?: number;
    role_id?: number;
    user_id?: number;
    office_subname?: string;
    role_name?: string;
}
