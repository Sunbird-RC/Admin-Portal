import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldFormComponent } from './add-field-form.component';

describe('AddFieldFormComponent', () => {
  let component: AddFieldFormComponent;
  let fixture: ComponentFixture<AddFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFieldFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
