import { Injectable } from '@angular/core';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Project } from './project';
import { ProjectAPI } from './project-api';


@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  protected projects: Project[];
  private api: TypedAxiosInstance<ProjectAPI>;

  constructor() {
    this.api = axios.create<ProjectAPI>({ baseURL: 'http://localhost:8080' });
    this.loadProjects()
      .then(loadedProjects => this.projects = loadedProjects);
  }

  async loadProjects(): Promise<Project[]> {
    return (await this.api.get('/project')).data;
  }

  async getProject(id: number): Promise<Project> {
    // führt dazu, dass loadProjects() zwei mal aufgerufen wird. doof.
    if (!this.projects) { this.projects = await this.loadProjects(); }
    return this.projects.find(project => project.id === id);
  }

  async addProject(project: Project) {
    this.api.request({
      url: '/project',
      data: project,
    }).then(
      () => this.projects.push(project)
    );
  }

  async updateProject(project: Project) {
    this.api.patch(`/project/${project.id}`, project)
      .then(
        () => {
          const oldProjectIndex = this.projects.findIndex(other => other.pkEquals(project));
          this.projects[oldProjectIndex] = project;
        }
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
