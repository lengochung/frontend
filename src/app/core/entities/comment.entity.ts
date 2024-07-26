import BaseEntity from './base.entity';
export class CommentEntity extends BaseEntity {
    id?: number;
    full_name?: string;
    content?: string;

    is_edit?: boolean;
    is_author?: boolean;
}
