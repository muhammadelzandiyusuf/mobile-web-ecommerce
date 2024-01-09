import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Restaurant } from './restaurant';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class RestaurantService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET Province from the server */
  getProvince (): Observable<Restaurant[]> {
    let restaurantUrl = this.apiUrl + 'restaurant/province';
    return this.http.get<Restaurant[]>(restaurantUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProvince', []))
      );
  }

  /** GET from the server */
  getByProvinces (province_id: any, sidx: any, sort: any, limit: any, start: any): Observable<Restaurant[]> {
    let restaurantUrl = this.apiUrl + 'restaurant?province_id=' + province_id + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<Restaurant[]>(restaurantUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getByProvinces', []))
      );
  }

  /** GET Detail from the server */
  getDetails (url: any): Observable<Restaurant[]> {
    let restaurantUrl = this.apiUrl + 'restaurant/detail?url=' + url;
    return this.http.get<Restaurant[]>(restaurantUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getDetails', []))
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
