import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AppRoutingModule } from '../app-routing.module';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { LoginComponent } from '../login/login.component';
import { MaterialModule } from '../material.module';
import { ScenarioCardComponent } from '../scenario-card/scenario-card.component';
import { ScenarioDetailComponent } from '../scenario-detail/scenario-detail.component';
import { ScenariosComponent } from '../scenarios/scenarios.component';
import { RegistrationComponent } from './registration.component';


describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // Wenn das AppRoutingModule importiert wird, müssen alle von dort aus importierten
      // Komponenten deklariert werden.
      declarations: [ScenariosComponent, ScenarioCardComponent, CreateScenarioComponent, ScenarioDetailComponent, LoginComponent,
        RegistrationComponent],
      imports: [ReactiveFormsModule, AppRoutingModule, MaterialModule, ChartsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
