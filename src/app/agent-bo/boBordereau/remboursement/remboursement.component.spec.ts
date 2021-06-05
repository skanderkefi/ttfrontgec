import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemboursementComponent } from './remboursement.component';

describe('RemboursementComponent', () => {
  let component: RemboursementComponent;
  let fixture: ComponentFixture<RemboursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemboursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemboursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
