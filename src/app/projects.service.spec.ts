import { TestBed, inject } from '@angular/core/testing';

import { ProjectsService } from './projects.service';
import { tap } from 'rxjs/operators';

let spyMethods;
describe('ProjectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsService],
    });
    spyMethods = {
      nextHandler: next => undefined,
    };
    spyOn(spyMethods, 'nextHandler');
  });

  it('should be created', inject([ProjectsService], (service: ProjectsService) => {
    expect(service).toBeTruthy();
  }));

  it('should load a list of projects', inject([ProjectsService], (service: ProjectsService) => {
    service.projects$.subscribe(spyMethods.nextHandler);
    expect(spyMethods.nextHandler).toHaveBeenCalled();
    // debugger;
    // const loadedProjects = spyMethods.nextHandler.calls.mostRecent();
    // expect(loadedProjects.length).toBeGreaterThan(0);
  }));
});
