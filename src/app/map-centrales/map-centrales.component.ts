import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-centrales',
  templateUrl: './map-centrales.component.html',
  styleUrls: ['./map-centrales.component.css']
})
export class MapCentralesComponent implements OnInit {

  circleData = [
    { "cx": 337.24, "cy": 306.70, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador A", "potencia_activa": "2.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "3.000 MW"},
    { "cx": 210.73, "cy": 298.18, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador B", "potencia_activa": "3.000 MW", "potencia_reactiva": "2.000 Mvar", "capacidad_instalada": "5.000 MW" },
    { "cx": 175.35, "cy": 395.38, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador C", "potencia_activa": "4.000 MW", "potencia_reactiva": "3.000 Mvar", "capacidad_instalada": "6.000 MW" },
    { "cx": 289.64, "cy": 475.68, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador D", "potencia_activa": "1.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "7.000 MW" },
    { "cx": 359.48, "cy": 448.89, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador E", "potencia_activa": "5.000 MW", "potencia_reactiva": "5.000 Mvar", "capacidad_instalada": "10.000 MW" },
    { "cx": 344.36, "cy": 558.00, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador F", "potencia_activa": "3.000 MW", "potencia_reactiva": "2.000 Mvar", "capacidad_instalada": "6.000 MW" },
    { "cx": 414.50, "cy": 690.23, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador G", "potencia_activa": "1.000 MW", "potencia_reactiva": "3.000 Mvar", "capacidad_instalada": "7.000 MW" },
    { "cx": 468.25, "cy": 461.37, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador H", "potencia_activa": "2.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "8.000 MW" },
    { "cx": 462.65, "cy": 475.68, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador I", "potencia_activa": "6.000 MW", "potencia_reactiva": "6.000 Mvar", "capacidad_instalada": "6.000 MW" },
    { "cx": 475.25, "cy": 500.35, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador J", "potencia_activa": "3.000 MW", "potencia_reactiva": "8.000 Mvar", "capacidad_instalada": "3.000 MW" },
    { "cx": 464.65, "cy": 491.35, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador K", "potencia_activa": "2.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "8.000 MW" },
    { "cx": 163.02, "cy": 366.00, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador L", "potencia_activa": "1.000 MW", "potencia_reactiva": "2.000 Mvar", "capacidad_instalada": "9.000 MW" },
    { "cx": 195.05, "cy": 381.34, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador M", "potencia_activa": "2.000 MW", "potencia_reactiva": "2.000 Mvar", "capacidad_instalada": "3.000 MW" },
    { "cx": 211.73, "cy": 423.75, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador O", "potencia_activa": "4.000 MW", "potencia_reactiva": "5.000 Mvar", "capacidad_instalada": "11.000 MW" },
    { "cx": 240.83, "cy": 449.63, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador P", "potencia_activa": "4.000 MW", "potencia_reactiva": "2.000 Mvar", "capacidad_instalada": "13.000 MW" },
    { "cx": 276.67, "cy": 455.22, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador Q", "potencia_activa": "2.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "4.000 MW" },
    { "cx": 292.14, "cy": 455.22, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador L", "potencia_activa": "1.000 MW", "potencia_reactiva": "6.000 Mvar", "capacidad_instalada": "4.000 MW" },
    { "cx": 299.47, "cy": 446.81, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador M", "potencia_activa": "3.000 MW", "potencia_reactiva": "2.000 Mvar", "capacidad_instalada": "5.000 MW" },
    { "cx": 270.25, "cy": 446.81, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador N", "potencia_activa": "6.000 MW", "potencia_reactiva": "5.000 Mvar", "capacidad_instalada": "6.000 MW" },
    { "cx": 369.22, "cy": 673.02, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador O", "potencia_activa": "3.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "8.000 MW" },
    { "cx": 226.82, "cy": 485.75, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador P", "potencia_activa": "4.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "9.000 MW" },
    { "cx": 232.42, "cy": 655.88, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador Q", "potencia_activa": "5.000 MW", "potencia_reactiva": "5.000 Mvar", "capacidad_instalada": "7.000 MW" },
    { "cx": 367.49, "cy": 691.95, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador R", "potencia_activa": "5.000 MW", "potencia_reactiva": "2.000 Mvar", "capacidad_instalada": "8.000 MW" },
    { "cx": 327.90, "cy": 475.70, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador S", "potencia_activa": "2.000 MW", "potencia_reactiva": "3.000 Mvar", "capacidad_instalada": "9.000 MW" },
    { "cx": 468.71, "cy": 538.27, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador T", "potencia_activa": "1.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "6.000 MW" },
    { "cx": 496.70, "cy": 524.02, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador U", "potencia_activa": "3.000 MW", "potencia_reactiva": "2.000 Mvar", "capacidad_instalada": "5.000 MW" },
    { "cx": 502.29, "cy": 496.95, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador V", "potencia_activa": "6.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "8.000 MW" },
    { "cx": 415.29, "cy": 496.95, "r": 7, "fill": "#c634eb", "class": "circle purple", "dataInfo": "Generador w", "potencia_activa": "6.000 MW", "potencia_reactiva": "1.000 Mvar", "capacidad_instalada": "8.000 MW" }
  ];

  buttons = [
    { id: "btn-red", colorClass: "red" },
    { id: "btn-blue", colorClass: "blue" },
    { id: "btn-yellow", colorClass: "yellow" },
    { id: "btn-green", colorClass: "green" },
    { id: "btn-purple", colorClass: "purple" },
  ];

  constructor() { }

  ngOnInit(): void {
    this.createCircles();
    this.setupEventListeners();
  }

  createCircles(): void {
    const svg = document.querySelector('#map-svg');
    this.circleData.forEach(({ cx, cy, r, fill, class: className, dataInfo, potencia_activa, potencia_reactiva, capacidad_instalada }) => {
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
            tooltip.innerHTML = `<b>${info}</b><br><b>Potencia activa: </b>${potencia_activa} <br><b>Potencia reactiva: </b> ${potencia_reactiva} <br> <b>Capacidad instalada: </b>${capacidad_instalada || ''}`;
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