import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVcTemplateComponent } from './create-vc-template.component';

describe('CreateVcTemplateComponent', () => {
  let component: CreateVcTemplateComponent;
  let fixture: ComponentFixture<CreateVcTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVcTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVcTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
