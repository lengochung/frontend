import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { CommentService, NoticesService, SubjectService } from '../../../core/services';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { UserService } from '../../../core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommentEntity, NoticesEntity } from '../../../core/entities';
import { FormControl, FormGroup } from '@angular/forms';
import Lib from '../../../utils/lib';
import { IInfiniteScrollEvent, InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
    templateUrl: './notice-mobile.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        TextFieldModule,
        InfiniteScrollModule,
        UploadComponent
    ],
})
export class NoticeMobileComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('messageBox') messageBox?: ElementRef;
    private _subscriptionList: Subscription[] = [];
    public messageList: CommentEntity[] = [];
    public noticeInfo?: NoticesEntity;
    public noticeId = 0;
    public messageForm!: FormGroup;

    /** Constructor */
    constructor(
        private _router: Router,
        private _noticeService: NoticesService,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _userService: UserService,
        private _commentService: CommentService,
        private _modalService: NgbModal
    ) {
        super();
        document.body.classList.add('hdn-body-sp');
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._messageFormRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                this.noticeId = Number(id);
                this._getNoticeDetail(this.noticeId);
                this._getMessageList();
            }
        });
        this._subscriptionList.push(sub);
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        document.body.classList.remove('hdn-body-sp');
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }
    /**
     * Initializes the message form with its corresponding form controls.
     *
     * @returns {void}
     */
    private _messageFormRules(): void {
        this.messageForm = new FormGroup({
            message: new FormControl<string | null>(null),
        });
    }

    /**
     * get notice detail
     * @author DuyPham
     *
     * @param {number} notice_no notice_no
     * @returns {void}
     */
    private _getNoticeDetail(notice_no: number): void {
        const params = { notice_no };
        const sub = this._noticeService.getNoticeDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.noticeInfo = rsp.data;
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * get message
     * @author DuyPham
     *
     * @param {boolean} isLoadMore is load more
     * @returns {void}
     */
    private _getMessageList(isLoadMore = false): void {
        this.isSearching = true
        const sub = this._commentService.getCommentList(this.noticeId, this.currentPage).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this.isSearching = false;
                    return;
                }
                if (isLoadMore) {
                    this.messageList.unshift(...rsp.data);
                } else {
                    this.messageList = rsp.data;
                    this._scrollBottom()
                }
                this.isSearching = false;
            },
            error: () => {
                this.isSearching = false;
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * load more message
     * @author DuyPham
     *
     * @param {IInfiniteScrollEvent} event IInfiniteScrollEvent
     * @returns {void}
     */
    public onLoadMoreMessage(event: IInfiniteScrollEvent): void {
        if (event.currentScrollPosition < 1) {
            (this.messageBox?.nativeElement as HTMLElement).scrollTop = 1;
        }

        if (this.isSearching) { return; }
        this.currentPage++;
        this._getMessageList(true)
    }

    /**
     * Send message
     * @author DuyPham
     *
     * @returns {void}
     */
    public onSend(): void {
        const messageContent = this.messageForm.get('message')?.value;
        if (Lib.isBlank(messageContent)) return;
        const message: CommentEntity = {
            is_author: true,
            content: messageContent,
            add_datetime: Lib.toDay("YYYY/MM/DD hh:mm:ss")
        };
        this.messageForm.reset();
        this.messageList.push(message);
        this._scrollBottom();
        const sub = this._commentService.onSave(message).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * scroll bottom chat
     * @author DuyPham
     *
     * @returns {void}
     */
    private _scrollBottom(): void {
        setTimeout(() => {
            (this.messageBox?.nativeElement as HTMLElement).scrollTop = this.messageBox?.nativeElement.scrollHeight;
        }, 50);
    }

}
