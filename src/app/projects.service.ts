import { Injectable, OnInit } from '@angular/core';

import axios, { TypedAxiosStatic, TypedAxiosInstance } from 'restyped-axios';
import { ProjectAPI, Project } from './project-api';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  protected projects: Project[];
  private api: TypedAxiosInstance<ProjectAPI>;

  constructor() {
    this.api = axios.create<ProjectAPI>({ baseURL: 'http://delicate-dew-1362.getsandbox.com/' });
    this.loadProjects()
        .then(loadedProjects => this.projects = loadedProjects);
  }

  async loadProjects(): Promise<Project[]> {
    return (await this.api.get('/project')).data;
  }

  saveProjects(projects: Project[]) {
    window.localStorage.setItem('projects', JSON.stringify(projects));
  }

  async addProject(project: Project) {
    this.api.request({
      url: '/project',
      data: project
    }).then(
      () => this.projects.push(project)
    );
  }

  async removeProject(project: Project) {
    return this.api.delete(`/project/${project.id}`)
      .then(
        async () => {
          this.projects.splice(this.projects.indexOf(project), 1);
          return true;
        }
      );
  }
}
