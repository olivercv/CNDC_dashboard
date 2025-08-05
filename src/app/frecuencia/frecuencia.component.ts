import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { LiveDataService } from '../services/live-data.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-frecuencia',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './frecuencia.component.html',
  styleUrls: ['./frecuencia.component.css'],
  providers: [DatePipe]
})
export class FrecuenciaComponent implements OnInit, OnDestroy {
  fechaTiempoReal: Date = new Date();
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  private dataPoints: number[][] = [];
  private readonly maxSeconds = 50;
  private liveDataSubscription!: Subscription;
  errorMessage: string | null = null;


  constructor(
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private liveDataService: LiveDataService
  ) {}

  ngOnInit() {
    this.liveDataService.getHistoricalData(this.maxSeconds).pipe(
    catchError(error => {
      this.errorMessage = '❌ Error al cargar el historial: ' + error.message;
      return of([]); // devuelve lista vacía para no romper la app
    })
  ).subscribe(historicalData => {
    this.dataPoints = historicalData;
    this.initializeChart();
    this.subscribeToLiveData();
  });
  }

  ngOnDestroy() {
    this.unsubscribeFromLiveData();
  }

  private initializeChart() {
    this.chartOptions = this.buildChartOptions();
  }

  private subscribeToLiveData() {
     this.liveDataSubscription = this.liveDataService.getLiveData().pipe(
    catchError(error => {
      this.errorMessage = '❌ Error al obtener datos en tiempo real: ' + error.message;
      return of(null); // Detiene actualizaciones sin romper la app
    })
  ).subscribe(data => {
    if (!data) return;

    const newPoint: [number, number] = [data.timestamp, data.frequency];
    this.dataPoints = [...this.dataPoints.slice(1), newPoint];

    (this.chartOptions.series![0] as Highcharts.SeriesSplineOptions).data = this.dataPoints;
    this.chartOptions.subtitle = { 
      text: `Datos en tiempo real en Fecha: ${this.datePipe.transform(new Date(), 'dd-MM-yy HH:mm:ss')}`
    };
    this.cdr.detectChanges();
  });
  }

  private unsubscribeFromLiveData() {
    if (this.liveDataSubscription) {
      this.liveDataSubscription.unsubscribe();
    }
  }

  private buildChartOptions(): Highcharts.Options {
    return {
      chart: {
        type: 'spline',
        animation: true,
        events: {
          load: () => setTimeout(() => window.dispatchEvent(new Event('resize')), 100)
        }
      },
      title: {
        text: 'Frecuencia en Tiempo Real',
        style: { fontSize: '20px', color: '#2c3e50' }
      },
      subtitle: { 
        text: `Datos en tiempo real en Fecha: ${this.datePipe.transform(new Date(), 'dd-MM-yy HH:mm:ss')}`,
        style: { fontSize: '14px', color: '#2c3e50' }
      },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function() {
            const date = new Date(this.value as number);
            return date.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
          }
        },
        title: { text: 'Hora Actual' }
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
        headerFormat: '<small>{point.key:%H:%M:%S}</small><br>',
        pointFormat: '<b>{point.y} Hz</b>'
      },
      credits: { enabled: false }
    };
  }
}
