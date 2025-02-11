import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generada',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './generada.component.html',
  styleUrls: ['./generada.component.css']
})
export class GeneradaComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  private intervalId: any; // Para almacenar el ID del intervalo

  constructor(private http: HttpClient) {} // Inyecta HttpClient

  ngOnInit() {
    this.fetchData(); // Primera carga de datos
    this.startAutoRefresh(); // Iniciar la actualización automática
  }

  ngOnDestroy() {
    this.stopAutoRefresh(); // Detener la actualización automática al destruir el componente
  }

  startAutoRefresh() {
    this.intervalId = setInterval(() => {
      this.fetchData(); // Actualizar datos cada 15 segundos
    }, 15000); // 15000 milisegundos = 15 segundos
  }

  stopAutoRefresh() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Detener el intervalo
    }
  }

  fetchData() {
    const fechaApiUrl = 'https://cndcapi.cndc.bo/WebApiFechas';
    const dataApiUrl = 'https://cndcapi.cndc.bo/WebApi?code=0&Fecha=';
  
    // Obtener la fecha actual
    this.http.get<any[]>(fechaApiUrl).subscribe({
      next: (fechas) => {
        const fechaTiempoReal = fechas.find(f => f.tipo === 'TIEMPO_REAL')?.fecha;
        if (fechaTiempoReal) {
          // Obtener los datos con la fecha actual
          this.http.get<any[]>(dataApiUrl + fechaTiempoReal).subscribe({
            next: (data) => {
              // Convertir la fecha de la API a un objeto Date (asumiendo que la fecha es medianoche)
              const baseDate = new Date(fechaTiempoReal.split('.').reverse().join('-')); // Formato DD.MM.YYYY a YYYY-MM-DD
  
              // Transformar los datos para Highcharts
              const seriesData = data.map(item => ({
                name: item.codigo,
                data: item.valores.map((val: number, index: number) => {
                  const timestamp = baseDate.getTime() + (index * 15 * 60 * 1000); // 15 minutos por punto
                  return [timestamp, val === -1 ? null : val]; // Omitir valores -1
                }),
              }));
  
              // Configurar el gráfico
              this.chartOptions = {
                chart: {
                  type: 'line',
                  scrollablePlotArea: {
                    minWidth: 700,
                  },
                },
                title: {
                  text: 'Distribución de Energía por Tipo',
                  align: 'left',
                },
                subtitle: {
                  text: `Fecha: ${fechaTiempoReal}`,
                },
                xAxis: {
                  type: 'datetime', // Usar eje X de tipo fecha/hora
                  min: baseDate.getTime(), // Hora inicial (00:00)
                  max: baseDate.getTime() + 24 * 3600 * 1000, // 24 horas después
                  tickInterval: 3600 * 1000, // Mostrar una etiqueta cada 1 hora (en milisegundos)
                  labels: {
                    format: '{value:%H:%M}', // Formato 24h (ej: "00:00", "01:00", etc.)
                  },
                },
                yAxis: {
                  title: {
                    text: 'Valor',
                  },
                },
                legend: {
                  align: 'left',
                  verticalAlign: 'top',
                },
                series: seriesData.map(item => ({
                  type: 'line',
                  name: item.name,
                  data: item.data,
                })),
              };
            },
            error: (error) => {
              console.error('Error al obtener datos de la API:', error);
            },
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener la fecha:', error);
      },
    });
  }
}