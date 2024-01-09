import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { WineDine } from './wine-dine';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class WineDineService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET live event from the server */
  getLiveEvent(sidx: any, sort: any, limit: any, offset: any): Observable<WineDine[]> {
    let eventUrl = this.apiUrl + 'wine_food/live_event?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<WineDine[]>(eventUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getLiveEvent', []))
      );
  }

  /** GET upcoming event from the server */
  getUpcomingEvent(sidx: any, sort: any, limit: any, offset: any): Observable<WineDine[]> {
    let eventUrl = this.apiUrl + 'wine_food/upcoming_event?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<WineDine[]>(eventUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getUpcomingEvent', []))
      );
  }

  /** GET past event from the server */
  getPastEvent(sidx: any, sort: any, limit: any, offset: any): Observable<WineDine[]> {
    let exhibitionUrl = this.apiUrl + 'wine_food/past_event?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<WineDine[]>(exhibitionUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getPastEvent', []))
      );
  }

  /** GET detail event from the server */
  getDetail(url: any): Observable<WineDine[]> {
    let exhibitionUrl = this.apiUrl + 'wine_food/detail?url=' + url;
    return this.http.get<WineDine[]>(exhibitionUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getDetail', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
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
    this.messageService.add('wineDineService: ' + message);
  }

}
