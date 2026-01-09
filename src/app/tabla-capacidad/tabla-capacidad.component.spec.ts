import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCapacidadComponent } from './tabla-capacidad.component';

describe('TablaCapacidadComponent', () => {
  let component: TablaCapacidadComponent;
  let fixture: ComponentFixture<TablaCapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaCapacidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaCapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
