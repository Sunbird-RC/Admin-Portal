import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DloginComponent } from './dlogin.component';

describe('DloginComponent', () => {
  let component: DloginComponent;
  let fixture: ComponentFixture<DloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
