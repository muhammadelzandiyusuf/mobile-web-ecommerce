import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { ShippingAddress } from './shipping-address';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ShippingAddressService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  // Add shipping address
  postAdd (shipping: ShippingAddress, token: any): Observable<ShippingAddress> {
    let shippingUrl = this.apiUrl + 'shipping_address/add';
    let httpParams = new HttpParams();
    
    Object.keys(shipping).forEach(function (key) {
        httpParams = httpParams.append(key, shipping[key]);
    });
    httpParams = httpParams.append('token', token);
    return this.http.post<ShippingAddress>(shippingUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postAdd', shipping))
      );
  }

  // Edit shipping address
  postEdit (shipping: ShippingAddress, id: any, token: any): Observable<ShippingAddress> {
    let shippingUrl = this.apiUrl + 'shipping_address/edit';
    let httpParams = new HttpParams();
    
    Object.keys(shipping).forEach(function (key) {
        httpParams = httpParams.append(key, shipping[key]);
    });
    httpParams = httpParams.append('id', id);
    httpParams = httpParams.append('token', token);
    return this.http.post<ShippingAddress>(shippingUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postEdit', shipping))
      );
  }

  // Delete shipping address
  postDelete (id: any, token: any): Observable<ShippingAddress> {
    let shippingUrl = this.apiUrl + 'shipping_address/delete';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('id', id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<ShippingAddress>(shippingUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postDelete', id))
      );
  }

  // Update shipping address
  postUpdate (id: any, token: any): Observable<ShippingAddress> {
    let shippingUrl = this.apiUrl + 'shipping_address/update';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('id', id);
    httpParams = httpParams.append('token', token);
    return this.http.post<ShippingAddress>(shippingUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postUpdate', id))
      );
  }

  // Get shipping address
  getShippingAddress (id: any, token: any): Observable<ShippingAddress> {
    let shippingUrl = this.apiUrl + 'shipping_address';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('id', id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<ShippingAddress>(shippingUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('getShippingAddress', id))
      );
  }

  /** GET list shipping address from the server */
  getListShippingAddress (token: any): Observable<ShippingAddress[]> {
    let shippingUrl = this.apiUrl + 'shipping_address?token=' + token;
    return this.http.get<ShippingAddress[]>(shippingUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getListShippingAddress', []))
      );
  }

  /** GET Active shipping address from the server */
  getActiveShippingAddress (token: any): Observable<ShippingAddress[]> {
    let shippingUrl = this.apiUrl + 'shipping_address/active?token=' + token;
    return this.http.get<ShippingAddress[]>(shippingUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getActiveShippingAddress', []))
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
