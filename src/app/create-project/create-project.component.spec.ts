import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { CreateProjectComponent } from './create-project.component';
import { Router } from '@angular/router';


describe('CreateProjectComponent', () => {
  let component: CreateProjectComponent;
  let fixture: ComponentFixture<CreateProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProjectComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: { navigate() { return true; } } },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectComponent);
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
