import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingProgressBarComponent } from './loading-progress-bar.component';

describe('LoadingProgressBarComponent', () => {
  let component: LoadingProgressBarComponent;
  let fixture: ComponentFixture<LoadingProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingProgressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
