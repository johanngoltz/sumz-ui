import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Scenario } from '../api/scenario';
import { MaterialModule } from '../material.module';
import { ScenarioCardComponent, Wrapper } from './scenario-card.component';
import { ScenariosService } from '../service/scenarios.service';

describe('ScenarioCardComponent', () => {
  let component: ScenarioCardComponent;
  let fixture: ComponentFixture<ScenarioCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioCardComponent],
      imports: [MaterialModule],
      providers: [{ provide: ScenariosService, useValue: undefined }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioCardComponent);
    component = fixture.componentInstance;
    component.scenario = new Wrapper<Scenario>({
      id: 3,
      name: 'Testscenario',
      description: 'Testdesc',
      // FIXME
      /*
      algorithm: 'fcf',
      deterministic: true,
      baseYear: 2014,
      iterations: 5000,
      prognosisLength: 3,
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
      ],*/
    } as Scenario);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
