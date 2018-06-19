import { Injectable } from '@angular/core';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from './project';
import { ProjectAPI } from './project-api';


@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  protected projects: Project[];
  private api: TypedAxiosInstance<ProjectAPI>;
  private initialLoader: Promise<Project[]>;


  public projects$: Observable<Project[]>;
  private projectsStorage: Project[];
  private _projects$: BehaviorSubject<Project[]>;

  constructor() {
    this.api = axios.create<ProjectAPI>({ baseURL: 'http://localhost:8080' });
    this._projects$ = new BehaviorSubject(undefined);

    this.projects$ = this._projects$.asObservable();

    this.loadProjects();
  }

  /*async loadProjects(): Promise<Project[]> {
    return (await this.api.get('/project')).data;
  }*/

  async loadProjects() {
    const projects = (await this.api.get('/project')).data;
    this.projectsStorage = projects;
    this._projects$.next([...projects]);
    return this.projects$;
  }

  async getProject(id: number): Promise<Project> {
    await this.initialLoader;
    return this.projects.find(project => project.id === id);
  }

  async addProject(project: Project) {
    await this.initialLoader;
    this.api.request({
      url: '/project',
      data: project,
      method: 'POST',
    }).then(
      (response) => this.projects.push(response.data)
    );
  }

  async updateProject(project: Project) {
    await this.initialLoader;
    this.api.patch(`/project/${project.id}`, project)
      .then(
        () => {
          const oldProjectIndex = this.projects.findIndex(other => other.id === project.id);
          this.projects[oldProjectIndex] = project;
        }
      );
  }

  async removeProject(project: Project) {
    await this.initialLoader;
    return this.api.delete(`/project/${project.id}`)
      .then(
        async () => {
          this.projects.splice(this.projects.indexOf(project), 1);
          return true;
        }
      );
  }
}
