import { APP_BASE_HREF } from '@angular/common';
import { TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { RegistrationComponent } from './registration/registration.component';
import { ScenarioCardComponent } from './scenario-card/scenario-card.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { SelectScenarioComponent } from './select-scenario/select-scenario.component';
import { ChangePasswordComponent} from './changepassword/changepassword.component';
import { AccountingDataComponent } from './accounting-data/accounting-data.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AlertComponent } from './alert/alert.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ScenariosComponent,
        CreateScenarioComponent,
        ScenarioDetailComponent,
        SelectScenarioComponent,
        ScenarioCardComponent,
        LoginComponent,
        RegistrationComponent,
        DeleteDialogComponent,
        ChangePasswordComponent,
        AccountingDataComponent,
        ChangePasswordComponent,
        AlertComponent,
        NewPasswordComponent,
      ],
      imports: [
        MaterialModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxChartsModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'SUMZ'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('SUMZ');
  }));
});
