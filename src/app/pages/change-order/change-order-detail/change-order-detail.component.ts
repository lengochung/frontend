import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { ChangeOrderService, SubjectService } from '../../../core/services';
import { ToastrService } from 'ngx-toastr';
import { ChangeOrderValidator } from '../validator/change-order.validator';
import { ChangeOrderEntity } from '../../../core/entities';

@Component({
    templateUrl: './change-order-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE
    ],
})
export class ChangeOrderDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public validator: ChangeOrderValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public changeOrderInfo?: ChangeOrderEntity;
    public isEdit = false;

    public statusList = [
        {
            id: 1,
            name: "ステータス1",
        },
        {
            id: 2,
            name: "ステータス2",
        },
    ];
    public endList = [
        {
            id: 1,
            name: "可",
        },
        {
            id: 0,
            name: "否",
        }
    ];
    public permanentList = [
        {
            id: 1,
            name: "要",
        },
        {
            id: 0,
            name: "否",
        }
    ];

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.change_order_document') as string,
            link: this.Constants.APP_URL.CHANGE_ORDER.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.change_order_document') as string,
            link: this.Constants.APP_URL.CHANGE_ORDER.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _changeOrderService: ChangeOrderService,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
    ) {
        super();
        this.validator = new ChangeOrderValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const changeOrderId = Number(id);
                this.isEdit = true;
                this._getChangeOrderDetail(changeOrderId);
            }
        });
        this._subscriptionList.push(sub);
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * get change order detail
     * @author DuyPham
     *
     * @param {number} id change order id
     * @returns {void}
     */
    private _getChangeOrderDetail(id: number): void {
        const params = {id: id};
        const sub = this._changeOrderService.getChangeOrderDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.changeOrderInfo = rsp.data;
                this.Lib.assignDataFormControl(this.form.controls, this.changeOrderInfo);
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * Submit form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onSave(): void {
        this.validator.makeValidator(this.form, this.validator.createErrorMessages());

        if (this.form.invalid) return;
        const params = Object.assign({}, this.form.value) as ChangeOrderEntity;
        const sub = this._changeOrderService.onSave(params).subscribe({
            next: (rsp) => {
                if (!rsp.status) {
                    const errorList = this.getApiErrorMessages(rsp.msg);
                    this.validator.errors = errorList;
                    return;
                }
                this._toastrService.success(this.translate.instant('message.update_success', {field: ''}) as string);
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.CHANGE_ORDER.MODULE]);
    }

    /**
     * get display status
     * @author DuyPham
     *
     * @param {number} id id
     * @returns {string} display name
     */
    public getStatusName(id?: number): string {
        return this.statusList?.find(p => p.id === id)?.name ?? '';
    }

    /**
     * Reset form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onCreateNew(): void {
        if (this.isEdit) {
            void this._router.navigate([`${this.Constants.APP_URL.CHANGE_ORDER.MODULE}/${this.Constants.APP_URL.CHANGE_ORDER.CREATE}`]);
        } else {
            this.form.reset();
            //reset file
        }
    }


}
