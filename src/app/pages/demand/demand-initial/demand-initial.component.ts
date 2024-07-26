import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { DemandService, SubjectService } from '../../../core/services';
import { DemandEntity, NoticesEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { DemandInitialValidator } from '../validator/demand-initial.validator';
import { FormArray } from '@angular/forms';

@Component({
    templateUrl: './demand-initial.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        UploadComponent
    ],
})
export class DemandInitialComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    public validator: DemandInitialValidator;
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
        this.validator = new DemandInitialValidator();
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
                this.demandInfo.base_list?.forEach(param => {
                    const baseForm = this.validator.createMeasureRules(param);
                    this.baseFormArray.push(baseForm);
                });
                this.demandInfo.demand_response_list?.forEach(param => {
                    const baseForm = this.validator.createMeasureRules(param);
                    this.demandResponseFormArray.push(baseForm);
                });
                this.demandInfo.emergency_response_list?.forEach(param => {
                    const baseForm = this.validator.createMeasureRules(param);
                    this.emergencyResponseListFormArray.push(baseForm);
                });
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

    /**
     * Get base formArray
     * @author DuyPham
     *
     * @readonly
     * @type {FormArray}
     */
    get baseFormArray(): FormArray {
        return this.form.controls['base_list'] as FormArray;
    }
    /**
     * Get demand response formArray
     * @author DuyPham
     *
     * @readonly
     * @type {FormArray}
     */
    get demandResponseFormArray(): FormArray {
        return this.form.controls['demand_response_list'] as FormArray;
    }
    /**
     * Get emergency response formArray
     * @author DuyPham
     *
     * @readonly
     * @type {FormArray}
     */
    get emergencyResponseListFormArray(): FormArray {
        return this.form.controls['emergency_response_list'] as FormArray;
    }

    /**
     * create base measure
     * @author DuyPham
     *
     * @returns {void}
     */
    public createBase(): void {
        this.baseFormArray.push(this.validator.createMeasureRules());
    }
    /**
     * create demand response
     * @author DuyPham
     *
     * @returns {void}
     */
    public createDemandResponse(): void {
        this.demandResponseFormArray.push(this.validator.createMeasureRules());
    }
    /**
     * create emergency response
     * @author DuyPham
     *
     * @returns {void}
     */
    public createEmergencyResponse(): void {
        this.emergencyResponseListFormArray.push(this.validator.createMeasureRules());
    }

    /**
     * delete base measure
     * @author DuyPham
     * @param {number} index index
     * @returns {void}
     */
    public deleteBase(index: number): void {
        this.baseFormArray.removeAt(index);
    }
    /**
     * delete demand response
     * @author DuyPham
     * @param {number} index index
     * @returns {void}
     */
    public deleteDemandResponse(index: number): void {
        this.demandResponseFormArray.removeAt(index);
    }
    /**
     * delete emergency response
     * @author DuyPham
     * @param {number} index index
     * @returns {void}
     */
    public deleteEmergencyResponse(index: number): void {
        this.emergencyResponseListFormArray.removeAt(index);
    }

    /**
     * get rowspan demand management
     * @author DuyPham
     *
     * @readonly
     * @type {number}
     */
    get rowspanManager(): number {
        return this.baseFormArray.length + this.demandResponseFormArray.length + this.emergencyResponseListFormArray.length + this._rowNumber;
    }

    /**
     * get total base measure
     * @author DuyPham
     *
     * @returns {number} total
     */
    public getTotalBase(): number {
        let total = 0;
        this.baseFormArray.value.forEach((x: { reduced_power: string | number; }) => {
            total += +x.reduced_power;
        });
        return total;
    }
    /**
     * get total demand response
     * @author DuyPham
     *
     * @returns {number} total
     */
    public getTotalDemandResponse(): number {
        let total = 0;
        this.demandResponseFormArray.value.forEach((x: { reduced_power: string | number; }) => {
            total += +x.reduced_power;
        });
        return total;
    }
    /**
     * get total emergency response
     * @author DuyPham
     *
     * @returns {number} total
     */
    public getTotalEmergencyResponse(): number {
        let total = 0;
        this.emergencyResponseListFormArray.value.forEach((x: { reduced_power: string | number; }) => {
            total += +x.reduced_power;
        });
        return total;
    }


}
