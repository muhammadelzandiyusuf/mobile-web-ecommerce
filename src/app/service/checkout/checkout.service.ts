import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Courier } from './courier';
import { Checkout } from './checkout';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class CheckoutService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET list payment method channel courier from the server */
  getPaymentMethodChannel (token: any): Observable<Courier[]> {
    let courierUrl = this.apiUrl + 'checkout/payment_method?token=' + token;
    return this.http.get<Courier[]>(courierUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getPaymentMethodChannel', []))
      );
  }

  /** GET list service courier from the server */
  getListCourier (city_id: any, subdistrict_id: any, token: any, promo: any, promo_code: any, productCode: any, postal_code: any): Observable<Courier[]> {
    let courierUrl = this.apiUrl + 'checkout/service_voucher?destination_city=' + city_id + '&destination_subdistrict=' + subdistrict_id + '&token=' + token + '&promo=' + promo + '&promo_code=' + promo_code + '&code=' + productCode + '&postal_code=' + postal_code;
    return this.http.get<Courier[]>(courierUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getListCourier', []))
      );
  }

  /** GET use promo from the server */
  getUseVoucherCoupon (promo: any, code: any, token: any): Observable<Courier[]> {
    let courierUrl = this.apiUrl + 'checkout/use_promo?promo=' + promo + '&code=' + code + '&token=' + token;
    return this.http.get<Courier[]>(courierUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getUseVoucherCoupon', []))
      );
  }

  //Checkout Payment
  checkoutPayment (checkout: Checkout): Observable<Checkout> {
    let checkoutUrl = this.apiUrl + 'checkout';
    let httpParams = new HttpParams();
    
    Object.keys(checkout).forEach(function (key) {
      httpParams = httpParams.append(key, checkout[key]);
    });
    return this.http.post<Checkout>(checkoutUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('checkoutPayment', checkout))
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
