import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { LiveDataService } from '../live-data.service'; // Asegúrate de importar el servicio
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-frecuencia',
  standalone: true,
  imports: [HighchartsChartModule],
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
  

  constructor(private datePipe: DatePipe, private cdr: ChangeDetectorRef, private liveDataService: LiveDataService) {
    this.initializeHistoricalData();
  }

  ngOnInit() {
    this.initializeChart();
    this.subscribeToLiveData();
  }

  ngOnDestroy() {
    this.unsubscribeFromLiveData();
  }

  formatearFecha(): string | null {
    return this.datePipe.transform(this.fechaTiempoReal, 'dd-MM-yy HH:mm:ss');

  }

  private initializeHistoricalData() {
    // Usamos new Date() en lugar de Date.now() para tener control de la zona horaria
    const now = new Date();
    
    // Crear 50 puntos históricos estáticos
    for (let i = 0; i < this.maxSeconds; i++) {
      const pointDate = new Date(now);
      pointDate.setSeconds(pointDate.getSeconds() - (this.maxSeconds - i));
      
      this.dataPoints.push([
        pointDate.getTime(), // Convertir a timestamp
        Number((Math.random() * (50.05 - 49.95) + 49.95).toFixed(2)) // Se añadió el paréntesis que faltaba
      ]);
    }
}

  private initializeChart() {
    this.chartOptions = this.buildChartOptions();
  }

  private subscribeToLiveData() {
    this.liveDataSubscription = this.liveDataService.getLiveData().subscribe(data => {
      this.updateChartData(data.frequency);
      this.chartOptions = this.buildChartOptions();
      this.cdr.detectChanges();
    });
  }

  private unsubscribeFromLiveData() {
    if (this.liveDataSubscription) {
      this.liveDataSubscription.unsubscribe();
    }
  }

  private updateChartData(frequency: number) {
     const now = new Date(); // Usamos la fecha actual con zona horaria
    const newPoint = [now.getTime(), frequency];
    
    this.dataPoints = [
      ...this.dataPoints.slice(1),
      newPoint
    ];
  }

  private buildChartOptions(): Highcharts.Options {
    const fechaTiempoReal = new Date();
    const formattedDate = this.datePipe.transform(fechaTiempoReal, 'dd-MM-yy HH:mm:ss');
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
      subtitle: { 
        text: `Datos en tiempo real en Fecha: ${formattedDate}`,
        style: {
          fontSize: '14px',
          color: '#2c3e50'
        } 
      },
        
      xAxis: {
        type: 'datetime',
        min: this.dataPoints[0][0],
        max: this.dataPoints[this.dataPoints.length - 1][0],
        labels: {
          formatter: function() {
            // Formatear la fecha incluyendo horas, minutos y segundos
            const date = new Date(this.value as number);
            return date.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
          }
        },
        title: {
          text: 'Hora Actual'
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
}