import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { CorrectivesService, DivisionsService, ItemsService } from '../../../core/services';
import { CorrectivesEntity, DivisionsEntity, ItemsEntity, MalfunctionsEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { CorrectiveReportValidator } from '../validator/corrective-report.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutocompleteComponent } from '../../../core/components/autocomplete/autocomplete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMalfunctionSelectComponent } from '../../../core/components/modal/modal-malfunction-select.component';

@Component({
    templateUrl: './corrective-report-detail.component.html',
    standalone: true,
    imports: [SHARED_MODULE, UploadComponent, AutocompleteComponent],
})
export class CorrectiveReportDetailComponent extends BaseComponent implements OnInit {
    public isEdit = false;
    public correctiveInfo?: CorrectivesEntity = {};
    public validator: CorrectiveReportValidator;
    public form!: ReturnType<typeof this.validator.createRules>;

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.corrective_action') as string,
            link: this.Constants.APP_URL.CORRECTIVE_REPORT.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.corrective_action') as string,
            link: this.Constants.APP_URL.CORRECTIVE_REPORT.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    public buildingParams = {
        type: 88
    };
    public fuelParams = {
        function_name: '共通',
        page_name: '原動種類',
        page: 0
    };
    public facilityParams = {
        type: 0
    };
    public eventParams = {
        type: 2
    };
    public isCorrectionParams = {
        type: 4
    }
    public isFromIncidentParams = {
        type: 3
    }
    public incidentDivisionId = 0;

    public buildingList: DivisionsEntity[] = [];
    public fuelList: ItemsEntity[] = [];
    public facilityList: DivisionsEntity[] = [];
    public eventList: DivisionsEntity[] = [];
    public correctionList: DivisionsEntity[] = [];
    public fromIncidentList: DivisionsEntity[] = [];


    /** Constructor */
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _correctivesService: CorrectivesService,
        private _divisionsService: DivisionsService,
        private _itemsService: ItemsService,
        private _modalService: NgbModal
    ) {
        super();
        this.validator = new CorrectiveReportValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        this._route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const correctiveReportId = Number(id);
                this.isEdit = true;
                this._getCorrectiveReportDetail(correctiveReportId);
            }
        });
        this.getBuildingList();
        this.getFuelList();
        this.getEventList();
        this.getIsCorrectionList();
        this.getFromIncidentList();
    }

    /**
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.CORRECTIVE_REPORT.MODULE]);
    }

    /**
     * Reset form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onCreateNew(): void {
        if (this.isEdit) {
            void this._router.navigate([`${this.Constants.APP_URL.CORRECTIVE_REPORT.MODULE}/${this.Constants.APP_URL.CORRECTIVE_REPORT.CREATE}`]);
        } else {
            this.form.reset();
            //reset file
        }
    }

    /**
     * get corrective report detail
     * @author DuyPham
     *
     * @param {number} id corrective report id
     * @returns {void}
     */
    private _getCorrectiveReportDetail(id: number): void {
        const params = { corrective_no: id };
        this._correctivesService
            .getCorrectiveDetail(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.correctiveInfo = rsp.data;
                    this.Lib.assignDataFormControl(this.form.controls, this.correctiveInfo);
                    this.getFacilityList(this.correctiveInfo?.fuel_type ?? 0);
                },
            });
    }

    /**
     * Submit form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onSave(): void {
        this.validator.makeValidator(this.form, this.validator.createErrorMessages());
        console.log(this.form.value);

        if (this.form.invalid) return;
        const params = Object.assign({}, this.form.value) as CorrectivesEntity;
        params.is_new = !this.isEdit;
        // params.upd_datetime = this.?.upd_datetime;
        this._correctivesService
            .onSave(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        this.validator.errors = errorList;
                        return;
                    }
                    this._toastrService.success(this.translate.instant('message.update_success', { field: '' }) as string);
                },
            });
    }

    /**
     * Get building list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @returns {void}
     */
    public getBuildingList(): void {
        const params = {...this.buildingParams};
        this._divisionsService
            .getDivisionsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.buildingList = rsp.data;
                },
            });
    }

    /**
     * Get fuel list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @returns {void}
     */
    public getFuelList(): void {
        const params = {...this.fuelParams};
        this._itemsService
            .getItemsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.fuelList = rsp.data;
                },
            });
    }

    /**
     * Get facility list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @param {number} type type
     *
     * @returns {void}
     */
    public getFacilityList(type: number): void {
        const params = {...this.facilityParams};
        params.type = type;
        this._divisionsService
            .getDivisionsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.facilityList = rsp.data;
                },
            });
    }

    /**
     * Fuel select change
     * @date 2024/07/24 11:54
     * @author DuyPham
     *
     * @public
     * @param {ItemsEntity} item item selected
     * @returns {void}
     */
    public fuelChange(item: ItemsEntity): void {
        if (this.Lib.isBlank(item?.item_name)) {
            this.facilityList = [];
        } else {
            this.getFacilityList(item?.item_no ?? 0);
        }
        this.form.controls['facility_id'].setValue(null);
    }

    /**
     * Get event list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @returns {void}
     */
    public getEventList(): void {
        const params = {...this.eventParams};
        this._divisionsService
            .getDivisionsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.eventList = rsp.data;
                },
            });
    }

    /**
     * Get is correction list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @returns {void}
     */
    public getIsCorrectionList(): void {
        const params = {...this.isCorrectionParams};
        this._divisionsService
            .getDivisionsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.correctionList = rsp.data;
                },
            });
    }

    /**
     * Get from incident list
     * @date 2024/07/24 10:44
     * @author DuyPham
     *
     * @returns {void}
     */
    public getFromIncidentList(): void {
        const params = {...this.isFromIncidentParams};
        this._divisionsService
            .getDivisionsDropdown(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        return;
                    }
                    this.fromIncidentList = rsp.data;
                },
            });
    }


    /**
     * open malfunction modal
     * @date 2024/07/25 11:28
     * @author DuyPham
     *
     * @returns {void}
     */
    public onOpenMalfunctionModal(): void {
        const modal = this._modalService.open(ModalMalfunctionSelectComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalMalfunctionSelectComponent;

        modalInstance.selectChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((item?: MalfunctionsEntity) => {
            if (this.correctiveInfo) {
                this.correctiveInfo.malfunction_subject = item?.subject;
                this.correctiveInfo.malfunction_no = item?.malfunction_no;
                this.form.controls['malfunction_no']?.setValue(item?.malfunction_no ?? null);
            }
        })
    }
}
