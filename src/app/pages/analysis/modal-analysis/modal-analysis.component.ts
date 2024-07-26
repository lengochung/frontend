import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, ChartConfiguration } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AnalysisService } from '../../../core/services';
import { BaseChartDirective } from 'ng2-charts';
import AnnotationPlugin from "chartjs-plugin-annotation";

@Component({
    templateUrl: './modal-analysis.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        BaseChartDirective
    ],
})
export class ModalAnalysisComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild(BaseChartDirective) private _chart?: BaseChartDirective;
    private _subscriptionList: Subscription[] = [];

    public dateType: number = this.Constants.DATE_TYPE.DAY;

    public analysisChartData: ChartConfiguration<'line'>['data'] = {
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

    public analysisChartOptions: ChartConfiguration<'line'>['options'] = {
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
    private analysisToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 0, false, 'YYYY/MM/DD HH:mm');
    private analysisFromDate = this.Lib.addToDate(this.analysisToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');

    /** Constructor */
    constructor(
        public activeModal: NgbActiveModal,
        private _analysisService: AnalysisService,
    ) {
        super();
        Chart.register(ChartDataLabels, AnnotationPlugin);
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        const fromDate = this.Lib.addToDate(this.analysisToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');
        this._getAnalysisChart(fromDate, this.analysisToDate);
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * get data analysis chart
     * @author DuyPham
     * @param {string} fromDate fromDate
     * @param {string} toDate toDate
     * @returns {void}
     */
    private _getAnalysisChart(fromDate: string, toDate: string): void {

        const sub = this._analysisService.getAnalysisStatistic(fromDate, toDate, this.dateType).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                const dataChart = rsp.data.map(p => p.count || 0);
                const labelChart = rsp.data.map(p => p.date || "");
                this.analysisChartData.datasets[0].data = dataChart;
                this.analysisChartData.labels = labelChart;
                this._chart?.chart?.update();
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * onClick next analysis chart
     * @author DuyPham
     *
     * @returns {void}
     */
    public onAnalysisNext(): void {
        switch (this.dateType) {
            case this.Constants.DATE_TYPE.DAY:
                this.analysisToDate = this.Lib.addToDate(this.analysisToDate, 7, 0, true, 'YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisFromDate, 7, 0, true, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.analysisToDate = this.Lib.addToDate(this.analysisToDate, 7, 2, true, 'YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisFromDate, 7, 2, true, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.analysisToDate = this.Lib.addToDate(this.analysisToDate, 7, 4, true, 'YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisFromDate, 7, 4, true, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getAnalysisChart(this.analysisFromDate, this.analysisToDate);
    }

    /**
     * onClick previous analysis chart
     * @author DuyPham
     *
     * @returns {void}
     */
    public onAnalysisPrevious(): void {
        switch (this.dateType) {
            case this.Constants.DATE_TYPE.DAY:
                this.analysisToDate = this.Lib.addToDate(this.analysisToDate, 7, 0, false, 'YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisFromDate, 7, 0, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.analysisToDate = this.Lib.addToDate(this.analysisToDate, 7, 2, false, 'YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisFromDate, 7, 2, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.analysisToDate = this.Lib.addToDate(this.analysisToDate, 7, 4, false, 'YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisFromDate, 7, 4, false, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getAnalysisChart(this.analysisFromDate, this.analysisToDate);
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
                this.analysisToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 0, false, 'YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.analysisToDate = this.Lib.toDay('YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisToDate, 6, 2, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.analysisToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 4, false, 'YYYY/MM/DD HH:mm');
                this.analysisFromDate = this.Lib.addToDate(this.analysisToDate, 6, 4, false, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getAnalysisChart(this.analysisFromDate, this.analysisToDate);
    }

}
