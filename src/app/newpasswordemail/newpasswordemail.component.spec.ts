import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordEmailComponent } from './newpasswordemail.component';

describe('newpasswordemailComponent', () => {
  let component: NewPasswordEmailComponent;
  let fixture: ComponentFixture<NewPasswordEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPasswordEmailComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
