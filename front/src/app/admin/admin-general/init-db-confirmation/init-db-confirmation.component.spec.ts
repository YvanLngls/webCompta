import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitDbConfirmationComponent } from './init-db-confirmation.component';

describe('InitDbConfirmationComponent', () => {
  let component: InitDbConfirmationComponent;
  let fixture: ComponentFixture<InitDbConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitDbConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitDbConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
