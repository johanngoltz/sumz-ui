import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { MaterialModule } from '../material.module';
import { ScenarioCardComponent } from '../scenario-card/scenario-card.component';
import { ScenarioDetailComponent } from '../scenario-detail/scenario-detail.component';
import { ScenariosService } from '../service/scenarios.service';
import { ScenariosComponent } from './scenarios.component';


describe('ScenariosComponent', () => {
  let component: ScenariosComponent;
  let fixture: ComponentFixture<ScenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenariosComponent, ScenarioCardComponent, CreateScenarioComponent, ScenarioDetailComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: ScenariosService, useValue: {
            scenarios: [
              {
                id: 3,
                name: 'Testscenario',
                description: 'Testdesc',
                algorithm: 'fcf',
                deterministic: true,
                baseYear: 2014,
                iterations: 5000,
                prognosisLength: 0,
                timeSeries: [
                  {
                    year: 2014,
                    fcf: 300,
                    externalCapital: 500,
                  },
                  {
                    year: 2015,
                    fcf: 350,
                    externalCapital: 400,
                  },
                ],
              },
              {
                id: 4,
                name: 'Testscenario2',
                description: 'Testdesc2',
                algorithm: 'apv',
                deterministic: false,
                baseYear: 2015,
                iterations: 5000,
                prognosisLength: 3,
                timeSeries: [
                  {
                    year: 2014,
                    fcf: 0,
                    externalCapital: 500,
                  },
                  {
                    year: 2015,
                    fcf: 0,
                    externalCapital: 550,
                  },
                ],
              },
            ],
          },
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
