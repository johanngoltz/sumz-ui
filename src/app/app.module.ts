import { InjectionToken, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import axios from 'restyped-axios';
import { AppRoutingModule } from './/app-routing.module';
import { ScenarioAPI } from './api/api';
import { AppComponent } from './app.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { RegistrationComponent } from './registration/registration.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { ToDoubleDirective } from './to-double.directive';

// TODO: Ist das Best Practice?
export const AxiosInstance = new InjectionToken(
  'TypedAxiosInstance', {
    providedIn: 'root',
    factory: () => axios.create<ScenarioAPI>({ baseURL: 'http://localhost:8080' }),
  });
@NgModule({
  declarations: [
    AppComponent,
    ScenarioDetailComponent,
    ToDoubleDirective,
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
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ScenarioDetailComponent, DeleteDialogComponent],
})
export class AppModule { }
