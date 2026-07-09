import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SensexService } from '../services/sensex.service';
import { Sensex } from '../models/sensex';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  sensexData = signal<Sensex[]>([]);

  constructor(
    private sensexService: SensexService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Check if JWT token exists
    const token = localStorage.getItem('jwt');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Fetch Sensex data
    this.sensexService.getSensexData().subscribe({

      next: (data) => {
        this.sensexData.set(data);
        console.log(data);
      },

      error: (err) => {

        console.error("Error fetching data:", err);

        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('jwt');
          this.router.navigate(['/login']);
        }

      }

    });

  }

  getHighestClose(): number {
    return Math.max(...this.sensexData().map(item => Number(item.close)));
  }

  getLowestClose(): number {
    return Math.min(...this.sensexData().map(item => Number(item.close)));
  }

  getAverageClose(): number {

    const data = this.sensexData();

    if (data.length === 0) {
      return 0;
    }

    const total = data.reduce((sum, item) => sum + Number(item.close), 0);

    return total / data.length;
  }

  logout(): void {

    localStorage.removeItem('jwt');

    this.router.navigate(['/login']);

  }

}