import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Scenario } from '../api/scenario';
import { AppRoutingModule } from '../app-routing.module';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { LoginComponent } from '../login/login.component';
import { MaterialModule } from '../material.module';
import { RegistrationComponent } from '../registration/registration.component';
import { ScenarioCardComponent } from '../scenario-card/scenario-card.component';
import { ScenarioDetailComponent } from '../scenario-detail/scenario-detail.component';
import { ScenariosService } from '../service/scenarios.service';
import { ScenariosComponent } from './scenarios.component';
import { AccountingDataComponent } from '../accounting-data/accounting-data.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


describe('ScenariosComponent', () => {
  let component: ScenariosComponent;
  let fixture: ComponentFixture<ScenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenariosComponent, ScenarioCardComponent, CreateScenarioComponent, ScenarioDetailComponent, LoginComponent,
        RegistrationComponent, AccountingDataComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, AppRoutingModule, BrowserAnimationsModule, NgxChartsModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: ScenariosService, useValue: {
            scenarios$: of([{ id: 1, name: 'Eins', description: 'Das erste Szenario' } as Scenario]),
            getScenarios: () => this.scenarios$,
          } as ScenariosService,
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
