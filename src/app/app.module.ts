
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CreditsComponent } from './credits/credits.component';

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
    AlertComponent,
    CreditsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxChartsModule,
    HttpClientModule,
  ],
  providers: [
    environment.emergencyDemo
      ? { provide: ScenariosService, useClass: ScenariosServiceMock }
      : ScenariosService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [SelectScenarioComponent, DeleteDialogComponent, AlertComponent],
})
export class AppModule { }
