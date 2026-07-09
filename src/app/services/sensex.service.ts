import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensex } from '../models/sensex';

export interface SensexResponse {
  data: Sensex[];
  totalCount: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class SensexService {

  constructor(private http: HttpClient) { }

  getSensexData(page: number = 1, limit: number = 10): Observable<SensexResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<SensexResponse>('http://localhost:3000/api/sensex', { params });
  }
}
