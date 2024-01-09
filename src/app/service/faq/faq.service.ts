import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Faq } from './faq';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class FaqService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET FAQ Category from the server */
  getCategoryFaq (sidx: any, sort: any, limit: any, start: any): Observable<Faq[]> {
    let faqnUrl = this.apiUrl + 'faq?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<Faq[]>(faqnUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCategoryFaq', []))
      );
  }

  /** GET FAQ Category Detail from the server */
  getCategoryFaqDetail (url: any): Observable<Faq[]> {
    let faqnUrl = this.apiUrl + 'faq/category?url=' + url;
    return this.http.get<Faq[]>(faqnUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCategoryFaqDetail', []))
      );
  }

  /** GET FAQ list from the server */
  getFaq (category_id: any, sidx: any, sort: any, limit: any, start: any): Observable<Faq[]> {
    let faqnUrl = this.apiUrl + 'faq/list?category_id=' + category_id + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<Faq[]>(faqnUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getFaq', []))
      );
  }

  /** GET FAQ detail from the server */
  getFaqDetail (url: any): Observable<Faq[]> {
    let faqnUrl = this.apiUrl + 'faq/detail?url=' + url;
    return this.http.get<Faq[]>(faqnUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getFaqDetail', []))
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
    this.messageService.add('FaqService: ' + message);
  }

}
