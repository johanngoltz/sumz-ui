import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { ProjectsComponent } from './projects/projects.component';
import { AppRoutingModule } from './/app-routing.module';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ToDoubleDirective } from './to-double.directive';
import { SelectProjectComponent } from './select-project/select-project.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ScenarioTileComponent } from './scenario-tile/scenario-tile.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    CreateProjectComponent,
    ProjectDetailComponent,
    ToDoubleDirective,
    SelectProjectComponent,
    ProjectCardComponent,
    ScenarioTileComponent,
    DeleteDialogComponent,
    LoginComponent,
    RegistrationComponent,
    AlertComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SelectProjectComponent, DeleteDialogComponent, AlertComponent],
})
export class AppModule { }
