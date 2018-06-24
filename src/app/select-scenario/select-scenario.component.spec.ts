import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatBottomSheetRef } from '@angular/material';
import { MaterialModule } from '../material.module';
import { ScenariosService } from '../service/scenarios.service';
import { SelectScenarioComponent } from './select-scenario.component';


describe('SelectScenarioComponent', () => {
  let component: SelectScenarioComponent;
  let fixture: ComponentFixture<SelectScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectScenarioComponent],
      imports: [MaterialModule],
      providers: [
        { provide: MatBottomSheetRef, useValue: {dismiss() {}} },
        { provide: ScenariosService, useValue: {
          scenarios: [],
        }},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
