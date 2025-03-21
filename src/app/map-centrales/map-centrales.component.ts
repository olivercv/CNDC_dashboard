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
    'TERMO',
    'HIDRO', 
    'EOL',
    'SOLAR',
    'BAGAZO',
    'TOT'
  ];

  posiciones: { [key in CodigosValidos]: number } = {
    TERMO: 100,
    HIDRO: 118,
    EOL: 136,
    SOLAR: 154,
    BAGAZO: 172,
    TOT: 190
  };


  constructor(private http: HttpClient, private zone: NgZone) { }

  ngOnInit(): void {
    // this.fetchGenerators();
    this.loadFallbackData();
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

  fetchGenerators() {
    this.http.get<any[]>('https://190.181.35.6:5000/WebApiGeneradores')
      .subscribe({
        next: (data) => {
          this.circleData = data;
          this.createCircles();
          this.setupEventListeners();
        },
        error: (error) => {
          console.error('Error fetching Generators:', error);
        }
      });

  }

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

  private loadFallbackData(): void {
    this.circleData = [
      
          { "cx": 474, "cy": 537, "r": 5, "fill": "#7ed957", "class": "circle green", "dataInfo": "Central Eólica El Dorado", "potencia_activa": "1.000 MW", "potencia_reactiva": "500 MVAR", "capacidad_instalada": "2.000 MW" },
          { "cx": 476, "cy": 470, "r": 5, "fill": "#7ed957", "class": "circle green", "dataInfo": "Central Eólica Warnes", "potencia_activa": "1.200 MW", "potencia_reactiva": "800 MVAR", "capacidad_instalada": "1.500 MW"},
          { "cx": 332, "cy": 483, "r": 5, "fill": "#7ed957", "class": "circle green", "dataInfo": "Celtral Qollpana", "potencia_activa": "900 MW", "potencia_reactiva": "600 MVAR", "capacidad_instalada": "1.000 MW" },
          { "cx": 500, "cy": 500, "r": 5, "fill": "#7ed957", "class": "circle green", "dataInfo": "Central Eólica San Julián", "potencia_activa": "750 MW", "potencia_reactiva": "300 MVAR", "capacidad_instalada": "1.000 MW" },

          { "cx": 220, "cy": 439, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL ANGOSTURA", "potencia_activa": "2.000 MW", "potencia_reactiva": "1.600 MVAR", "capacidad_instalada": "5.000 MW" },
          { "cx": 155, "cy": 378, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL BOTIJLACA", "potencia_activa": "1.000 MW", "potencia_reactiva": "1.900 MVAR", "capacidad_instalada": "8.000 MW" },
          { "cx": 165, "cy": 338, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL CAHUA", "potencia_activa": "3.000 MW", "potencia_reactiva": "2.000 MVAR", "capacidad_instalada": "9.000 MW" },
          { "cx": 195, "cy": 404, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL CHOJLLA", "potencia_activa": "5.000 MW", "potencia_reactiva": "3.200 MVAR", "capacidad_instalada": "8.000 MW" },
          { "cx": 224, "cy": 434, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL CHOQUETANGA", "potencia_activa": "4.000 MW", "potencia_reactiva": "2.000 MVAR", "capacidad_instalada": "3.000 MW" },
          { "cx": 161, "cy": 348, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL CHURURAQUI", "potencia_activa": "2.300 MW", "potencia_reactiva": "3.000 MVAR", "capacidad_instalada": "11.000 MW" },
          { "cx": 308, "cy": 453, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL CORANI", "potencia_activa": "6.100 MW", "potencia_reactiva": "5.000 MVAR", "capacidad_instalada": "12.000 MW" },
          { "cx": 226, "cy": 425, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL CARABUCO", "potencia_activa": "1.800 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "5.000 MW" },
          { "cx": 158, "cy": 373, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL CUTICUCHO", "potencia_activa": "6.500 MW", "potencia_reactiva": "2.000 MVAR", "capacidad_instalada": "7.000 MW" },
          { "cx": 166, "cy": 344, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL HARCA", "potencia_activa": "2.800 MW", "potencia_reactiva": "1.200 MVAR", "capacidad_instalada": "8.000 MW" },
          { "cx": 171, "cy": 333, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL HUAJI", "potencia_activa": "2.600 MW", "potencia_reactiva": "1.300 MVAR", "capacidad_instalada": "15.000 MW" },
          { "cx": 285, "cy": 450, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL KANATA", "potencia_activa": "4.600 MW", "potencia_reactiva": "1.800 MVAR", "capacidad_instalada": "8.000 MW" },
          { "cx": 292, "cy": 565, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL KILPANI", "potencia_activa": "4.500 MW", "potencia_reactiva": "1.600 MVAR", "capacidad_instalada": "9.000 MW" },
          { "cx": 292, "cy": 571, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL LANDARA", "potencia_activa": "3.300 MW", "potencia_reactiva": "1.500 MVAR", "capacidad_instalada": "11.000 MW" },
          { "cx": 219, "cy": 446, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL MIGUILLAS", "potencia_activa": "3.800 MW", "potencia_reactiva": "2.300 MVAR", "capacidad_instalada": "12.000 MW" },
          { "cx": 279, "cy": 450, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL MISICUNI", "potencia_activa": "3.700 MW", "potencia_reactiva": "3.350 MVAR", "capacidad_instalada": "13.000 MW" },
          { "cx": 306, "cy": 596, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL PUNUTUMA", "potencia_activa": "2.600 MW", "potencia_reactiva": "4.000 MVAR", "capacidad_instalada": "23.000 MW" },
          { "cx": 249, "cy": 457, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL QUEHATA", "potencia_activa": "8.600 MW", "potencia_reactiva": "1.500 MVAR", "capacidad_instalada": "13.000 MW" },
          { "cx": 162, "cy": 358, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL SAINANI", "potencia_activa": "3.500 MW", "potencia_reactiva": "1.800 MVAR", "capacidad_instalada": "7.000 MW" },
          { "cx": 315, "cy": 451, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL SANTA ISABEL", "potencia_activa": "5.200 MW", "potencia_reactiva": "2.200 MVAR", "capacidad_instalada": "9.000 MW" },
          { "cx": 365, "cy": 679, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL SAN JACINTO", "potencia_activa": "7.300 MW", "potencia_reactiva": "1.200 MVAR", "capacidad_instalada": "10.000 MW" },
          { "cx": 321, "cy": 443, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL SAN JOSÉ II", "potencia_activa": "4.200 MW", "potencia_reactiva": "1.900 MVAR", "capacidad_instalada": "11.000 MW" },
          { "cx": 320, "cy": 449, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL SAN JOSÉ I", "potencia_activa": "2.200 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "6.000 MW" },
          { "cx": 157, "cy": 364, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL SANTA ROSA", "potencia_activa": "3.300 MW", "potencia_reactiva": "1.700 MVAR", "capacidad_instalada": "9.000 MW" },
          { "cx": 161, "cy": 385, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL TIQUIMANI", "potencia_activa": "1.300 MW", "potencia_reactiva": "2.800 MVAR", "capacidad_instalada": "10.000 MW" },
          { "cx": 199, "cy": 400, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL YANACACHI", "potencia_activa": "7.500 MW", "potencia_reactiva": "5.000 MVAR", "capacidad_instalada": "7.000 MW" },
          { "cx": 164, "cy": 390, "r": 5, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "CENTRAL ZONGO", "potencia_activa": "7.500 MW", "potencia_reactiva": "2.200 MVAR", "capacidad_instalada": "9.000 MW" },

          { "cx": 171, "cy": 418, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL EL ALTO", "potencia_activa": "4.300 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "8.000 MW" },
          { "cx": 357, "cy": 566, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL ARANJUEZ", "potencia_activa": "5.300 MW", "potencia_reactiva": "1.300 MVAR", "capacidad_instalada": "9.000 MW" },
          { "cx": 367, "cy": 492, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL BULO BULO", "potencia_activa": "6.200 MW", "potencia_reactiva": "1.200 MVAR", "capacidad_instalada": "9.000 MW" },
          { "cx": 361, "cy": 455, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL CARRASCO", "potencia_activa": "6.100 MW", "potencia_reactiva": "1.600 MVAR", "capacidad_instalada": "11.000 MW" },
          { "cx": 358, "cy": 450, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL ENTRE RÍOS", "potencia_activa": "2.300 MW", "potencia_reactiva": "2.000 MVAR", "capacidad_instalada": "7.000 MW" },
          { "cx": 457, "cy": 455, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL TERMOELÉCTRICA GUABIRÁ S.A.", "potencia_activa": "3.000 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "3.000 MW" },
          { "cx": 475, "cy": 505, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL GUARACACHI", "potencia_activa": "4.900 MW", "potencia_reactiva": "3.000 MVAR", "capacidad_instalada": "10.000 MW" },
          { "cx": 325, "cy": 297, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL MOXOS", "potencia_activa": "5.700 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "13.000 MW" },
          { "cx": 210, "cy": 299, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL TERMOELÉCTRICA SAN BUENAVENTURA", "potencia_activa": "3.000 MW", "potencia_reactiva": "1.900 MVAR", "capacidad_instalada": "14.000 MW" },
          { "cx": 475, "cy": 499, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL SANTA CRUZ", "potencia_activa": "5.050 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "14.000 MW" },
          { "cx": 411, "cy": 678, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL TERMOELECTRICA DEL SUR", "potencia_activa": "5.200 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "15.000 MW" },
          { "cx": 458, "cy": 436, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL TERMOELECTRICA UNAGRO", "potencia_activa": "4.300 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "9.000 MW" },
          { "cx": 306, "cy": 474, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL VALLE HERMOSO", "potencia_activa": "4.500 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "9.000 MW" },
          { "cx": 473, "cy": 474, "r": 5, "fill": "#ff3131", "class": "circle red", "dataInfo": "CENTRAL WARNES", "potencia_activa": "2.500 MW", "potencia_reactiva": "1.000 MVAR", "capacidad_instalada": "8.000 MW" },

    ];
    this.createCircles();
    this.setupEventListeners();

  }
}