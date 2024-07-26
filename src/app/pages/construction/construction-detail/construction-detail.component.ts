import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription, filter, fromEvent, take } from 'rxjs';
import { ConstructionService, SubjectService } from '../../../core/services';
import { CommentEntity, ConstructionEntity, NoticesEntity, ScheduleConstructionEntity, UserManagementEntity, UserSearchEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from '../../../core/components/upload/upload.component';
import { UserService } from '../../../core/services/user.service';
import { ConstructionValidator } from '../validator/construction.validator';
import { FormArray } from '@angular/forms';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserSelectComponent } from '../../../core/components/modal/modal-user-select.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { StopPropagationDirective } from '../../../core/directives/stop-propagation.directive';

@Component({
    templateUrl: './construction-detail.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        UploadComponent,
        StopPropagationDirective
    ],
})
export class ConstructionDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('contextMenu') contextMenu!: TemplateRef<any>;
    private overlayRef?: OverlayRef | null = null;
    private _menuSub?: Subscription;
    private _subscriptionList: Subscription[] = [];
    public validator: ConstructionValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public constructionInfo?: ConstructionEntity;
    public isEdit = false;
    public userList: UserManagementEntity[] = [];
    public commentList: CommentEntity[] = [];
    public buildingList = [
        {
            id: 1,
            name: '対象建屋1'
        },
        {
            id: 2,
            name: '対象建屋2'
        }
    ];
    public classifyList = [
        {
            id: 1,
            name: '計画分類1'
        },
        {
            id: 2,
            name: '計画分類2'
        }
    ];
    public constructionTypeList = [
        {
            id: 1,
            name: '工事種別1'
        },
        {
            id: 2,
            name: '工事種別2'
        }
    ];
    public constructionPlanList = [
        {
            id: 1,
            name: '工事計画書1'
        },
        {
            id: 2,
            name: '工事計画書2'
        }
    ];
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
    public dynamicInfluenceList = [
        {
            id: 1,
            name: "原動影響1",
        },
        {
            id: 2,
            name: "原動影響2",
        },
    ];
    public sensorFalseAlarmResponseList = [
        {
            id: 1,
            name: "センサー誤報対応1",
        },
        {
            id: 2,
            name: "センサー誤報対応2",
        },
    ];
    public admissionProcedureList = [
        {
            id: 1,
            name: "入館手続き1",
        },
        {
            id: 2,
            name: "入館手続き2",
        },
    ];
    public trafficWorkAreaRegulationsList = [
        {
            id: 1,
            name: "通行・作業エリア規制1",
        },
        {
            id: 2,
            name: "通行・作業エリア規制2",
        },
    ];
    public riskPredictionResponseList = [
        {
            id: 1,
            name: "危険予知対応1",
        },
        {
            id: 2,
            name: "危険予知対応2",
        },
    ];
    public completeList = [
        {
            id: 1,
            name: "完了",
        },
        {
            id: 0,
            name: "未",
        },
    ];

    public breadcrumbsCreate: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.construction_info_dissemination_management') as string,
            link: this.Constants.APP_URL.CONSTRUCTION.MODULE,
        },
        { name: this.translate.instant('label.create') as string, link: '' },
    ];
    public breadcrumbsDetail: Array<{
        name: string;
        link: string;
    }> = [
        {
            name: this.translate.instant('label.construction_info_dissemination_management') as string,
            link: this.Constants.APP_URL.CONSTRUCTION.MODULE,
        },
        { name: this.translate.instant('label.detail') as string, link: '' },
    ];

    /** Constructor */
    constructor(
        private _router: Router,
        private _constructionService: ConstructionService,
        private _subjectService: SubjectService,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _userService: UserService,
        private _modalService: NgbModal,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef
    ) {
        super();
        this.validator = new ConstructionValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._getUserList();
        this.form = this.validator.createRules();
        const sub = this._route.params.subscribe(params => {
            const id = params['id'];
            if (id !== null && this.Lib.isNumber(id)) {
                const constructionId = Number(id);
                this.isEdit = true;
                this._getConstructionDetail(constructionId);
            } else {
                this.onAddConstructionIndividual();
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
    private _getConstructionDetail(id: number): void {
        const params = {id: id};
        const sub = this._constructionService.getConstructionDetail(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.constructionInfo = rsp.data;
                this.constructionInfo.individual_construction_list?.forEach(individual => {
                    const individualFormGroup = this.validator.createConstructionIndividualRules(individual);
                    individual?.schedule_list?.forEach(schedule => {
                        (individualFormGroup.get('schedule_list') as FormArray).push(this.validator.createScheduleConstructionRules(schedule));
                    });
                    this.individualConstructionFormArray.push(individualFormGroup);
                });
                this.Lib.assignDataFormControl(this.form.controls, this.constructionInfo);

            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * Get user list
     * @returns {void}
     */
    private _getUserList(): void{
        const params = {} as UserSearchEntity;
        const sub = this._userService.getUserList(params).subscribe(rsp => {
            if (!rsp.status || !rsp.data) return;
            this.userList = rsp.data;
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
        const sub = this._constructionService.onSave(params).subscribe({
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
        void this._router.navigate([this.Constants.APP_URL.CONSTRUCTION.MODULE]);
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
            void this._router.navigate([`${this.Constants.APP_URL.CONSTRUCTION.MODULE}/${this.Constants.APP_URL.CONSTRUCTION.CREATE}`]);
        } else {
            this.form = this.validator.createRules();
            this.onAddConstructionIndividual();
            // this.form.reset();
            //reset file
        }
    }

    /**
     * Get Construction Individual formArray
     * @author DuyPham
     *
     * @readonly
     * @type {FormArray}
     */
    get individualConstructionFormArray(): FormArray {
        return this.form.controls['individual_construction_list'] as FormArray;
    }

    /**
     * Get schedule construction formArray
     * @author DuyPham
     *
     * @public
     * @param {number} index index
     * @returns {FormArray} formArray
     */
    public getScheduleConstructionFormArray(index: number): FormArray {
        return this.individualConstructionFormArray.controls[index].get('schedule_list') as FormArray;
    }

    /**
     * Add new construction individual
     * @author DuyPham
     *
     * @returns {void}
     */
    public onAddConstructionIndividual(): void {
        this.individualConstructionFormArray.push(this.validator.createConstructionIndividualRules());
    }

    /**
     * Add new schedule construction
     * @author DuyPham
     *
     * @param {NgbDate} dateSelect dateSelect
     * @param {number} index index
     * @returns {void}
     */
    public onAddConstructionSchedule(dateSelect: NgbDate, index: number): void {
        const schedule = new ScheduleConstructionEntity();
        schedule.complete = 0;
        schedule.scheduled_date = `${dateSelect.year}/${dateSelect.month}/${dateSelect.day}`
        this.getScheduleConstructionFormArray(index).push(this.validator.createScheduleConstructionRules(schedule));
    }

    /**
     * select user
     * @author DuyPham
     *
     * @param {number} index index
     * @returns {void}
     */
    public onSelectUser(index: number): void {
        const modal = this._modalService.open(ModalUserSelectComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalUserSelectComponent;

        const modalSubscription = modalInstance.userChange.subscribe((p) => {
            if (!p) {
                return;
            }
            this.individualConstructionFormArray.controls[index].get('internal_person_id')?.setValue(p.user_id);
            this.individualConstructionFormArray.controls[index].get('internal_person_name')?.setValue(`${p.user_first_name  }${  p.user_last_name}`);

        });
        this._subscriptionList.push(modalSubscription);
    }

    /**
     * Get internal person name
     * @author DuyPham
     *
     * @public
     * @param {number} index index
     * @returns {string} internal name
     */
    public getInternalName(index: number): string {
        return this.individualConstructionFormArray.controls[index].get('internal_person_name')?.value as string;
    }

    /**
     * Open menu context
     * @author DuyPham
     *
     * @public
     * @param {MouseEvent} param0 mouse
     * @param {number} i index
     * @param {number} j index
     * @returns {void}
     */
    public openMenuContext({ x, y }: MouseEvent, i: number, j: number): void {
        this.closeMenuContext();

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo({ x, y })
            .withPositions([
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'top',
                }
            ]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });

        this.overlayRef.attach(new TemplatePortal(this.contextMenu, this.viewContainerRef, {
            $implicit: {i: i, j: j}
        }));

        this._menuSub = fromEvent<MouseEvent>(document, 'click')
        .pipe(
            filter(event => {
                const clickTarget = event.target as HTMLElement;
                return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
            }),
            take(1)
        ).subscribe(() => this.closeMenuContext());
    }

    /**
     * close menu context
     * @author DuyPham
     *
     * @returns {void}
     */
    public closeMenuContext(): void {
        this._menuSub && this._menuSub.unsubscribe();
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

    /**
     * Duplication schedule
     * @author DuyPham
     *
     * @param {number} i individual index
     * @param {number} j schedule index
     * @returns {void}
     */
    public duplicationSchedule(i: number, j: number): void {
        console.log(i, j);
        this.closeMenuContext();
        const item = this.getScheduleConstructionFormArray(i).at(j).value;
        this.getScheduleConstructionFormArray(i).push(this.validator.createScheduleConstructionRules(item));
    }

    /**
     * Delete schedule
     * @author DuyPham
     *
     * @param {number} i individual index
     * @param {number} j schedule index
     * @returns {void}
     */
    public deleteSchedule(i: number, j: number): void {
        console.log(i, j);
        this.closeMenuContext();
        this.getScheduleConstructionFormArray(i).removeAt(j);
    }

}
