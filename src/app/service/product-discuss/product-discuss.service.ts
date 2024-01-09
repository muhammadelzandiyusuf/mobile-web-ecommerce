import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { ProductDiscuss } from './product-discuss';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ProductDiscussService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals) { }

  apiUrl = this.globals.apiUrl;

  /** GET all discuss from the server */
  getAllDiscussion (token: any, limit: any, start: any): Observable<ProductDiscuss[]> {
    let productUrl = this.apiUrl + 'product_discussion?token=' + token + '&limit=' + limit + '&start=' + start;
    return this.http.get<ProductDiscuss[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getAllDiscussion', []))
      );
  }

  /** GET unread discuss from the server */
  getUnreadDiscussion (token: any, limit: any, start: any): Observable<ProductDiscuss[]> {
    let productUrl = this.apiUrl + 'product_discussion/unread?token=' + token + '&limit=' + limit + '&start=' + start;
    return this.http.get<ProductDiscuss[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getUnreadDiscussion', []))
      );
  }

  /** GET detail discuss from the server */
  getDetailDiscussion (token: any, id: any): Observable<ProductDiscuss[]> {
    let productUrl = this.apiUrl + 'product_discussion/detail?token=' + token + '&id=' + id
    return this.http.get<ProductDiscuss[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getDetailDiscussion', []))
      );
  }

  /** GET product detail discuss from the server */
  getProductDetailDiscussion (token: any, product_url: any): Observable<ProductDiscuss[]> {
    let productUrl = this.apiUrl + 'product_discussion/product_detail?product_url=' + product_url + '&token=' + token
    return this.http.get<ProductDiscuss[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductDetailDiscussion', []))
      );
  }

  /** POST discuss delete to the server */
  postDiscussDelete (id: any, token: any): Observable<ProductDiscuss> {
    let registerUrl = this.apiUrl + 'product_discussion/delete';
    let httpParams = new HttpParams();
   
    httpParams = httpParams.append('id', id);
    httpParams = httpParams.append('token', token);
    return this.http.post<ProductDiscuss>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Discuss Post', id))
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
    this.messageService.add('ProductDiscussService: ' + message);
  }

}
