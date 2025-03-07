import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
type CodigosValidos = 'HIDRO' | 'TERMO' | 'EOL' | 'SOLAR' | 'BAGAZO' | 'TOT';
@Component({
  selector: 'app-map-centrales',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './map-centrales.component.html',
  styleUrls: ['./map-centrales.component.css']
})
export class MapCentralesComponent implements OnInit, OnDestroy {

  circleData: any[] = []; // Datos vacíos inicialmente
  private intervalId: any;
  buttons = [
    { id: "btn-red", colorClass: "red" },
    { id: "btn-blue", colorClass: "blue" },
    { id: "btn-yellow", colorClass: "yellow" },
    { id: "btn-green", colorClass: "green" },
    { id: "btn-purple", colorClass: "purple" },
  ];
  
  
  readonly ordenCodigos: CodigosValidos[] = [
    'HIDRO',
    'TERMO', 
    'EOL',
    'SOLAR',
    'BAGAZO',
    'TOT'
  ];

  posiciones: { [key in CodigosValidos]: number } = {
    HIDRO: 100,
    TERMO: 118,
    EOL: 136,
    SOLAR: 154,
    BAGAZO: 172,
    TOT: 190
  };


  constructor(private http: HttpClient, private zone: NgZone) { }

  ngOnInit(): void {
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

  get processedDataOrdenada(): { codigo: CodigosValidos; valor: number }[] {
    return this.ordenCodigos
      .map(codigo => this.processedData.find(d => d.codigo === codigo))
      .filter((item): item is { codigo: CodigosValidos; valor: number } => !!item);
  }

  get datosOrdenados() {
    return this.ordenCodigos
      .map(codigo => this.processedData.find(d => d.codigo === codigo))
      .filter(item => item) as { codigo: CodigosValidos; valor: number }[];
  }

  private obtenerUltimoValorPositivo(valores: number[]): number {
    const valoresValidos = valores.filter(v => v > 0);
    return valoresValidos.length > 0 ? valoresValidos.slice(-1)[0] : 0;
  }

  // En tu componente
processedData: {codigo: CodigosValidos, valor: number}[] = []; 

private procesarDatos(data: any[]) {
  this.processedData = data
    .filter(item => this.ordenCodigos.includes(item.codigo))
    .map(item => ({
      codigo: item.codigo as CodigosValidos,
      valor: this.obtenerUltimoValorPositivo(item.valores)
    }));
}


// generarElementosDinamicos() {
//   const svg = document.querySelector('svg');
  
//   this.processedData.forEach((item, index) => {
//     const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
//     text.setAttribute('x', '630');
//     text.setAttribute('y', `${100 + (index * 18)}`);
//     text.setAttribute('font-family', 'Arial');
//     text.setAttribute('font-size', '12');
//     text.setAttribute('font-weight', '500');
    
//     const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
//     tspan.textContent = `${item.valor.toLocaleString('en-US', {maximumFractionDigits: 2})} Mw`;
    
//     text.appendChild(tspan);
//     svg?.appendChild(text);
//   });
// }

  fetchData() {

    const fechaApiUrl = 'https://cndcapi.cndc.bo/WebApiFechas';
    const dataApiUrl = 'https://cndcapi.cndc.bo/WebApi?code=0&Fecha=';

    this.http.get<any[]>(fechaApiUrl).subscribe({
      next: (fechas) => {
        const fechaTiempoReal = fechas.find(f => f.tipo === 'TIEMPO_REAL')?.fecha;
        if (!fechaTiempoReal) return;

        this.http.get<any[]>(dataApiUrl + fechaTiempoReal).subscribe({
          next: (data) => {
            this.processedData = data
              .filter(item => this.ordenCodigos.includes(item.codigo))
              .map(item => ({
                codigo: item.codigo as CodigosValidos,
                valor: this.obtenerUltimoValorPositivo(item.valores)
              }));
          }
        });
      }  
    });
        



    this.http.get<any[]>('https://190.181.35.6:5000/WebApiGeneradores')
      .subscribe({
        next: (data) => {
          this.circleData = data;
          this.createCircles();
          this.setupEventListeners();
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });
  }

  createCircles(): void {
    const svg = document.querySelector('#map-svg');
    // Limpiar círculos existentes
    // svg?.querySelectorAll('circle').forEach(circle => circle.remove());
    
    this.circleData.forEach(({ cx, cy, r, fill, class: className, dataInfo, 
      potencia_activa, potencia_reactiva, capacidad_instalada }) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx.toString());
      circle.setAttribute("cy", cy.toString());
      circle.setAttribute("r", r.toString());
      circle.setAttribute("fill", fill);
      circle.setAttribute("class", className);
      circle.setAttribute("data-info", dataInfo);
      circle.setAttribute("potencia_activa", potencia_activa);
      circle.setAttribute("potencia_reactiva", potencia_reactiva);
      circle.setAttribute("capacidad_instalada", capacidad_instalada);
      svg?.appendChild(circle);
    });
  }

  setupEventListeners(): void {
    const svg = document.querySelector('#map-svg');
    const tooltip = document.getElementById('tooltip');
  
    if (svg && tooltip) {
      svg.addEventListener('mouseover', (event: Event) => {
        const target = event.target as SVGElement;
        if (target.tagName === 'circle') {
          const info = target.getAttribute('data-info');
          const potencia_activa = target.getAttribute('potencia_activa');
          const potencia_reactiva = target.getAttribute('potencia_reactiva');
          const capacidad_instalada = target.getAttribute('capacidad_instalada');
          if (info) {
            tooltip.innerHTML = `<b>${info}</b><br><b>Potencia activa: </b>${potencia_activa} <br>
            <b>Potencia reactiva: </b> ${potencia_reactiva} <br> 
            <b>Capacidad instalada: </b>${capacidad_instalada || ''}`;
            tooltip.style.opacity = '1';
          }
        }
      });

      svg.addEventListener('mousemove', (event: Event) => {
        const mouseEvent = event as MouseEvent;
        tooltip.style.left = `${mouseEvent.pageX + 10}px`;
        tooltip.style.top = `${mouseEvent.pageY + 10}px`;
      });

      svg.addEventListener('mouseout', () => {
        tooltip.style.opacity = '0';
      });
    }

    this.buttons.forEach(button => {
      const btnElement = document.getElementById(button.id);
      if (btnElement) {
        btnElement.addEventListener('click', () => {
          const circlesByColor = document.querySelectorAll(`.${button.colorClass}`);
          circlesByColor.forEach(circle => {
            circle.classList.toggle('hidden');
          });
          btnElement.classList.toggle('transparent-button');
        });
      }
    });
  }
}