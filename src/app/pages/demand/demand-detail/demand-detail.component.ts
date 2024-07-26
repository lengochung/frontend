import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { DemandService, SubjectService } from '../../../core/services';
import { DemandEntity, NoticesEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { DemandManagerValidator } from '../validator/demand-manager.validator';

@Component({
    templateUrl: './demand-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
    ],
})
export class DemandDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public validator: DemandManagerValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public demandInfo?: DemandEntity;
    private readonly _rowNumber = 6;
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

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.power_demand_management') as string,
            link: this.Constants.APP_URL.DEMAND.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.power_demand_management') as string,
            link: this.Constants.APP_URL.DEMAND.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _demandService: DemandService,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
    ) {
        super();
        this.validator = new DemandManagerValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const demandId = Number(id);
                this.isEdit = true;
                this._getDemandDetail(demandId);
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
     * get notice detail
     * @author DuyPham
     *
     * @param {number} id notice id
     * @returns {void}
     */
    private _getDemandDetail(id: number): void {
        const params = {id: id};
        const sub = this._demandService.getDemandDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.demandInfo = rsp.data;
                this.Lib.assignDataFormControl(this.form.controls, this.demandInfo);

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
        const params = Object.assign({}, this.form.value) as NoticesEntity;
        const sub = this._demandService.onSave(params).subscribe({
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
        void this._router.navigate([this.Constants.APP_URL.DEMAND.MODULE]);
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
            void this._router.navigate([`${this.Constants.APP_URL.DEMAND.MODULE}/${this.Constants.APP_URL.DEMAND.CREATE}`]);
        } else {
            // this.form.reset();
            //reset file
        }
    }

}
