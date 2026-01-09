import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCapacidadComponent } from './table-capacidad.component';

describe('TableCapacidadComponent', () => {
  let component: TableCapacidadComponent;
  let fixture: ComponentFixture<TableCapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCapacidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
