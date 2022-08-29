import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndVerifyComponent } from './test-and-verify.component';

describe('TestAndVerifyComponent', () => {
  let component: TestAndVerifyComponent;
  let fixture: ComponentFixture<TestAndVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
