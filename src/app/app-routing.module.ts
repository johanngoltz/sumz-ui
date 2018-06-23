import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProjectsComponent } from './projects/projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProjectsComponent, data: {state: 'projects'}, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, data: {state: 'login'} },
  { path: 'registration', component: RegistrationComponent, data: {state: 'registration'} },
  { path: 'create', component: CreateProjectComponent, data: {state: 'create'}, canActivate: [AuthGuard] },
  { path: 'project/:id', component: ProjectDetailComponent, data: {state: 'details'}, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
