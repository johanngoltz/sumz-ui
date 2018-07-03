import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, EMPTY, NEVER } from 'rxjs';
import { MaterialModule } from '../material.module';
import { ScenarioDetailComponent } from './scenario-detail.component';
import { ScenariosService } from '../service/scenarios.service';
import { Scenario } from '../api/scenario';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { AccountingDataComponent } from '../accounting-data/accounting-data.component';
import { Chart } from 'angular-highcharts';


describe('ScenarioDetailComponent', () => {
  let component: ScenarioDetailComponent;
  let fixture: ComponentFixture<ScenarioDetailComponent>;

  beforeEach(async(() => {
    const testScenario = <Scenario> {
      'id': 3,
      'name': 'Drei',
      'description': 'Das Dritte Scenario',
      'periods': 2,
      'equityInterest': 23,
      'outsideCapitalInterest': 22,
      'corporateTax': 21,
      'stochastic': true,
      'additionalIncome': {
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
      'investments': {
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
      'divestments': {
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
      'revenue': {
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
      'costOfMaterial': {
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
      'costOfStaff': {
        'isHistoric': true,
        'timeSeries': [
          {
            'year': 2001,
            'quarter': 4,
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
      'companyValueDistribution': [
        {
          'num': 1,
          'rangeMin': 1000,
          'rangeMax': 2000,
          'height': 0.1,
        },
      ],
      'fteValuationResult': {
        'companyValue': 8888899,
      },
      'fcfValuationResult': {
        'companyValue': 8888899,
        'marketValueTotalAssets': 12123,
        'totalLiabilities': 112,
      },
      'apvValuationResult': {
        'companyValue': 8888899,
        'marketValueTotalAssets': 12123,
        'taxShield': 123,
        'totalLiabilities': 112,
      },
    };
    TestBed.configureTestingModule({
      declarations: [ScenarioDetailComponent, AccountingDataComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, Chart],
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
