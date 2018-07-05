import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportScenarioComponent } from './import-scenario.component';
import { MaterialModule } from '../material.module';
import { MatDialogRef } from '@angular/material';

describe('ImportScenarioComponent', () => {
  let component: ImportScenarioComponent;
  let fixture: ComponentFixture<ImportScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportScenarioComponent],
      imports: [MaterialModule],
      providers: [{ provide: MatDialogRef, useValue: { close() { } } }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
