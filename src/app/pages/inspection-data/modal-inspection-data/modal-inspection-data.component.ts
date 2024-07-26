import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, ChartConfiguration } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { InspectionDataService } from '../../../core/services';
import { BaseChartDirective } from 'ng2-charts';
import AnnotationPlugin from "chartjs-plugin-annotation";

@Component({
    templateUrl: './modal-inspection-data.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        BaseChartDirective
    ],
})
export class ModalInspectionDataComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild(BaseChartDirective) private _chart?: BaseChartDirective;
    private _subscriptionList: Subscription[] = [];

    public dateType: number = this.Constants.DATE_TYPE.DAY;

    public inspectionDataChartData: ChartConfiguration<'line'>['data'] = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    '#2E8BC0'
                ],
                datalabels: {
                    align: 'center',
                    anchor: 'end'
                }
            },
        ]
    };

    public inspectionDataChartOptions: ChartConfiguration<'line'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            annotation: {
                annotations: [
                    {
                        type: 'line',
                        scaleID: 'y',
                        value: 300,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            display: true,
                            borderWidth: 1,
                            content: () => 'UCL',
                            position: 'end'
                        },
                    },
                    {
                        type: 'line',
                        scaleID: 'y',
                        value: 210,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            display: true,
                            borderWidth: 1,
                            content: () => 'M+3σ',
                            position: 'end'
                        },
                    },
                    {
                        type: 'line',
                        scaleID: 'y',
                        value: 70,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            display: true,
                            borderWidth: 1,
                            content: () => 'M-3σ',
                            position: 'end'
                        },
                    },
                ],
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: '(ppm)'
                }
            }
        }
    };
    private inspectionDataToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 0, false, 'YYYY/MM/DD HH:mm');
    private inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');

    /** Constructor */
    constructor(
        public activeModal: NgbActiveModal,
        private _inspectionDataService: InspectionDataService,
    ) {
        super();
        Chart.register(ChartDataLabels, AnnotationPlugin);
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        const fromDate = this.Lib.addToDate(this.inspectionDataToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');
        this._getInspectionDataChart(fromDate, this.inspectionDataToDate);
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * get inspection data chart
     * @author DuyPham
     * @param {string} fromDate fromDate
     * @param {string} toDate toDate
     * @returns {void}
     */
    private _getInspectionDataChart(fromDate: string, toDate: string): void {

        const sub = this._inspectionDataService.getInspectionDataStatistic(fromDate, toDate, this.dateType).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                const dataChart = rsp.data.map(p => p.count || 0);
                const labelChart = rsp.data.map(p => p.date || "");
                this.inspectionDataChartData.datasets[0].data = dataChart;
                this.inspectionDataChartData.labels = labelChart;
                this._chart?.chart?.update();
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * onClick next chart
     * @author DuyPham
     *
     * @returns {void}
     */
    public onNext(): void {
        switch (this.dateType) {
            case this.Constants.DATE_TYPE.DAY:
                this.inspectionDataToDate = this.Lib.addToDate(this.inspectionDataToDate, 7, 0, true, 'YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataFromDate, 7, 0, true, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.inspectionDataToDate = this.Lib.addToDate(this.inspectionDataToDate, 7, 2, true, 'YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataFromDate, 7, 2, true, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.inspectionDataToDate = this.Lib.addToDate(this.inspectionDataToDate, 7, 4, true, 'YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataFromDate, 7, 4, true, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getInspectionDataChart(this.inspectionDataFromDate, this.inspectionDataToDate);
    }

    /**
     * onClick previous chart
     * @author DuyPham
     *
     * @returns {void}
     */
    public onPrevious(): void {
        switch (this.dateType) {
            case this.Constants.DATE_TYPE.DAY:
                this.inspectionDataToDate = this.Lib.addToDate(this.inspectionDataToDate, 7, 0, false, 'YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataFromDate, 7, 0, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.inspectionDataToDate = this.Lib.addToDate(this.inspectionDataToDate, 7, 2, false, 'YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataFromDate, 7, 2, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.inspectionDataToDate = this.Lib.addToDate(this.inspectionDataToDate, 7, 4, false, 'YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataFromDate, 7, 4, false, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getInspectionDataChart(this.inspectionDataFromDate, this.inspectionDataToDate);
    }

    /**
     * onChange date type
     * @author DuyPham
     *
     * @returns {void}
     */
    public onChangeDateType(): void {
        switch (this.dateType) {
            case this.Constants.DATE_TYPE.DAY:
                this.inspectionDataToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 0, false, 'YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.inspectionDataToDate = this.Lib.toDay('YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataToDate, 6, 2, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.inspectionDataToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 4, false, 'YYYY/MM/DD HH:mm');
                this.inspectionDataFromDate = this.Lib.addToDate(this.inspectionDataToDate, 6, 4, false, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getInspectionDataChart(this.inspectionDataFromDate, this.inspectionDataToDate);
    }

}
