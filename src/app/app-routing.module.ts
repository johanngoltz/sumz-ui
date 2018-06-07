import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProjectsComponent } from './projects/projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProjectsComponent, data: {state: 'projects'} },
  { path: 'create', component: CreateProjectComponent, data: {state: 'create'} },
  { path: 'project/:id', component: ProjectDetailComponent, data: {state: 'details'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
