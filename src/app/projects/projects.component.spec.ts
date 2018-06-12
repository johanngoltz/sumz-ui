import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { MaterialModule } from '../material.module';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import { ProjectsComponent } from './projects.component';


describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent, CreateProjectComponent, ProjectDetailComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
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
