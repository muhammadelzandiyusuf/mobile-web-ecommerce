import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Count } from './count';
import { Read } from './read';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class NotificationService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET count item transaction from the server */
  getCountTransaction (token: any): Observable<Count[]> {
    let notificationUrl = this.apiUrl + 'notification/count?token=' + token;
    return this.http.get<Count[]>(notificationUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCountTransaction', []))
      );
  }

  /** GET count item tradein from the server */
  getCountTradein (token: any): Observable<Count[]> {
    let notificationUrl = this.apiUrl + 'notification/count_tradein?token=' + token;
    return this.http.get<Count[]>(notificationUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCountTradein', []))
      );
  }

  /** GET item tradein notification from the server */
  getTradeinNotification (token: any): Observable<Count[]> {
    let notificationUrl = this.apiUrl + 'notification/tradein?token=' + token;
    return this.http.get<Count[]>(notificationUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTradeinNotification', []))
      );
  }

  // POST postUpdateReadNotif
  postUpdateReadNotif (idOrder: any, token: string): Observable<Read> {
    let notificationUrl = this.apiUrl + 'notification/update';
    let httpParams = new HttpParams();

    httpParams = httpParams.append('id', idOrder);
    httpParams = httpParams.append('token', token);

    return this.http.post<Read>(notificationUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postUpdateReadNotif', idOrder))
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
