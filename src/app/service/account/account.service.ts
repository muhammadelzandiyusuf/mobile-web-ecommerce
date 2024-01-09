import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { TermAccount } from './term-account';
import { Bussiness } from '../bussiness/bussiness';
import { Data } from '@angular/router';
import { Password } from './password';
import { DatePipe } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class AccountService {

  pipe = new DatePipe('en-ID');

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET term account from the server */
  getTermAccounts (): Observable<TermAccount[]> {
    let accountUrl = this.apiUrl + 'account'
    return this.http.get<TermAccount[]>(accountUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTermAccounts', []))
      );
  }

  /** GET account customer from the server */
  getCustomerProfile (token: any): Observable<TermAccount[]> {
    let accountUrl = this.apiUrl + 'profile?token=' + token
    return this.http.get<TermAccount[]>(accountUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCustomerProfile', []))
      );
  }

  // Update account
  postUpdate (profile: Bussiness, token: any): Observable<Bussiness> {
    let accountUrl = this.apiUrl + 'profile/update';
    let httpParams = new HttpParams();
    
    Object.keys(profile).forEach(function (key) {
      httpParams = httpParams.append(key, profile[key]);
    });
    httpParams = httpParams.append('token', token);
    return this.http.post<Bussiness>(accountUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postUpdate', token))
      );
  }

  // Profile Change Password
  postChangePassword (profile: Password, token: any): Observable<Password> {
    let accountUrl = this.apiUrl + 'profile/change_password';
    let httpParams = new HttpParams();
    
    Object.keys(profile).forEach(function (key) {
      httpParams = httpParams.append(key, profile[key]);
    });
    httpParams = httpParams.append('token', token);
    return this.http.post<Password>(accountUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postChangePassword', token))
      );
  }

  // Upload avatar image
  postUpload(fileItem1:File, token:string){
    let apiCreateEndpoint = this.apiUrl + 'profile/upload';
    const formData: FormData = new FormData();

    formData.append('avatar_image', fileItem1, fileItem1.name);
    formData.append("token", token);

    return this.http.post(apiCreateEndpoint, formData)
  }

  /** GET balance from the server */
  getBalances (token: any, start_date: any, end_date: any): Observable<TermAccount[]> {
    let date_start = this.pipe.transform(start_date, 'y-M-d');
    let date_end = this.pipe.transform(end_date, 'y-M-d');
    let accountUrl = this.apiUrl + 'balance?token=' + token + '&start_date=' + date_start + '&end_date=' + date_end
    return this.http.get<TermAccount[]>(accountUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getBalances', []))
      );
  }

  /** GET commision from the server */
  getCommsions (token: any, start_date: any, end_date: any): Observable<TermAccount[]> {
    
    let date_start = null;
    if(start_date != null) {
      date_start = this.pipe.transform(start_date, 'y-M-d');
    }
    let date_end = null;
    if(end_date != null){
      date_end = this.pipe.transform(end_date, 'y-M-d');
    }
    
    let accountUrl = this.apiUrl + 'commision?token=' + token + '&start_date=' + date_start + '&end_date=' + date_end
    return this.http.get<TermAccount[]>(accountUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCommsions', []))
      );
  }

  /** GET bank from the server */
  getBanks (): Observable<TermAccount[]> {
    let accountUrl = this.apiUrl + 'bank';
    return this.http.get<TermAccount[]>(accountUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getBanks', []))
      );
  }

  // Withdraw Commission
  postWithdrawCommission (bussiness: Bussiness, token: any): Observable<Bussiness> {
    let registerUrl = this.apiUrl + 'commision/withdraw';
    let httpParams = new HttpParams();
    Object.keys(bussiness).forEach(function (key) {
          httpParams = httpParams.append(key, bussiness[key]);
    });
    httpParams = httpParams.append('token', token);
    return this.http.post<Bussiness>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postWithdrawCommission', bussiness))
      );
  }

  // Get Notification
  getNotifications (token: any): Observable<TermAccount[]> {
    let accountUrl = this.apiUrl + 'notification?token=' + token;
    return this.http.get<TermAccount[]>(accountUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getNotifications', []))
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
