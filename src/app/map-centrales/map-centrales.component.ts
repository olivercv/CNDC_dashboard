import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-centrales',
  templateUrl: './map-centrales.component.html',
  styleUrls: ['./map-centrales.component.css']
})
export class MapCentralesComponent implements OnInit {

  circleData: any[] = []; // Datos vacíos inicialmente
  buttons = [
    { id: "btn-red", colorClass: "red" },
    { id: "btn-blue", colorClass: "blue" },
    { id: "btn-yellow", colorClass: "yellow" },
    { id: "btn-green", colorClass: "green" },
    { id: "btn-purple", colorClass: "purple" },
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
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