import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Showroom } from './showroom';
import { ShowroomSchedule } from './showroom-schedule';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ShowroomService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET Showroom Province from the server */
  getShowroomProvince (): Observable<Showroom[]> {
    let showroomUrl = this.apiUrl + 'showroom/province';
    return this.http.get<Showroom[]>(showroomUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getShowroomProvince', []))
      );
  }

  /** GET Showroom from the server */
  getShowroomByProvinces (province_id: any, sidx: any, sort: any, limit: any, start: any): Observable<Showroom[]> {
    let showroomUrl = this.apiUrl + 'showroom?province_id=' + province_id + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<Showroom[]>(showroomUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getShowroomProvince', []))
      );
  }

  /** GET Detail Showroom from the server */
  getShowroomDetails (url: any): Observable<Showroom[]> {
    let showroomUrl = this.apiUrl + 'showroom/detail?url=' + url;
    return this.http.get<Showroom[]>(showroomUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getShowroomProvince', []))
      );
  }

  /** POST showroom Contact to the server */
  postShowroomSchedule (showroomSchedule: ShowroomSchedule, date_visit: any, showroom_id: any): Observable<ShowroomSchedule> {
    let registerUrl = this.apiUrl + 'showroom/schedule';
    let httpParams = new HttpParams();
    Object.keys(showroomSchedule).forEach(function (key) {
          httpParams = httpParams.append(key, showroomSchedule[key]);
    });
    httpParams = httpParams.append('date_visit', date_visit);
    httpParams = httpParams.append('showroom_id', showroom_id);
    return this.http.post<ShowroomSchedule>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Prodcut Contact Post', showroomSchedule))
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
    this.messageService.add('ProvinceService: ' + message);
  }

}
