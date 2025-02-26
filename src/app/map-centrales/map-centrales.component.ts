import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-centrales',
  templateUrl: './map-centrales.component.html',
  styleUrls: ['./map-centrales.component.css']
})
export class MapCentralesComponent implements OnInit {

  circleData = [
    { "cx": 337.24, "cy": 306.70, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador A - Potencia Activa: 2.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 2.800 MW" },
          { "cx": 210.73, "cy": 298.18, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador B - Potencia Activa: 1.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 2.800 MW" },
          { "cx": 175.35, "cy": 395.38, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador C - Potencia Activa: 6.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 3.100 MW" },
          { "cx": 289.64, "cy": 475.68, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador D - Potencia Activa: 1.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 1.500 MW" },
          { "cx": 359.48, "cy": 448.89, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador E - Potencia Activa: 4.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 3.600 MW" },
          { "cx": 344.36, "cy": 558.00, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador F - Potencia Activa: 3.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 6.700 MW" },
          { "cx": 414.50, "cy": 690.23, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador G - Potencia Activa: 9.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 5.300 MW" },
          { "cx": 468.25, "cy": 461.37, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador H - Potencia Activa: 5.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 3.400 MW" },
          { "cx": 462.65, "cy": 475.68, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador I - Potencia Activa: 6.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 7.500 MW" },
          { "cx": 475.25, "cy": 500.35, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador J - Potencia Activa: 3.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 4.600 MW" },
          { "cx": 464.65, "cy": 491.35, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador K - Potencia Activa: 6.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 3.800 MW" },
          { "cx": 163.02, "cy": 366.00, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador L - Potencia Activa: 8.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 9.300 MW" },
          { "cx": 195.05, "cy": 381.34, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador M - Potencia Activa: 7.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 5.200 MW" },
          { "cx": 211.73, "cy": 423.75, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador O - Potencia Activa: 4.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 6.000 MW" },
          { "cx": 240.83, "cy": 449.63, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador P - Potencia Activa: 3.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 7.100 MW" },
          { "cx": 276.67, "cy": 455.22, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador Q - Potencia Activa: 2.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 8.300 MW" },
          { "cx": 292.14, "cy": 455.22, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador L - Potencia Activa: 4.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 3.500 MW" },
          { "cx": 299.47, "cy": 446.81, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador M - Potencia Activa: 6.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 7.8=600 MW" },
          { "cx": 270.25, "cy": 446.81, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador N - Potencia Activa: 4.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 5.800 MW" },
          { "cx": 369.22, "cy": 673.02, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador O - Potencia Activa: 3.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 4.600 MW" },
          { "cx": 226.82, "cy": 485.75, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador P - Potencia Activa: 1.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 3.200 MW" },
          { "cx": 232.42, "cy": 655.88, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador Q - Potencia Activa: 8.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 2.900 MW" },
          { "cx": 367.49, "cy": 691.95, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador R - Potencia Activa: 6.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 1.400 MW" },
          { "cx": 327.90, "cy": 475.70, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador S - Potencia Activa: 3.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 6.300 MW" },
          { "cx": 468.71, "cy": 538.27, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador T - Potencia Activa: 1.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 1.500 MW" },
          { "cx": 496.70, "cy": 524.02, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador U - Potencia Activa: 5.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 5.600 MW" },
          { "cx": 502.29, "cy": 496.95, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador V - Potencia Activa: 2.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 3.500 MW" }
  ];

  buttons = [
    { id: "btn-red", colorClass: "red" },
    { id: "btn-blue", colorClass: "blue" },
    { id: "btn-yellow", colorClass: "yellow" },
    { id: "btn-green", colorClass: "green" },
  ];

  constructor() { }

  ngOnInit(): void {
    this.createCircles();
    this.setupEventListeners();
  }

  createCircles(): void {
    const svg = document.querySelector('#map-svg');
    this.circleData.forEach(({ cx, cy, r, fill, class: className, dataInfo }) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx.toString());
      circle.setAttribute("cy", cy.toString());
      circle.setAttribute("r", r.toString());
      circle.setAttribute("fill", fill);
      circle.setAttribute("class", className);
      circle.setAttribute("data-info", dataInfo);
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
          if (info) {
            tooltip.innerHTML = `<b>${info.split(' - ')[0]}</b><br>${info.split(' - ')[1]} <br> ${info.split(' - ')[2]} <br> ${info.split(' - ')[3] || ''}`;
            tooltip.style.opacity = '1';
          }
        }
      });
  
      svg.addEventListener('mousemove', (event: Event) => {
        const mouseEvent = event as MouseEvent; // Type casting a MouseEvent
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