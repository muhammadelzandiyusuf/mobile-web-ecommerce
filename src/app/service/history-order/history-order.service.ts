import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { HistoryOrder } from './history-order';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class HistoryOrderService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET Order Status from the server */
  getStatusOrder (token: any): Observable<HistoryOrder[]> {
    let historyOrderUrl = this.apiUrl + 'history_order/status?token=' + token;
    return this.http.get<HistoryOrder[]>(historyOrderUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getStatusOrder', []))
      );
  }

  /** GET History Order from the server */
  getHistoryOrder (token: any, order_status_id: any, sidx: any, sort: any, limit: any, start: any): Observable<HistoryOrder[]> {
    let historyOrderUrl = this.apiUrl + 'history_order?token=' + token + '&order_status_id=' + order_status_id + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<HistoryOrder[]>(historyOrderUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getHistoryOrder', []))
      );
  }

  /** GET History Order Detail from the server */
  getHistoryOrderDetail (transaction_code: any, token: any): Observable<HistoryOrder[]> {
    let historyOrderUrl = this.apiUrl + 'history_order/detail?transaction_code=' + transaction_code + '&token=' + token;
    return this.http.get<HistoryOrder[]>(historyOrderUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getHistoryOrderDetail', []))
      );
  }

  /** GET product review from the server */
  getReviewProducts (token: any): Observable<HistoryOrder[]> {
    let historyOrderUrl = this.apiUrl + 'history_order/order_product_review?token=' + token
    return this.http.get<HistoryOrder[]>(historyOrderUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getReviewProducts', []))
      );
  }

  /** GET product review detail from the server */
  getReviewProductDetail (token: any, order_product_id: any, transaction_code: any): Observable<HistoryOrder[]> {
    let historyOrderUrl = this.apiUrl + 'history_order/order_product_review_detail?token=' + token + '&order_product_id=' + order_product_id + '&transaction_code=' + transaction_code
    return this.http.get<HistoryOrder[]>(historyOrderUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getReviewProductDetail', []))
      );
  }

  // POST review product
  postReviewProduct (review: HistoryOrder, order_product_id: any, product_id: any, token: any): Observable<HistoryOrder> {
    let historyOrderUrl = this.apiUrl + 'review_product';
    let httpParams = new HttpParams();
    Object.keys(review).forEach(function (key) {
          httpParams = httpParams.append(key, review[key]);
    });
    httpParams = httpParams.append('order_product_id', order_product_id);
    httpParams = httpParams.append('product_id', product_id);
    httpParams = httpParams.append('token', token);
    return this.http.post<HistoryOrder>(historyOrderUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postReviewProduct', review))
      );
  }

  // POST Print Invoice
  postPrintInvoice (transaction_code: any): Observable<HistoryOrder> {
    let historyOrderUrl = this.apiUrl + 'invoice';
    let httpParams = new HttpParams();
    httpParams = httpParams.append('transaction_code', transaction_code);
    return this.http.post<HistoryOrder>(historyOrderUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postPrintInvoice', transaction_code))
      );
  }

  // POST Track Shipping
  postTrackShipping (courier: any, tracking_number: any): Observable<HistoryOrder> {
    let historyOrderUrl = this.apiUrl + 'track_shipping';
    let httpParams = new HttpParams();
    httpParams = httpParams.append('courier', courier);
    httpParams = httpParams.append('tracking_number', tracking_number);
    return this.http.post<HistoryOrder>(historyOrderUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postTrackShipping', courier))
      );
  }

  /** GET Track Shipping JNE from the server */
  getTrackShipping (token: any, cnote_no: any): Observable<HistoryOrder[]> {
    let historyOrderUrl = this.apiUrl + 'track_shipping_jne?token=' + token + '&cnote_no=' + cnote_no;
    return this.http.get<HistoryOrder[]>(historyOrderUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTrackShipping', []))
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
    this.messageService.add('HistoryOrderService: ' + message);
  }

}
