import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotBackgroundComponent } from './dot-background.component';

describe('DotBackgroundComponent', () => {
  let component: DotBackgroundComponent;
  let fixture: ComponentFixture<DotBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
