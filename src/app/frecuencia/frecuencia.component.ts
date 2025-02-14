import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

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

  // Datos proporcionados
  private datos_json = [
    {
      "codigo": "Frecuencia",
      "max": 50.7,
      "min": 49.75,
      "fecha": "2025-01-05T00:00:00",
      "valores": [
        50.18, 50.18, 50.33, 50.33, 50.33, 50.33, 50.1, 50.1, 50.18, 50.37, 
        50.38, 50.4, 50.4, 50.38, 50.18, 50.18, 50.18, 50.17, 50.33, 50.26, 
        50.62, 50.74, 50.72, 50.18
      ]
    }
  ];

  constructor() {}

  ngOnInit() {
    this.fetchData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  startAutoRefresh() {
    // this.zone.runOutsideAngular(() => {
    //   this.intervalId = setInterval(() => this.fetchData(), 15000);
    // });
  }

  stopAutoRefresh() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  fetchData() {
    const data = this.datos_json[0];
    const baseDate = new Date(data.fecha);
    baseDate.setUTCHours(0, 0, 0, 0); // Fijar a medianoche en UTC

    const seriesData: any = [{
      name: data.codigo,
      type: 'spline',
      lineWidth: 3, // Grosor de línea aumentado
      data: data.valores.map((val: number, index: number) => {
        const timestamp = baseDate.getTime() + (index * 3600000); // Intervalos de 1 hora
        return [timestamp, val];
      }),
      marker: {
        enabled: false, // Asegurar que los marcadores estén habilitados
        symbol: 'circle',
        radius: 1, // Tamaño aumentado
        fillColor: '#FFFFFF',
        lineColor: '#058DC7', // Color del borde igual a la serie
        lineWidth: 1
      }
    }];

    this.updateChart(seriesData, data.fecha, baseDate, data.min, data.max);
  }

  private updateChart(seriesData: Highcharts.SeriesOptionsType[], fecha: string, baseDate: Date, minY: number, maxY: number) {
    this.chartOptions = {
      chart: {
        type: 'spline',
        scrollablePlotArea: { minWidth: 300 }
      },
      title: {
        text: 'Frecuencia'
      },
      subtitle: {
        text: `Fecha: ${fecha}`
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          hour: '%H:%M',
          day: '%e. %b'
        },
        title: {
          text: 'Hora'
        },
        min: baseDate.getTime(), // Inicio a las 00:00
        max: baseDate.getTime() + 86399999, // Fin a las 23:59:59.999
        tickInterval: 3600000 * 4, // Cada 3 horas
        labels: {
          formatter: function() {
            // Asegurarse de que this.value sea tratado como número
            const timestamp = typeof this.value === 'string' ? parseFloat(this.value) : this.value;
            return Highcharts.dateFormat('%H:%M', timestamp);
          }
        }
      },
      yAxis: {
        title: {
          text: 'Frecuencia (Hz)'
        },
        min: minY,
        max: maxY,
        plotLines: [
          {
            color: 'red', // Color de la línea
            dashStyle: 'Dash', // Línea segmentada (con D mayúscula)
            width: 2, // Grosor de la línea
            value: 50, // Altura de la línea
            label: {
              text: '50 Hz',
              align: 'right',
              style: {
                color: 'red',
                fontWeight: 'bold'
              }
            }
          },
          {
            color: 'red',
            dashStyle: 'Dash',
            width: 2,
            value: 50.7,
            label: {
              text: '50.7 Hz',
              align: 'right',
              style: {
                color: 'red',
                fontWeight: 'bold'
              }
            }
          }
        ]
      },
      tooltip: {
        shared: true,
        headerFormat: '<b>{point.key:%H:%M}</b><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:.2f}</b> Hz<br/>',
        animation: true
      },
      plotOptions: {
        spline: {
          marker: {
            enabledThreshold: 0
          },
          lineWidth: 2 // Grosor de línea consistente
        }
      },
      colors: ['#058DC7'],
      series: seriesData
    };
  }
}
