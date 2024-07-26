import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
import { UploadFile } from './upload.file.entity';
export class NoticesCommentsEntity extends BaseEntity {
    notice_no?: number;
    index?: number;
    post_user_id?: number;
    post_datetime?: string;
    post_message?: string;
    attached_file?: string;
    good?: number;
    like?: number;
    smile?: number;
    surprise?: number;

    /**
     * Extra field
     */
    post_user_fullname?: string
    files?: UploadFile[];

}

export class NoticesCommentsSearchEntity extends BaseEntity {
    notice_no?: number;
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };

    /**
     * pagination
     */
    total_row?: number;
}

export class NoticesCommentsFilterEntity extends BaseEntity {
    data_source?: NoticesCommentsEntity[];
    filter_table?: FilterTableEntity;
}
