import { Injectable, OnInit } from '@angular/core';

import axios, { TypedAxiosStatic, TypedAxiosInstance } from 'restyped-axios'
import { ProjectAPI, Project } from './project-api'

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  protected projects: Project[];
  private api: TypedAxiosInstance<ProjectAPI>;

  constructor() {
    this.api = axios.create<ProjectAPI>({ baseURL: 'http://delicate-dew-1362.getsandbox.com/' });
    this.loadProjects().then(projects => this.projects = projects);
    this.removeProject({id:100});

    this.addProject({ id: Math.random(), name: 'randomizedId', description: 'Lorem ipsum dolor sit...' });
  }

  async loadProjects(): Promise<Project[]> {
    return (await this.api.get('/project')).data;
  }

  saveProjects(projects: Project[]) {
    window.localStorage.setItem('projects', JSON.stringify(projects));
  }

  addProject(project: Project) {
    this.api.post('/project', project).then(
      () => this.projects.push(project),
      err => { throw err }
    );
  }

  async removeProject(project: Project): Promise<Boolean> {
    return this.api.delete<'/project/:id'>
      (`/project/${project.id}`)
      .then(
        async () => {
          this.projects.splice(this.projects.indexOf(project), 1);
          return true;
        },
        err => false
      );
  }
}
