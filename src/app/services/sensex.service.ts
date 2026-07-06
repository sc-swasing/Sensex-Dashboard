import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as Papa from 'papaparse';
import { Sensex } from '../models/sensex';

@Injectable({
  providedIn: 'root'
})
export class SensexService {

  constructor(private http: HttpClient) {}

  getSensexData(): Observable<Sensex[]> {

    return this.http
      .get('assets/Sensex_CSV_2018.csv', { responseType: 'text' })
      .pipe(

        map(csv => {

          const parsed = Papa.parse<Sensex>(csv, {

            header: true,

            skipEmptyLines: true,

            dynamicTyping: true

          });

          return parsed.data;

        })

      );
  }

}