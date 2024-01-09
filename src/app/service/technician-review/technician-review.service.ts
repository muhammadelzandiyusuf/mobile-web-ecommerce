import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { TechnicianReview } from './technician-review';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class TechnicianReviewService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals) { }

  apiUrl = this.globals.apiUrl;

  /** GET review on progress from the server */
  getTechnicianReviewProgress (token: any, limit: any, start: any): Observable<TechnicianReview[]> {
    let productUrl = this.apiUrl + 'technician_review?token=' + token + '&limit=' + limit + '&start=' + start;
    return this.http.get<TechnicianReview[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicianReviewProgress', []))
      );
  }

  /** GET review finish from the server */
  getTechnicianReviewFinish (token: any, limit: any, start: any): Observable<TechnicianReview[]> {
    let productUrl = this.apiUrl + 'technician_review/finish?token=' + token + '&limit=' + limit + '&start=' + start;
    return this.http.get<TechnicianReview[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicianReviewFinish', []))
      );
  }

  /** GET detail review technician from the server */
  getTechnicianReviewDetail (token: any, registration_no: any): Observable<TechnicianReview[]> {
    // let productUrl = this.apiUrl + 'technician_review/detail?customer_id=' + customer_id + '&registration_no=' + registration_no
    let productUrl = this.apiUrl + 'technician_review/detail?token=' + token + '&registration_no=' + registration_no
    return this.http.get<TechnicianReview[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTechnicianReviewDetail', []))
      );
  }

  /** POST review technician to the server */
  postTechnicianReview (rating: TechnicianReview, token: any, service_id: any, technician_id: any): Observable<TechnicianReview> {
    let registerUrl = this.apiUrl + 'technician_review/review';
    let httpParams = new HttpParams();
    Object.keys(rating).forEach(function (key) {
        httpParams = httpParams.append(key, rating[key]);
    });
    httpParams = httpParams.append('token', token);
    httpParams = httpParams.append('service_id', service_id);
    httpParams = httpParams.append('technician_id', technician_id);
    return this.http.post<TechnicianReview>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Technician Post', rating))
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
    this.messageService.add('TechnicianReviewService: ' + message);
  }

}
