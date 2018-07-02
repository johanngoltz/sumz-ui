import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../material.module';

import { NewPasswordComponent } from './newpassword.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPasswordComponent],
      imports: [MaterialModule, ReactiveFormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
