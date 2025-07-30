import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClient } from '@angular/common/http';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-injectada',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './injectada.component.html',
  styleUrls: ['./injectada.component.css'],
})
export class InjectadaComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  private intervalId: any;

  private styles: {
    name: string;
    dashStyle: 'Solid' | 'Dash' | 'Dot';
    realName: string;
    color: string;
  }[] = [
    // Estilos personalizados
    { name: 'TERMO', dashStyle: 'Solid', realName: 'Termoeléctrica', color: '#E3371E'},
    { name: 'HIDRO', dashStyle: 'Solid', realName: 'Hidroeléctrica', color: '#3188e5'},
    { name: 'SOLAR', dashStyle: 'Solid', realName: 'Solar', color: '#fab610' },
    { name: 'EOL', dashStyle: 'Solid', realName: 'Eólica', color: '#103778' },
    { name: 'BAGAZO', dashStyle: 'Solid', realName: 'Bagazo', color: '#A6BC09'},
    { name: 'SIS', dashStyle: 'Solid', realName: 'Total', color: '#CACACA' },
  ];

  constructor(private http: HttpClient, private zone: NgZone) {}

  ngOnInit() {
    this.fetchData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  startAutoRefresh() {
    this.zone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => this.fetchData(), 15000);
    });
  }

  stopAutoRefresh() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  fetchData() {
    const fechaApiUrl = 'https://cndcapi.cndc.bo/WebApiFechas';
    const dataApiUrl = 'https://cndcapi.cndc.bo/WebApi?code=6&Fecha=';

    this.http.get<any[]>(fechaApiUrl).subscribe({
      next: (fechas) => {
        const fechaTiempoReal = fechas.find(
          (f) => f.tipo === 'POSTDESPACHO'
        )?.fecha;
        if (!fechaTiempoReal) return;

        this.http.get<any[]>(dataApiUrl + fechaTiempoReal).subscribe({
          next: (data) => {
            const baseDate = new Date(
              fechaTiempoReal.split('.').reverse().join('-')
            );
            if (isNaN(baseDate.getTime())) {
              console.error('Fecha inválida:', fechaTiempoReal);
              return;
            }

            let seriesData = data.map((item) => ({
              name: item.codigo,
              data: item.valores.map((val: number, index: number) => {
                const timestamp = baseDate.getTime() + index * 900000 * 4; // 15 minutos en ms (15 * 60 * 1000)
                return [timestamp, val === -1 ? null : val];
              }),
            }));

            // Ordenar las series según el vector de estilos
            seriesData.sort((a, b) => {
              const indexA = this.styles.findIndex((s) => s.name === a.name);
              const indexB = this.styles.findIndex((s) => s.name === b.name);
              return indexA - indexB;
            });
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
                type: 'area',
                scrollablePlotArea: { minWidth: 700 },
              },
              title: { text: 'Energía Inyectada', align: 'center' },
              subtitle: { text: `Datos en Fecha: ${fechaTiempoReal}` },
              xAxis: xAxisOptions,
              yAxis: { title: { text: 'MWh' } },
              credits: { enabled: false },
              legend: { align: 'center', verticalAlign: 'bottom' },
              tooltip: {
                shared: true,
                headerFormat: '<b>{point.key:%H:%M}</b><br/>',
                pointFormat:
                  '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b> MW<br/>',
                animation: false, // Desactiva animaciones innecesarias
              },
              plotOptions: {
                area: {
                  pointStart: 1940,
                  marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                      hover: {
                        enabled: true,
                      },
                    },
                  },
                },
              },
              boost: {
                enabled: true,
                useGPUTranslations: true,
                allowForce: true,
              },
              series: seriesData.map((item) => {
                const style = this.styles.find((s) => s.name === item.name) || {
                  dashStyle: 'Solid',
                  realName: item.name,
                  color: '#000000',
                };
                return {
                  type: 'area',
                  name: style.realName,
                  data: item.data,
                  color: style.color, // Asignar color desde el objeto de estilos
                  dashStyle: style.dashStyle, // Asignar estilo desde el objeto de estilos
                  marker: {
                    symbol: 'circle', // Asegurarse de que cada serie use círculos
                    radius: 0, // El tamaño predeterminado del marcador es 0 (sin marcadores)
                    states: {
                      hover: {
                        radius: 3, // Tamaño del círculo en hover (puedes cambiar el valor)
                      },
                    },
                  },
                };
              }),
            };

            // Forzar actualización del gráfico
            this.chartOptions = { ...this.chartOptions };
          },
          error: (error) => console.error('Error en datos:', error),
        });
      },
      error: (error) => console.error('Error en fecha:', error),
    });
  }
}
