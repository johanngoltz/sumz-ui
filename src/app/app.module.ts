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
import { CreateProjectComponent } from './create-project/create-project.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectsComponent } from './projects/projects.component';
import { RegistrationComponent } from './registration/registration.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { SelectProjectComponent } from './select-project/select-project.component';
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
    ProjectsComponent,
    CreateProjectComponent,
    ScenarioDetailComponent,
    ToDoubleDirective,
    SelectProjectComponent,
    ProjectCardComponent,
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
  entryComponents: [SelectProjectComponent, DeleteDialogComponent],
})
export class AppModule { }
