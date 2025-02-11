import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.css']
})
export class TabContainerComponent {
  @Input() tabs: { label: string; component: any }[] = [];
  activeTabIndex = 0;

  selectTab(index: number) {
    this.activeTabIndex = index;
  }
}