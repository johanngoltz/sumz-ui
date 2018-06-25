import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { RegistrationComponent } from './registration/registration.component';
import { AccountingDataComponent } from './accounting-data/accounting-data.component';
import { ScenarioCardComponent } from './scenario-card/scenario-card.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { SelectScenarioComponent } from './select-scenario/select-scenario.component';
import { ToDoubleDirective } from './to-double.directive';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';

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
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SelectScenarioComponent, DeleteDialogComponent],
})
export class AppModule { }
