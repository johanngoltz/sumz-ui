import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioTileComponent } from './scenario-tile.component';
import { MaterialModule } from '../material.module';

describe('ScenarioTileComponent', () => {
  let component: ScenarioTileComponent;
  let fixture: ComponentFixture<ScenarioTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioTileComponent],
      imports: [MaterialModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
