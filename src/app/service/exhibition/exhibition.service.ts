import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Exhibition } from './exhibition';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ExhibitionService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET exhibition live event from the server */
  getExhibitionLiveEvent (sidx:string, sort:string, limit:number, offset:number): Observable<Exhibition[]> {
    let exhibitionUrl = this.apiUrl + 'exhibition/live_event?sidx=' + sidx  + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<Exhibition[]>(exhibitionUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getExhibitionLiveEvent', []))
      );
  }

  /** GET exhibition upcoming event from the server */
  getExhibitionUpcomingEvent (sidx:string, sort:string, limit:number, offset:number): Observable<Exhibition[]> {
    let exhibitionUrl = this.apiUrl + 'exhibition/upcoming_event?sidx=' + sidx  + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<Exhibition[]>(exhibitionUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getExhibitionUpcomingEvent', []))
      );
  }

  /** GET exhibition past event from the server */
  getExhibitionPastEvent (sidx:string, sort:string, limit:number, offset:number): Observable<Exhibition[]> {
    let exhibitionUrl = this.apiUrl + 'exhibition/past_event?sidx=' + sidx  + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<Exhibition[]>(exhibitionUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getExhibitionPastEvent', []))
      );
  }

  /** GET detail exhibition event from the server */
  getExhibitionDetail (url:string): Observable<Exhibition[]> {
    let exhibitionUrl = this.apiUrl + 'exhibition/detail?url=' + url;
    return this.http.get<Exhibition[]>(exhibitionUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getExhibitionDetail', []))
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
    this.messageService.add('BannerService: ' + message);
  }

}
