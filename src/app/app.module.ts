
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './/app-routing.module';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AccountingDataComponent } from './accounting-data/accounting-data.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { NewPasswordEmailComponent } from './newpasswordemail/newpasswordemail.component';
import { AlertComponent } from './alert/alert.component';
import { ScenarioCardComponent } from './scenario-card/scenario-card.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { SelectScenarioComponent } from './select-scenario/select-scenario.component';
import { DEFAULT_MOCK_DATA } from './service/mockdata';
import { ScenariosService } from './service/scenarios.service';
import { ScenariosServiceMock } from './service/scenarios.service.mock';
import { ToDoubleDirective } from './to-double.directive';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { ChartModule } from 'angular-highcharts';
import { AuthGuard } from './auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    ScenariosComponent,
    ScenarioDetailComponent,
    ToDoubleDirective,
    SelectScenarioComponent,
    ScenarioCardComponent,
    DeleteDialogComponent,
    LoginComponent,
    RegistrationComponent,
    AccountingDataComponent,
    CreateScenarioComponent,
    ChangePasswordComponent,
    NewPasswordComponent,
    NewPasswordEmailComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ChartModule,
  ],
  providers: [
    environment.emergencyDemo ? {
    provide: ScenariosService, useFactory: () => new ScenariosServiceMock(DEFAULT_MOCK_DATA),
    } : { provide: ScenariosService, useClass: ScenariosService },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
  entryComponents: [SelectScenarioComponent, DeleteDialogComponent, AlertComponent],
})
export class AppModule { }
