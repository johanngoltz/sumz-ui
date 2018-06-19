import { Injectable } from '@angular/core';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { BehaviorSubject, Observable, of, throwError, empty } from 'rxjs';
import { Project } from './project';
import { ProjectAPI } from './project-api';
import { switchMap, filter, catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  protected projects: Project[];
  private api: TypedAxiosInstance<ProjectAPI>;
  private initialLoader: Promise<Project[]>;


  public projects$: Observable<Project[]>;
  private _projectsStorage: Project[];
  private _projects$: BehaviorSubject<Project[]>;

  constructor() {
    this.api = axios.create<ProjectAPI>({ baseURL: 'http://localhost:8080' });
    this._projects$ = new BehaviorSubject(undefined);

    this.projects$ = this._projects$.asObservable();
    this.projects$.subscribe(next => console.log(next));

    this.getProjects();
  }

  async getProjects() {
    const projects = (await this.api.get('/project')).data;
    this._projectsStorage = projects;
    this._projects$.next([...projects]);
    return this.projects$;
  }

  getProject(id: number) {
    // TODO: Error handling
    return this.projects$.pipe(
      switchMap(projects => {
        if (projects) {
          const foundProject = projects.find(p => p.id === id);
          if (foundProject) {
            return of(foundProject);
          }
        }
        return empty();
      })
    );
  }

  async addProject(project: Project) {
    const response = await this.api.request({
      url: '/project',
      data: project,
      method: 'POST',
    });
    if (response.status === 200) {
      this._projectsStorage.push(response.data);
      this._projects$.next([...this._projectsStorage]);
      return response.data;
    } else {
      throw response;
    }
  }

  async updateProject(project: Project) {
    throw new Error('Not implemented');
    /*
    await this.initialLoader;
    this.api.patch(`/project/${project.id}`, project)
      .then(
        () => {
          const oldProjectIndex = this.projects.findIndex(other => other.id === project.id);
          this.projects[oldProjectIndex] = project;
        }
      );
      */
  }

  async removeProject(project: Project) {
    throw new Error('Not implemented');
    /*
    await this.initialLoader;
    return this.api.delete(`/project/${project.id}`)
      .then(
        async () => {
          this.projects.splice(this.projects.indexOf(project), 1);
          return true;
        }
      );*/
  }
}
