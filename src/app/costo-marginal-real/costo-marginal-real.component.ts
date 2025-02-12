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
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}.${date.getFullYear()}`;
  }

  fetchData() {
    const fechaApiUrl = 'https://cndcapi.cndc.bo/WebApiFechas';
    const code = 5; // Código para POSTDESPACHO
  
    this.http.get<any[]>(fechaApiUrl).subscribe({
      next: (fechas) => {
        const postdespachoDate = fechas.find(f => f.tipo === 'POSTDESPACHO')?.fecha;
        if (!postdespachoDate) return;
        
        // Ajustar baseDate a las 00:00 del día
        const baseDate = new Date(postdespachoDate.split('.').reverse().join('-'));
        baseDate.setUTCHours(0, 0, 0, 0); // Fijar a medianoche en UTC
        
        const formattedDate = this.formatDate(postdespachoDate);
        const dataApiUrl = `https://cndcapi.cndc.bo/WebApi?code=${code}&Fecha=${formattedDate}`;
  
        this.http.get<any[]>(dataApiUrl).subscribe({
          next: (apiData) => {
            const seriesData: any = apiData.map(item => ({
              name: item.codigo.toUpperCase(),
              type: 'spline',
              lineWidth: 3, // Grosor de línea aumentado
              data: item.valores.map((val: number, index: number) => {
                const timestamp = baseDate.getTime() + (index * 3600000); // Intervalos de 1 hora
                return [timestamp, val];
              }),
              marker: {
                enabled: true, // Asegurar que los marcadores estén habilitados
                symbol: 'circle',
                radius: 2, // Tamaño aumentado
                fillColor: '#FFFFFF',
                lineColor: '#058DC7', // Color del borde igual a la serie
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
        tickInterval: 3600000 * 3, // Cada 3 horas
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
          text: 'MW'
        },
        min: 0
      },
      tooltip: {
        shared: true,
        headerFormat: '<b>{point.key:%H:%M}</b><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:.2f}</b> MW<br/>',
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
