import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, ChartConfiguration } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AlarmHistoryService } from '../../../core/services';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    templateUrl: './modal-alarm-history.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        BaseChartDirective
    ],
})
export class ModalAlarmHistoryComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild(BaseChartDirective) private _chart?: BaseChartDirective;
    private _subscriptionList: Subscription[] = [];

    public dateTypeList = [
        {
            id: this.Constants.DATE_TYPE.MONTH,
            name: '月',
        },
        {
            id: this.Constants.DATE_TYPE.DAY,
            name: '日',
        },
        {
            id: this.Constants.DATE_TYPE.HOUR,
            name: '時間',
        }
    ];

    public dateType: number = this.Constants.DATE_TYPE.DAY;

    public alertChartData: ChartConfiguration<'bar'>['data'] = {
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

    public alertChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: '(件)'
                }
            }
        }
    };
    private alertToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 0, false, 'YYYY/MM/DD HH:mm');
    private alertFromDate = this.Lib.addToDate(this.alertToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');

    /** Constructor */
    constructor(
        public activeModal: NgbActiveModal,
        private _alarmHistoryService: AlarmHistoryService,
    ) {
        super();
        Chart.register(ChartDataLabels);

    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        const fromDate = this.Lib.addToDate(this.alertToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');
        this._getAlertChart(fromDate, this.alertToDate);
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * get data alert chart
     * @author DuyPham
     * @param {string} fromDate fromDate
     * @param {string} toDate toDate
     * @returns {void}
     */
    private _getAlertChart(fromDate: string, toDate: string): void {

        const sub = this._alarmHistoryService.getAlertStatistic(fromDate, toDate, this.dateType).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                const dataChart = rsp.data.map(p => p.count || 0);
                const labelChart = rsp.data.map(p => p.date || "");
                this.alertChartData.datasets[0].data = dataChart;
                this.alertChartData.labels = labelChart;
                this._chart?.chart?.update();
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * onClick next alert chart
     * @author DuyPham
     *
     * @returns {void}
     */
    public onAlertNext(): void {
        switch (this.dateType) {
            case this.Constants.DATE_TYPE.DAY:
                this.alertToDate = this.Lib.addToDate(this.alertToDate, 7, 0, true, 'YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertFromDate, 7, 0, true, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.alertToDate = this.Lib.addToDate(this.alertToDate, 7, 2, true, 'YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertFromDate, 7, 2, true, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.alertToDate = this.Lib.addToDate(this.alertToDate, 7, 4, true, 'YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertFromDate, 7, 4, true, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getAlertChart(this.alertFromDate, this.alertToDate);
    }

    /**
     * onClick previous alert chart
     * @author DuyPham
     *
     * @returns {void}
     */
    public onAlertPrevious(): void {
        switch (this.dateType) {
            case this.Constants.DATE_TYPE.DAY:
                this.alertToDate = this.Lib.addToDate(this.alertToDate, 7, 0, false, 'YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertFromDate, 7, 0, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.alertToDate = this.Lib.addToDate(this.alertToDate, 7, 2, false, 'YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertFromDate, 7, 2, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.alertToDate = this.Lib.addToDate(this.alertToDate, 7, 4, false, 'YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertFromDate, 7, 4, false, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getAlertChart(this.alertFromDate, this.alertToDate);
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
                this.alertToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 0, false, 'YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertToDate, 6, 0, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.MONTH:
                this.alertToDate = this.Lib.toDay('YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertToDate, 6, 2, false, 'YYYY/MM/DD HH:mm');
                break;
            case this.Constants.DATE_TYPE.HOUR:
                this.alertToDate = this.Lib.addToDate(this.Lib.toDay('YYYY/MM/DD HH:mm'), 1, 4, false, 'YYYY/MM/DD HH:mm');
                this.alertFromDate = this.Lib.addToDate(this.alertToDate, 6, 4, false, 'YYYY/MM/DD HH:mm');
                break;
            default:
                break;
        }
        this._getAlertChart(this.alertFromDate, this.alertToDate);
    }

}
