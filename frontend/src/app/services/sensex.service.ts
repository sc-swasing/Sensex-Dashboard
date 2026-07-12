import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensex } from '../models/sensex';

@Injectable({
  providedIn: 'root'
})
export class SensexService {

  private apiUrl = 'http://localhost:3000/api/sensex';

  constructor(private http: HttpClient) {}

  getSensexData(page: number, limit: number): Observable<{ data: Sensex[], totalCount: number, page: number, limit: number }> {
    return this.http.get<{ data: Sensex[], totalCount: number, page: number, limit: number }>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
  addSensexRecord(record: Sensex) {

  return this.http.post(
    'http://localhost:3000/api/sensex',
    record,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

}
getMonthlyAverage() {
  return this.http.get<any[]>(
    'http://localhost:3000/api/monthly-average'
  );
}
}