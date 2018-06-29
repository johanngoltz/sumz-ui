import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './/app-routing.module';
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
import { ToDoubleDirective } from './to-double.directive';
import { environment } from '../environments/environment';
import { ScenariosService } from './service/scenarios.service';
import { ScenariosServiceMock } from './service/scenarios.service.mock';
import { DEFAULT_MOCK_DATA } from './service/mockdata';

@NgModule({
  declarations: [
    AppComponent,
    ScenariosComponent,
    CreateScenarioComponent,
    ScenarioDetailComponent,
    ToDoubleDirective,
    SelectScenarioComponent,
    ScenarioCardComponent,
    DeleteDialogComponent,
    LoginComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [environment.emergencyDemo ? {
    provide: ScenariosService, useFactory: () => new ScenariosServiceMock(DEFAULT_MOCK_DATA),
  } : { provide: ScenariosService, useClass: ScenariosService }],
  bootstrap: [AppComponent],
  entryComponents: [SelectScenarioComponent, DeleteDialogComponent],
})
export class AppModule { }
