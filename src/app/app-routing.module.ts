import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { LoginComponent } from './login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { RegistrationComponent } from './registration/registration.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProjectsComponent, data: {state: 'projects'} },
  { path: 'login', component: LoginComponent, data: {state: 'login'} },
  { path: 'registration', component: RegistrationComponent, data: {state: 'registration'} },
  { path: 'create', component: CreateProjectComponent, data: {state: 'create'} },
  { path: 'project/:id', component: ScenarioDetailComponent, data: {state: 'details'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
