import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateV2TemplatesComponent } from './create-v2-templates.component';

describe('CreateV2TemplatesComponent', () => {
  let component: CreateV2TemplatesComponent;
  let fixture: ComponentFixture<CreateV2TemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateV2TemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateV2TemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
