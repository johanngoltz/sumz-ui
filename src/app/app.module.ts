import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { MaterialModule } from './material.module';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectsComponent } from './projects/projects.component';
import { ToDoubleDirective } from './to-double.directive';
import { SelectProjectComponent } from './select-project/select-project.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ScenarioTileComponent } from './scenario-tile/scenario-tile.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


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
  entryComponents: [SelectProjectComponent, DeleteDialogComponent],
})
export class AppModule { }
