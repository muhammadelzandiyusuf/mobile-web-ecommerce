import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { ForgotPassword } from './forgot-password';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ForgotPasswordService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET detail customer from the server */
  getCustomerForgotPassword (forgotten_password_code: any): Observable<ForgotPassword[]> {
    let forgottUrl = this.apiUrl + 'customer_forgot_password?forgotten_password_code=' + forgotten_password_code;
    return this.http.get<ForgotPassword[]>(forgottUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCustomerForgotPassword', []))
      );
  }

  /** POST forgot password to the server */
  postForgotPassword (forgorPassword: ForgotPassword): Observable<ForgotPassword> {
    let forgotUrl = this.apiUrl + 'forgot_password';
    let httpParams = new HttpParams();
    Object.keys(forgorPassword).forEach(function (key) {
          httpParams = httpParams.append(key, forgorPassword[key]);
    });
    return this.http.post<ForgotPassword>(forgotUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Forgot Password', forgorPassword))
      );
  }

  /** POST reset password to the server */
  postResetPassword (forgorPassword: ForgotPassword, forgotten_password_code: any): Observable<ForgotPassword> {
    let forgotUrl = this.apiUrl + 'reset_password';
    let httpParams = new HttpParams();
    Object.keys(forgorPassword).forEach(function (key) {
          httpParams = httpParams.append(key, forgorPassword[key]);
    });
    httpParams = httpParams.append('forgotten_password_code', forgotten_password_code);
    return this.http.post<ForgotPassword>(forgotUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Reset Password', forgorPassword))
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
    this.messageService.add('ForgotPasswordService: ' + message);
  }

}
