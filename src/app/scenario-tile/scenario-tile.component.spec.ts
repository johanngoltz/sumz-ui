import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioTileComponent } from './scenario-tile.component';

describe('ScenarioTileComponent', () => {
  let component: ScenarioTileComponent;
  let fixture: ComponentFixture<ScenarioTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioTileComponent ]
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
