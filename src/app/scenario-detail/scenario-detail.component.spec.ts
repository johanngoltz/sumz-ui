import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, EMPTY, NEVER } from 'rxjs';
import { MaterialModule } from '../material.module';
import { ScenarioDetailComponent } from './scenario-detail.component';
import { ScenariosService } from '../service/scenarios.service';
import { Scenario } from '../api/scenario';


describe('ScenarioDetailComponent', () => {
  let component: ScenarioDetailComponent;
  let fixture: ComponentFixture<ScenarioDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioDetailComponent],
      imports: [MaterialModule, BrowserAnimationsModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(convertToParamMap({ 'id': 1 })),
        } as ActivatedRoute,
      }, {
        provide: ScenariosService, useValue: {
          scenarios$: of([{ id: 1, name: 'Eins', description: 'Das erste Szenario' } as Scenario]),
          getScenarios: () => this.scenarios$,
        } as ScenariosService,
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
