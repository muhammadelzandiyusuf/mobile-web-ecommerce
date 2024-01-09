import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { MediaCenter } from './media-center';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class MediaCenterService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET year media center from the server */
  getYearMediaCenter (): Observable<MediaCenter[]> {
    let mediaUrl = this.apiUrl + 'media_center';
    return this.http.get<MediaCenter[]>(mediaUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getYearMediaCenter', []))
      );
  }

  /** GET list media center from the server */
  getMediaList (year: any, sidx: any, sort: any, limit: any, offset: any): Observable<MediaCenter[]> {
    let mediaUrl = this.apiUrl + 'media_center/list?year=' + year + 'sidx=' + sidx  + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<MediaCenter[]>(mediaUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getMediaList', []))
      );
  }

  /** GET year media center from the server */
  getMediaDetail (url: any): Observable<MediaCenter[]> {
    let mediaUrl = this.apiUrl + 'media_center/detail?url=' + url;
    return this.http.get<MediaCenter[]>(mediaUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getMediaDetail', []))
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

      // TODO: better job of transforming error for user consumption'
      // console.error("service error",error); 
      this.log(`${error.status}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(message);
  }

}
