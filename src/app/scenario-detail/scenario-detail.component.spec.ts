import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, EMPTY, NEVER } from 'rxjs';
import { MaterialModule } from '../material.module';
import { ScenarioDetailComponent } from './scenario-detail.component';
import { ScenariosService } from '../service/scenarios.service';
import { Scenario } from '../api/scenario';
import { ReactiveFormsModule, FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { AccountingDataComponent } from '../accounting-data/accounting-data.component';
import { DEFAULT_MOCK_DATA } from '../service/mockdata';
import { ChartModule } from 'angular-highcharts';
import { OptionsService } from '../service/options.service';
import { RemoteConfig, ScenarioConfig } from '../api/config';


describe('ScenarioDetailComponent', () => {
  let component: ScenarioDetailComponent;
  let fixture: ComponentFixture<ScenarioDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioDetailComponent, AccountingDataComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, ChartModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(convertToParamMap({ 'id': 1 })),
        },
      }, {
        provide: ScenariosService, useValue: {
          getScenarios: () => this.scenarios$,
          getScenario: (id: number) => of(DEFAULT_MOCK_DATA[0]),
        } as ScenariosService,
      }, {
        provide: OptionsService, useValue: {
          setConfig: () => { },
          getConfig: () => of({
            scenarioConfig: { get: () => ({ showResult: { apv: true, cvd: true, fcf: false, fte: false } }), set: () => { } },
          }),
        },
      }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid formGroup', async(() => {
    fixture.whenStable().then( () => { expect(component.formGroup.valid).toBeTruthy(); });
  }));

  it('should have a valid accountingDataFormGroup', async(() => {
    fixture.whenStable().then( () => { expect(component.accountingDataFormGroup.valid).toBeTruthy(); });
  }));

  it('should have a valid configFormGroup', async(() => {
    fixture.whenStable().then( () => { expect(component.configFormGroup.valid).toBeTruthy(); });
  }));


});
