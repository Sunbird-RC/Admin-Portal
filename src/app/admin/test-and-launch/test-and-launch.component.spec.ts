import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndLaunchComponent } from './test-and-launch.component';

describe('TestAndLaunchComponent', () => {
  let component: TestAndLaunchComponent;
  let fixture: ComponentFixture<TestAndLaunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndLaunchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
