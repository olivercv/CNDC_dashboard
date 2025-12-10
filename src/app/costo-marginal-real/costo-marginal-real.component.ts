import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClient } from '@angular/common/http';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-costo-marginal-real',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './costo-marginal-real.component.html',
  styleUrls: ['./costo-marginal-real.component.css']
})
export class CostoMarginalRealComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  private intervalId: any;

  constructor(private http: HttpClient, private zone: NgZone) {}

  ngOnInit() {
    this.fetchData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  startAutoRefresh() {
    // Puedes activar el refresco automático si quieres
    // this.zone.runOutsideAngular(() => {
    //   this.intervalId = setInterval(() => this.fetchData(), 15000);
    // });
  }

  stopAutoRefresh() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private formatDate(dateString: string): string {
    // Convierte "07.08.2025" en "07/08/2025"
    const parts = dateString.split(".");
    if (parts.length !== 3) {
      console.error("Formato incorrecto:", dateString);
      return "Fecha inválida";
    }

    const [day, month, year] = parts;
    return `${day}/${month}/${year}`;
  }

  fetchData() {
    const fechaApiUrl = 'https://webapi.cndc.bo/WebApiFechas';
    const code = 5; // POSTDESPACHO

    this.http.get<any[]>(fechaApiUrl).subscribe({
      next: (fechas) => {
        const postdespachoDate = fechas.find(f => f.tipo === 'POSTDESPACHO')?.fecha;
        if (!postdespachoDate) return;

        // Crear baseDate en hora UTC a las 00:00
        const [day, month, year] = postdespachoDate.split('.').map(Number);
        const baseDate = Date.UTC(year, month - 1, day, 0, 0, 0); // timestamp en ms UTC

        const formattedDate = this.formatDate(postdespachoDate); // dd/MM/yyyy
        const dataApiUrl = `https://webapi.cndc.bo/WebApi?code=${code}&Fecha=${postdespachoDate}`;

        this.http.get<any[]>(dataApiUrl).subscribe({
          next: (apiData) => {
            const seriesData: any = apiData.map(item => ({
              name: 'CMR',
              type: 'spline',
              lineWidth: 3,
              data: (() => {
                const dataPoints = item.valores.map((val: number, index: number) => {
                  const timestamp = baseDate + index * 3600000;
                  return [timestamp, val];
                });
                const lastTimestamp = baseDate + 23 * 3600000;
                const lastValue = item.valores[item.valores.length - 1];
                dataPoints.push([lastTimestamp + 3600000, lastValue]);
                return dataPoints;
              })(),
              marker: {
                enabled: true,
                symbol: 'circle',
                radius: 2,
                fillColor: '#FFFFFF',
                lineColor: '#058DC7',
                lineWidth: 2
              }
            }));


            this.updateChart(seriesData, formattedDate, baseDate);
          },
          error: (error) => console.error('Error fetching data:', error)
        });
      },
      error: (error) => console.error('Error fetching dates:', error)
    });
  }

  private updateChart(seriesData: Highcharts.SeriesOptionsType[], fecha: string, baseDate: number) {
    const base = baseDate; // Capturar timestamp para closures

   const xAxisOptions: Highcharts.XAxisOptions = {
  title: { text: 'Horas' },
  type: 'datetime',
  min: base,
  max: base + 86400000, // 24 horas en ms
  tickInterval: 3600000 * 3, // una etiqueta cada 3 horas para mejor lectura en móviles
  labels: {
    formatter: function () {
      const date = new Date(this.value);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      if (this.value === base + 86400000) {
        return '24:00';
      }
      return `${hours}:${minutes}`;
    }
  },
  crosshair: { width: 1, color: '#ccc' },
};
  

    this.chartOptions = {
      chart: {
        type: 'spline',
        scrollablePlotArea: { minWidth: 300 }
      },
      title: {
        text: 'Costo Marginal Real'
      },
      subtitle: {
        text: `Fecha: ${fecha}`
      },
      xAxis: xAxisOptions,
      yAxis: {
        title: {
          text: '$us/MWh'
        },
        min: 0
      },
      tooltip: {
        shared: true,
        headerFormat: '<b>{point.key:%H:%M}</b><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:.2f}</b> $us/MWh<br/>',
        animation: true
      },
      plotOptions: {
        spline: {
          marker: {
            enabledThreshold: 0
          },
          lineWidth: 2
        }
      },
      credits: { enabled: false },
      colors: ['#058DC7'],
      series: seriesData
    };
  }
}
