import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SensexService } from '../services/sensex.service';
import { SocketService } from '../services/socket';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {

    const sensexServiceMock = {
      getSensexData: () =>
        of({
          data: [],
          totalCount: 0,
          page: 1,
          limit: 30
        }),
      addSensexRecord: () => of({}),
      getMonthlyAverage: () => of([])
    };

    const socketServiceMock = {
      getSocket: () => ({
        on: () => {}
      })
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: SensexService, useValue: sensexServiceMock },
        { provide: SocketService, useValue: socketServiceMock }
      ]
    }).compileComponents();

    localStorage.setItem('jwt', 'dummy-token');

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});