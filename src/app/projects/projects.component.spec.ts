import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material.module';
import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectsService } from '../projects.service';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectDetailsComponent } from '../project-details/project-details.component';


describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent, ProjectCardComponent, CreateProjectComponent, ProjectDetailsComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ProjectsService, useValue: { projects: [] } },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
