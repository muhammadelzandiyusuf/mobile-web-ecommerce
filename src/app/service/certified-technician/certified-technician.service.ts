import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { CertifiedTechnician } from './certified-technician';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class CertifiedTechnicianService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET All Technician from the server */
  getTechnicians (): Observable<CertifiedTechnician[]> {
    let technicianUrl = this.apiUrl + 'certified_technician/list';
    return this.http.get<CertifiedTechnician[]>(technicianUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicians', []))
      );
  }

  /** GET Technician Province from the server */
  getTechnicianProvince (): Observable<CertifiedTechnician[]> {
    let technicianUrl = this.apiUrl + 'certified_technician/province';
    return this.http.get<CertifiedTechnician[]>(technicianUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicianProvince', []))
      );
  }

  /** GET Technician from the server */
  getTechnicianByProvinces (province_id: any, sidx: any, sort: any, limit: any, start: any): Observable<CertifiedTechnician[]> {
    let technicianUrl = this.apiUrl + 'certified_technician?province_id=' + province_id + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<CertifiedTechnician[]>(technicianUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicianByProvinces', []))
      );
  }

  /** GET Technician Skill Category from the server */
  getTechnicianCategory (): Observable<CertifiedTechnician[]> {
    let technicianUrl = this.apiUrl + 'certified_technician/skill_category';
    return this.http.get<CertifiedTechnician[]>(technicianUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicianCategory', []))
      );
  }

  /** GET Technician Skill from the server */
  getTechnicianSkill (technician_id: any, parent_id: any): Observable<CertifiedTechnician[]> {
    let technicianUrl = this.apiUrl + 'certified_technician/skill_value?technician_id=' + technician_id + '&parent_id=' + parent_id;
    return this.http.get<CertifiedTechnician[]>(technicianUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicianSkill', []))
      );
  }

  /** GET Technician Detail from the server */
  getTechnicianDetail (staff_id: any): Observable<CertifiedTechnician[]> {
    let technicianUrl = this.apiUrl + 'certified_technician/detail?staff_id=' + staff_id;
    return this.http.get<CertifiedTechnician[]>(technicianUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicianDetail', []))
      );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(message);
  }

}
