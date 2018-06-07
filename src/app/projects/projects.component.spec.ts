import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material.module';
import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectsService } from '../projects.service';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import { ScenarioTileComponent } from '../scenario-tile/scenario-tile.component';


describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent, ProjectCardComponent, CreateProjectComponent, ProjectDetailComponent, ScenarioTileComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: ProjectsService, useValue: {
            projects: [
              {
                id: 3,
                name: 'Testproject',
                description: 'Testdesc',
                algorithm: 'fcf',
                deterministic: true,
                baseYear: 2014,
                iterations: 5000,
                prognosisLength: 0,
                timeSeries: [
                  {
                    year: 2014,
                    fcf: 300,
                    externalCapital: 500,
                  },
                  {
                    year: 2015,
                    fcf: 350,
                    externalCapital: 400,
                  },
                ],
              },
              {
                id: 4,
                name: 'Testproject2',
                description: 'Testdesc2',
                algorithm: 'apv',
                deterministic: false,
                baseYear: 2015,
                iterations: 5000,
                prognosisLength: 3,
                timeSeries: [
                  {
                    year: 2014,
                    fcf: 0,
                    externalCapital: 500,
                  },
                  {
                    year: 2015,
                    fcf: 0,
                    externalCapital: 550,
                  },
                ],
              },
            ],
          },
        },
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
