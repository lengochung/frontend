import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './modal-daily-report-confirm.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE
    ],
})
export class ModalDailyReportConfirmComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];

    public userConfirmList: {name: string; status: number}[] = [
        {
            name: "鈴木 ひかり",
            status: 1
        },
        {
            name: "山本 たくみ",
            status: 1
        },
        {
            name: "田中 さくら",
            status: 0
        },
        {
            name: "中村 ゆうと",
            status: 0
        },
        {
            name: "佐藤 あおい",
            status: 1
        }
    ];
    /** Constructor */
    constructor(
        public activeModal: NgbActiveModal,
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        return;
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

}
