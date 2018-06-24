import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDataComponent } from './accounting-data.component';

describe('FinancialDataComponent', () => {
  let component: FinancialDataComponent;
  let fixture: ComponentFixture<FinancialDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialDataComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
