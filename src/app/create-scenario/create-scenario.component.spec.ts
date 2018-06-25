import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { CreateScenarioComponent } from './create-scenario.component';


describe('CreateScenarioComponent', () => {
  let component: CreateScenarioComponent;
  let fixture: ComponentFixture<CreateScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateScenarioComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: { navigate() { return true; } } },
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

  it('should initially create a financial data object for the baseyear', () => {
    expect(component.timeSeries.length).toBe(1);
    expect(component.timeSeries.value[0].year).toBe(component.formGroup3.value.baseYear);
  });

  it('should add a year when triggered', () => {
    component.addYear();
    expect(component.timeSeries.length).toBe(2);
    if (component.formGroup2.value.deterministic) {
      expect(component.timeSeries.value[1].year).toBe(component.formGroup3.value.baseYear + 1);
    } else {
      expect(component.timeSeries.value[0].year).toBe(component.formGroup3.value.baseYear - 1);
    }
  });
});
