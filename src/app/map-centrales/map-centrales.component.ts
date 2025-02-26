import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-centrales',
  templateUrl: './map-centrales.component.html',
  styleUrls: ['./map-centrales.component.css']
})
export class MapCentralesComponent implements OnInit {

  circleData = [
    { "cx": 337.24, "cy": 306.70, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador A - Potencia Activa: 2.000 MW - Potencia reactiva: 9000 Mvar - Capacidad instalada: 2.800 MW" },
          { "cx": 210.73, "cy": 298.18, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador B" },
          { "cx": 175.35, "cy": 395.38, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador C" },
          { "cx": 289.64, "cy": 475.68, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador D" },
          { "cx": 359.48, "cy": 448.89, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador E" },
          { "cx": 344.36, "cy": 558.00, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador F" },
          { "cx": 414.50, "cy": 690.23, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador G" },
          { "cx": 468.25, "cy": 461.37, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador H" },
          { "cx": 462.65, "cy": 475.68, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador I" },
          { "cx": 475.25, "cy": 500.35, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador J" },
          { "cx": 464.65, "cy": 491.35, "r": 7, "fill": "#ff3131", "class": "circle red", "dataInfo": "Generador K" },
          { "cx": 163.02, "cy": 366.00, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador L" },
          { "cx": 195.05, "cy": 381.34, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador M" },
          { "cx": 211.73, "cy": 423.75, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador O" },
          { "cx": 240.83, "cy": 449.63, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador P" },
          { "cx": 276.67, "cy": 455.22, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador Q" },
          { "cx": 292.14, "cy": 455.22, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador L" },
          { "cx": 299.47, "cy": 446.81, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador M" },
          { "cx": 270.25, "cy": 446.81, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador N" },
          { "cx": 369.22, "cy": 673.02, "r": 7, "fill": "#38b6ff", "class": "circle blue", "dataInfo": "Generador O" },
          { "cx": 226.82, "cy": 485.75, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador P" },
          { "cx": 232.42, "cy": 655.88, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador Q" },
          { "cx": 367.49, "cy": 691.95, "r": 7, "fill": "#ffde59", "class": "circle yellow", "dataInfo": "Generador R" },
          { "cx": 327.90, "cy": 475.70, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador S" },
          { "cx": 468.71, "cy": 538.27, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador T" },
          { "cx": 496.70, "cy": 524.02, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador U" },
          { "cx": 502.29, "cy": 496.95, "r": 7, "fill": "#7ed957", "class": "circle green", "dataInfo": "Generador V" }
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