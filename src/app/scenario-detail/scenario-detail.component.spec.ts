import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, EMPTY, NEVER } from 'rxjs';
import { MaterialModule } from '../material.module';
import { ScenarioDetailComponent } from './scenario-detail.component';
import { ScenariosService } from '../service/scenarios.service';
import { OptionsService } from '../service/options.service';
import { RemoteConfig, ScenarioConfig } from '../api/config';
import { Scenario } from '../api/scenario';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { AccountingDataComponent } from '../accounting-data/accounting-data.component';
import { ChartModule } from 'angular-highcharts';


describe('ScenarioDetailComponent', () => {
  let component: ScenarioDetailComponent;
  let fixture: ComponentFixture<ScenarioDetailComponent>;

  beforeEach(async(() => {
    const testScenario = <Scenario> {
      'depreciation': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'freeCashflows': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'businessTaxRate': 0.12,
      'divestments': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'corporateTaxRate': 0.13,
      'description': 'Das Dritte Scenario',
      'investments': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'costOfStaff': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'solidaryTaxRate': 0.05,
      'interestOnLiabilitiesRate': 0.11,
      'revenue': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'costOfMaterial': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'additionalIncome': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'liabilities': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'periods': null,
      'stochastic': true,
      'apvValuationResult': {
        'companyValue': 8888899,
        'marketValueTotalAssets': 12123,
        'taxShield': 123,
        'totalLiabilities': 112,
        'presentValueOfCashflows': 10000,
      },
      'id': 3,
      'fcfValuationResult': {
        'companyValue': 8888899,
        'marketValueTotalAssets': 12123,
        'totalLiabilities': 112,
      },
      'companyValueDistribution':
        {
          xValues: [...Array(31).keys()].map(i => i * 10000),
          yValues: [...Array(31).keys()].map(i => i / 30),
        },
      'externalCapital': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'additionalCosts': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 1,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 2,
            'amount': 0,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'freeCashFlows': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
          {
            'year': 2001,
            'quarter': 3,
            'amount': 345.56,
          },
        ],
      },
      'name': 'Drei',
      'fteValuationResult': {
        'companyValue': 8888899,
      },
      'equityInterestRate': 0.1,
    };

    const testRemoteConfig: RemoteConfig = { scenarioConfig: new Map<number, ScenarioConfig>([
      [1, { showResult: { apv: true, cvd: true, fcf: false, fte: false } }],
    ])};

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
          scenarios$: of([testScenario]),
          getScenarios: () => this.scenarios$,
          getScenario: (id) => of(testScenario),
        },
      }, {
        provide: OptionsService, useValue: {
          RemoteConfig$: testRemoteConfig,
          getConfig: () => this.RemoteConfig$,
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
});
