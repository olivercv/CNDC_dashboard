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
  const fechaApiUrl = 'https://cndcapi.cndc.bo/WebApiFechas';
  const code = 5; // POSTDESPACHO

  this.http.get<any[]>(fechaApiUrl).subscribe({
    next: (fechas) => {
      const postdespachoDate = fechas.find(f => f.tipo === 'POSTDESPACHO')?.fecha;
      if (!postdespachoDate) return;

      // Crear baseDate en hora local
      const [day, month, year] = postdespachoDate.split('.').map(Number);
      const baseDate = new Date(year, month - 1, day, 0, 0, 0, 0); // Local

      const formattedDate = this.formatDate(postdespachoDate); // dd/MM/yyyy
      const dataApiUrl = `https://cndcapi.cndc.bo/WebApi?code=${code}&Fecha=${formattedDate}`;

      this.http.get<any[]>(dataApiUrl).subscribe({
        next: (apiData) => {
          const seriesData: any = apiData.map(item => ({
            name: 'CMR',
            type: 'spline',
            lineWidth: 3,
            data: item.valores.map((val: number, index: number) => {
              const timestamp = baseDate.getTime() + (index * 3600000);
              return [timestamp, val];
            }),
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

  
  private updateChart(seriesData: Highcharts.SeriesOptionsType[], fecha: string, baseDate: Date) {
    const xAxisOptions: Highcharts.XAxisOptions = {
      title: { text: 'Horas' },
      type: 'datetime',
      min: baseDate.getTime(), // Eliminamos el ajuste de +900000 para empezar en 00:00 exacto
      max: baseDate.getTime() + 86400000, // 24 horas después
      labels: {
        format: '{value:%H:%M}',
        formatter: function (
          this: Highcharts.AxisLabelsFormatterContextObject
        ) {
          const date = new Date(Number(this.value));
          // Mostrar 24:00 en el último tick
          if (date.getTime() === baseDate.getTime() + 86400000) {
            return '24:00';
          }
          return Highcharts.dateFormat('%H:%M', Number(this.value));
        },
      },
      crosshair: { width: 1, color: '#ccc' },
      tickPositioner: ((min: number, max: number) => {
        const positions: number[] = [];
        const interval = 3600000 * 3;

        positions.push(min);

        for (let i = min + interval; i < max; i += interval) {
          positions.push(i);
        }
        positions.push(max);
        return positions;
      }) as Highcharts.AxisTickPositionerCallbackFunction,
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
          lineWidth: 2 // Grosor de línea consistente
        }
      },
      credits: { enabled: false },
      colors: ['#058DC7'],
      series: seriesData
    };
  }
}
