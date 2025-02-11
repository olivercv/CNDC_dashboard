import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneradaComponent } from './generada.component';

describe('GeneradaComponent', () => {
  let component: GeneradaComponent;
  let fixture: ComponentFixture<GeneradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneradaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
