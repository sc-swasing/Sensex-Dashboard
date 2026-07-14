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

 getSensexData(page: number, limit: number, search: string) {
  return this.http.get<any>(
    `${this.apiUrl}?page=${page}&limit=${limit}&search=${search}`
  );
}
  addSensexRecord(record: Sensex) {
    return this.http.post('http://localhost:3000/api/sensex', record);
  }
getMonthlyAverage() {
  return this.http.get<any[]>(
    'http://localhost:3000/api/monthly-average'
  );
}
}