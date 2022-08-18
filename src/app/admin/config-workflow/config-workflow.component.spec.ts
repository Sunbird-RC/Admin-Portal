import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigWorkflowComponent } from './config-workflow.component';

describe('ConfigWorkflowComponent', () => {
  let component: ConfigWorkflowComponent;
  let fixture: ComponentFixture<ConfigWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
