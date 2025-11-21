import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { LiveDataService } from '../services/live-data.service';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-frecuencia',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './frecuencia.component.html',
  styleUrls: ['./frecuencia.component.css'],
  providers: [DatePipe]
})
export class FrecuenciaComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  chartCallback!: (chart: Highcharts.Chart) => void;
  chartRef!: Highcharts.Chart;
  private dataPoints: number[][] = [];
  private readonly maxSeconds = 360;
  private liveDataSubscription!: Subscription;
  errorMessage: string | null = null;

  constructor(
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private liveDataService: LiveDataService
  ) {
    // ✅ Captura de instancia del gráfico
    this.chartCallback = (chart) => {
      this.chartRef = chart;
    };
  }

  ngOnInit() {
    this.liveDataService.getHistoricalData(this.maxSeconds).pipe(
      catchError(error => {
        this.errorMessage = '❌ Error al cargar el historial: ' + error.message;
        return of([]);
      })
    ).subscribe(historicalData => {
      this.dataPoints = historicalData;
      this.initializeChart();
      this.subscribeToLiveData();
    });
  }

  ngOnDestroy() {
    if (this.liveDataSubscription) {
      this.liveDataSubscription.unsubscribe();
    }
  }

  private initializeChart() {
    this.chartOptions = this.buildChartOptions();
  }

  private subscribeToLiveData() {
    this.liveDataSubscription = this.liveDataService.getLiveData().pipe(
      catchError(error => {
        this.errorMessage = '❌ Error en tiempo real: ' + error.message;
        return of(null);
      })
    ).subscribe(data => {
      if (!data || !this.chartRef) return;

      const newPoint: [number, number] = [data.timestamp, data.frequency];
      const series = this.chartRef.series[0];
      const shouldShift = this.dataPoints.length >= this.maxSeconds;

      series.addPoint(newPoint, true, shouldShift);
      this.dataPoints.push(newPoint);
      if (shouldShift) this.dataPoints.shift();

      this.chartRef.setSubtitle({
        text: `Actualizado: ${this.datePipe.transform(new Date(), 'dd-MM-yy HH:mm:ss')}`
      });
    });
  }

  private buildChartOptions(): Highcharts.Options {
    return {
      chart: {
        type: 'spline',
        animation: true,
        reflow: true,
        height: null
      },
      title: {
        text: 'Frecuencia en Tiempo Real',
        style: { fontSize: '20px', color: '#2c3e50' }
      },
      subtitle: {
        text: `Inicializado: ${this.datePipe.transform(new Date(), 'dd-MM-yy HH:mm:ss')}`,
        style: { fontSize: '14px', color: '#2c3e50' }
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 80,
        labels: {
          formatter: function () {
            return new Date(this.value as number).toLocaleTimeString('es-ES', {
              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            });
          },
          rotation: -45,
          align: 'right',
          style: {
            fontSize: '11px'
          }
        },
        title: { text: 'Hora' }
      },
      yAxis: {
        title: { text: 'Hz' },
        min: 49.50,
        max: 50.50,
        plotLines: [
          { value: 50, color: '#2C6CBF', width: 3, dashStyle: 'Dot' },
          { value: 50.25, color: '#D92211', width: 2, dashStyle: 'Dot', label: { text: '50.25 Hz' } },
          { value: 49.75, color: '#D92211', width: 2, dashStyle: 'Dot', label: { text: '49.75 Hz' } }
        ]
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
        formatter: function () {
          const fechaLocal = new Date(this.x as number).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });

          return `<small>${fechaLocal}</small><br><b>${this.y} Hz</b>`;
        }
      },

      credits: { enabled: false }
    };
  }
}
