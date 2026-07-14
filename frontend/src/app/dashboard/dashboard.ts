import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SensexService } from '../services/sensex.service';
import { Sensex } from '../models/sensex';
import Toastify from 'toastify-js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { SocketService } from '../services/socket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  sensexData = signal<Sensex[]>([]);


  searchText = signal('');

currentPage = signal<number>(1);
pageSize = signal<number>(30);
totalRecords = signal<number>(0);
totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));
  // ======================
// Chart Variables
// ======================

showChart = false;

public barChartData: ChartConfiguration<'bar'>['data'] = {
  labels: [],
  datasets: [
    {
      label: 'Average Monthly Closing Price',
      data: [],
      backgroundColor: '#4facfe'
    }
  ]
};

public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Month'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Average Closing Price'
      },
      beginAtZero: false
    }
  }
};
  constructor(
    private sensexService: SensexService,
    private router: Router,
    private socketService: SocketService
  ) { }
  ngOnInit(): void {
    const token = localStorage.getItem('jwt');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPageData(this.currentPage(), this.pageSize());
     this.socketService.getSocket().on('newRecord', () => {

    console.log("📢 New record received");

    // Refresh first page so newest record appears on top
    this.loadPageData(1, this.pageSize());

  });
  }
  loadPageData(page: number, limit: number): void {
    this.sensexService.getSensexData(page, limit, this.searchText()).subscribe({
      next: (res) => {
        this.sensexData.set(res.data);
        this.totalRecords.set(res.totalCount);
        this.currentPage.set(res.page);
        this.pageSize.set(res.limit);
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
  // Pagination navigation helpers
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.loadPageData(this.currentPage() + 1, this.pageSize());
    }
  }
  prevPage(): void {
    if (this.currentPage() > 1) {
      this.loadPageData(this.currentPage() - 1, this.pageSize());
    }
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.loadPageData(page, this.pageSize());
    }
  }
  onSearch(value: string): void {

  this.searchText.set(value);

  this.loadPageData(1, this.pageSize());

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
  showModal = signal(false);

  newRecord = {
    trade_date: '',
  open: 0,
  high: 0,
  low: 0,
  close: 0


};

openModal() {
  this.showModal.set(true);
}

closeModal() {
  this.showModal.set(false);

  this.newRecord = {
    trade_date: '',
    open: 0,
    high: 0,
    low: 0,
    close: 0
  };
}
addRecord(): void {

  this.sensexService.addSensexRecord(this.newRecord).subscribe({
    next: () => {
      Toastify({
        text: `<div style="display:flex; align-items:center; gap:10px;">
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #43e97b;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 <span>Record Added Successfully</span>
               </div>`,
        escapeMarkup: false,
        duration: 3000,
        gravity: "top",
        position: "right",
        className: "premium-toast success",
        style: { background: "transparent", boxShadow: "none" }
      }).showToast();

      this.closeModal();

      // Reload current page
      this.loadPageData(this.currentPage(), this.pageSize());
    },
    error: (err) => {
      console.error(err);
      Toastify({
        text: `<div style="display:flex; align-items:center; gap:10px;">
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f5576c;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                 <span>Unable to add record</span>
               </div>`,
        escapeMarkup: false,
        duration: 3000,
        gravity: "top",
        position: "right",
        className: "premium-toast error",
        style: { background: "transparent", boxShadow: "none" }
      }).showToast();
    }
  });

  


}

showMonthlyChart(): void {

  this.showChart = true;

  this.sensexService.getMonthlyAverage().subscribe({

    next: (data: any[]) => {

      this.barChartData = {
        labels: data.map(item => item.month),
        datasets: [
          {
            label: 'Average Monthly Closing Price',
            data: data.map(item => Number(item.average_close)),
            backgroundColor: '#4facfe'
          }
        ]
      };

    },

    error: (err) => {
      console.error('Error loading monthly averages', err);
    }

  });

}
}