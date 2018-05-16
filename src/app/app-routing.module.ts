import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProjectsComponent },
  { path: 'create',  component: CreateProjectComponent },
  { path: 'project/:id',  component: ProjectDetailsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
