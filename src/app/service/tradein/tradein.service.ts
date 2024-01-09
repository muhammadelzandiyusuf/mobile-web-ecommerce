import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { TradeIn } from './tradein';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { WarrantyProduct } from '../warranty/warranty-product';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class TradeinService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET banner tradein from the server */
  getTradeInBanner (): Observable<TradeIn[]> {
    let productUrl = this.apiUrl + 'tradein/banner';
    return this.http.get<TradeIn[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTradeInBanner', []))
      );
  }

  /** GET list product from the server */
  getTradeInProducttList (): Observable<TradeIn[]> {
    let productUrl = this.apiUrl + 'tradein/list';
    return this.http.get<TradeIn[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTradeInProducttList', []))
      );
  }

  /** GET list product from the server */
  getTradeInProductRequest (url: any, token: any): Observable<TradeIn[]> {
    let productUrl = this.apiUrl + 'tradein/product_request?url=' + url + '&token=' + token;
    return this.http.get<TradeIn[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTradeInProductRequest', []))
      );
  }

  /** GET list product from the server */
  getTradeInProductAvailable (id: any, token: any): Observable<TradeIn[]> {
    let productUrl = this.apiUrl + 'tradein/product_avilable?id=' + id + '&token=' + token;
    return this.http.get<TradeIn[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTradeInProductAvailable', []))
      );
  }

  /** GET tradein from the server */
  getTradeInProduct (status: any, token: any): Observable<TradeIn[]> {
    let productUrl = this.apiUrl + 'tradein?status=' + status + '&token=' + token;
    return this.http.get<TradeIn[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTradeInProduct', []))
      );
  }

  /** GET tradein from the server */
  getTradeInProductDetail (registration_no: any, token: any): Observable<TradeIn[]> {
    let productUrl = this.apiUrl + 'tradein/detail?registration_no=' + registration_no + '&token=' + token;
    return this.http.get<TradeIn[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTradeInProductDetail', []))
      );
  }

  // Trade in request
  tradeInRequest (tradein: TradeIn, token: any, product_id: any): Observable<TradeIn> {
    let registerUrl = this.apiUrl + 'tradein/request';
    let httpParams = new HttpParams();
    Object.keys(tradein).forEach(function (key) {
          httpParams = httpParams.append(key, tradein[key]);
    });
    httpParams = httpParams.append('token', token);
    httpParams = httpParams.append('product_id', product_id);
    return this.http.post<TradeIn>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('tradeInRequest', tradein))
      );
  }

  // Trade in request product by customer
  tradeInRequestByCustomer (token: any, product_id: any): Observable<TradeIn> {
    let registerUrl = this.apiUrl + 'tradein/request_product';
    let httpParams = new HttpParams();

    httpParams = httpParams.append('token', token);
    httpParams = httpParams.append('product_id', product_id);
    return this.http.post<TradeIn>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('tradeInRequestByCustomer', token))
      );
  }

  tradeInUploadImage(fileItem1:File, token: any):any{
    let apiCreateEndpoint = this.apiUrl + 'tradein/upload';
    const formData: FormData = new FormData();

    formData.append('product_file', fileItem1, fileItem1.name);
    formData.append('token', token);
    
    const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
      reportProgress: true // for progress data
    });
    return this.http.request(req)
  }

  /** GET search available product request customer from the server */
  getSearchAvailableProductRequest (search: any, brand_id: any): Observable<WarrantyProduct[]> {
    let warrantyUrl = this.apiUrl + 'tradein/avilable_product_request?search=' + search + '&brand_id=' + brand_id;
    return this.http.get<WarrantyProduct[]>(warrantyUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getSearchAvailableProductRequest', []))
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
    this.messageService.add('TardeinService: ' + message);
  }

}
