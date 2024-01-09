import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Host } from './host';
import { HostContact } from './host-contact';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class HostService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET host from the server */
  getHost (sidx: any, sort: any, limit: any, start: any): Observable<Host[]> {
    let hostUrl = this.apiUrl + 'host?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<Host[]>(hostUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getHost', []))
      );
  }

  /** GET host detail from the server */
  getHostDetail (url: any): Observable<Host[]> {
    let hostUrl = this.apiUrl + 'host/detail?url=' + url;
    return this.http.get<Host[]>(hostUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getHostDetail', []))
      );
  }

  // Create host contact
  createHostContact (host_id: any, host: HostContact): Observable<HostContact> {
    let hosttUrl = this.apiUrl + 'host/contact';
    let httpParams = new HttpParams();
    Object.keys(host).forEach(function (key) {
          httpParams = httpParams.append(key, host[key]);
    });
    httpParams = httpParams.append('host_id', host_id);
    return this.http.post<HostContact>(hosttUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('create', host))
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
    this.messageService.add('HostService: ' + message);
  }

}
