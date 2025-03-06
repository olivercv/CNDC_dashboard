import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
// Importar módulos necesarios
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsExporting from 'highcharts/modules/exporting';

// // Inicializar módulos
// if (typeof HighchartsExporting === 'function') {  HighchartsExporting(Highcharts); }
// if (typeof HighchartsMore === 'function') { HighchartsMore(Highcharts); } 

@Component({
  selector: 'app-frecuencia',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './frecuencia.component.html',
  styleUrls: ['./frecuencia.component.css']
})
export class FrecuenciaComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  private intervalId: any;
  private dataPoints: number[][] = [];
  private readonly maxSeconds = 50;

  constructor(private cdr: ChangeDetectorRef) {
    this.initializeHistoricalData();
  }

  ngOnInit() {
    this.initializeChart();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  private initializeHistoricalData() {
    const now = Date.now();
    // Crear 50 puntos históricos estáticos
    for (let i = 0; i < this.maxSeconds; i++) {
      this.dataPoints.push([
        now - (this.maxSeconds - i) * 1000,
        Number((Math.random() * (50.25 - 49.75) + 49.75).toFixed(2))
      ]);
    }
  }

  private initializeChart() {
    this.chartOptions = this.buildChartOptions();
  }

  private getLiveDataPoint(): number[] {
    return [Date.now(), Number((Math.random() * (50.25 - 49.75) + 49.75).toFixed(2))];
  }

  private updateChartData() {
    const newPoint = this.getLiveDataPoint();
    
    // Mantener histórico + nuevo punto
    this.dataPoints = [
      ...this.dataPoints.slice(1),  // Conservar todos excepto el más antiguo
      newPoint                      // Añadir nuevo punto
    ];
  }

  private buildChartOptions(): Highcharts.Options {
    return {
      chart: {
        type: 'spline',
        animation: true,
        events: {
          load: () => this.handleChartLoad()
        }
      },
      title: {
        text: 'Frecuencia en Tiempo Real',
        style: {
          fontSize: '20px',
          color: '#2c3e50'
        }
      },
      xAxis: {
        type: 'datetime',
        min: this.dataPoints[0][0],
        max: this.dataPoints[this.dataPoints.length - 1][0],
        labels: {
          formatter: function() {
            return Highcharts.dateFormat('%H:%M:%S', this.value as number);
          }
        }
      },
      yAxis: {
        title: { text: 'Hz' },
        min: 49.50,
        max: 50.50,
        plotLines: this.getReferenceLines()
      },
      series: [{
        name: 'Frecuencia',
        type: 'spline',
        data: this.dataPoints,
        color: '#59D986',
        lineWidth: 2,
        marker: { enabled: false }
      }],
      tooltip: {
        valueDecimals: 2,
        headerFormat: '<small>{point.key:%H:%M:%S}</small><br>',
        pointFormat: '<b>{point.y} Hz</b>'
      },
      credits: { enabled: false }
    };
  }

  private getReferenceLines(): Highcharts.AxisPlotLinesOptions[] {
    return [
    {
      value: 50,
      color: '#2C6CBF',
      width: 3,
      dashStyle: 'Dot',
      label: { text: '' }
    }, {
      value: 50.25,
      color: '#D92211',
      width: 2,
      dashStyle: 'Dot',
      label: { text: '50.25 Hz' }
    },
    {
      value: 49.75,
      color: '#D92211',
      width: 2,
      dashStyle: 'Dot',
      label: { text: '49.75 Hz' }
    }
  ];
  }

  private handleChartLoad() {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }

  startAutoRefresh() {
    this.intervalId = setInterval(() => {
      this.updateChartData();
      this.chartOptions = this.buildChartOptions();
      this.cdr.detectChanges();
    }, 1000);
  }

  stopAutoRefresh() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}