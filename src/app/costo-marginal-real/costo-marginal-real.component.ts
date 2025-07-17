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
    // Convertir "16.03.2025" a "2025-03-16"
    const parts = dateString.split(".");
    if (parts.length !== 3) {
        console.error("Formato incorrecto:", dateString);
        return "Fecha inválida";
    }

    const [day, month, year] = parts;
    const formattedDate = `${year}-${month}-${day}`; // Formato compatible con Date

    const date = new Date(formattedDate);
    if (isNaN(date.getTime())) {
        console.error("Fecha inválida:", dateString);
        return "Fecha inválida";
    }

    return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
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
        // console.log('FECHA ', formattedDate);
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
      credits: { enabled: false },
      colors: ['#058DC7'],
      series: seriesData
    };
  }
}
