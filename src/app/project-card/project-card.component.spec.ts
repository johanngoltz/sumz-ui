import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from './project-card.component';
import { MaterialModule } from '../material.module';
import { Project } from '../project';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCardComponent],
      imports: [MaterialModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    component.project = {
      id: 3,
      name: 'Testproject',
      description: 'Testdesc',
      algorithm: 'fcf',
      deterministic: true,
      baseYear: 2014,
      iterations: 5000,
      prognosisLength: 3,
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
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
