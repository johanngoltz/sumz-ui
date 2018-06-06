import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProjectComponent } from './select-project.component';
import { MaterialModule } from '../material.module';
import { MatBottomSheetRef } from '@angular/material';

describe('SelectProjectComponent', () => {
  let component: SelectProjectComponent;
  let fixture: ComponentFixture<SelectProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectProjectComponent],
      imports: [MaterialModule],
      providers: [MatBottomSheetRef],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
