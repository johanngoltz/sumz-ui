import { Injectable } from '@angular/core';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  protected projects: Project[];

  constructor() {
    this.projects = this.loadProjects();
    let that = this;
    window.addEventListener('storage', function(e) {  
      that.projects = that.loadProjects();
    });
  }

  loadProjects(): Project[] {
    let projectsString = window.localStorage.getItem('projects');
    if(projectsString) {
      let projects = JSON.parse(projectsString);
      return projects;
    } else {
      return [];
    }
  }

  saveProjects(projects: Project[]) {
    window.localStorage.setItem('projects', JSON.stringify(projects));
  }

  addProject(project: Project) {
    this.projects.push(project);
    this.saveProjects(this.projects);
  }

  removeProject(project: Project): Boolean {
    let index = this.projects.indexOf(project);
    if(index > -1) {
      this.projects.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}
