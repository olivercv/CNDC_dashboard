import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjectadaComponent } from './injectada.component';

describe('InjectadaComponent', () => {
  let component: InjectadaComponent;
  let fixture: ComponentFixture<InjectadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InjectadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InjectadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
