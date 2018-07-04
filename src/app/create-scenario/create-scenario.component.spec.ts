import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { CreateScenarioComponent } from './create-scenario.component';
import { AccountingDataComponent } from '../accounting-data/accounting-data.component';
import { ScenariosService } from '../service/scenarios.service';


describe('CreateScenarioComponent', () => {
  let component: CreateScenarioComponent;
  let fixture: ComponentFixture<CreateScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateScenarioComponent, AccountingDataComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: { navigate() { return true; } } },
        { provide: ScenariosService, useValue: undefined },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly find out if a point is outside the time series\' bounds', () => {
    const testData = [
      {
        parameters: [
          false,
          { year: 1000, quarter: 2 },
          { year: 1001, quarter: 1 },
          { year: 1000, quarter: 1 }],
        result: true,
      },
      {
        parameters: [
          false,
          { year: 1000, quarter: 1 },
          { year: 1001, quarter: 1 },
          { year: 1001, quarter: 2 }],
        result: true,
      },
      {
        parameters: [
          false,
          { year: 1000, quarter: 1 },
          { year: 1001, quarter: 1 },
          { year: 1002, quarter: 1 }],
        result: false,
      },
      {
        parameters: [
          false,
          { year: 1000, quarter: 1 },
          { year: 1001, quarter: 1 },
          { year: 999, quarter: 1 }],
        result: false,
      },
      {
        parameters: [
          true,
          { year: 1000, quarter: 1 },
          { year: 1001, quarter: 1 },
          { year: 1000, quarter: 1 }],
        result: true,
      },
      {
        parameters: [
          true,
          { year: 1000, quarter: 1 },
          { year: 1001, quarter: 1 },
          { year: 1001, quarter: 1 }],
        result: true,
      },
      {
        parameters: [
          true,
          { year: 1000, quarter: 1 },
          { year: 1001, quarter: 1 },
          { year: 1000, quarter: 4 }],
        result: true,
      },
      {
        parameters: [
          true,
          { year: 1000, quarter: 1 },
          { year: 1001, quarter: 1 },
          { year: 1001, quarter: 2 }],
        result: false,
      },
    ];
    testData.forEach(data =>
      expect(component.isInsideBounds.apply(component, data.parameters))
        .toBe(data.result)
    );
  });
});
