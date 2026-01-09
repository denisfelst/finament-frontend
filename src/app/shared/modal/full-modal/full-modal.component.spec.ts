import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullFullModalComponent } from './full-modal.component';

describe('FullFullModalComponent', () => {
  let component: FullFullModalComponent;
  let fixture: ComponentFixture<FullFullModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullFullModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullFullModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
