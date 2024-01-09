import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { City } from './city';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class CityService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET City from the server */
  getCities (province_id: any): Observable<City[]> {
    let cityUrl = this.apiUrl + 'cities?province_id=' + province_id;
    return this.http.get<City[]>(cityUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCities', []))
      );
  }

  /** GET subdistrict from the server */
  getSubdistricts (city_id: any): Observable<City[]> {
    let cityUrl = this.apiUrl + 'subdistricts?city_id=' + city_id;
    return this.http.get<City[]>(cityUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getSubdistricts', []))
      );
  }

  /** GET Free City from the server */
  getFreeCities (): Observable<City[]> {
    let cityUrl = this.apiUrl + 'free_city';
    return this.http.get<City[]>(cityUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getFreeCities', []))
      );
  }

  /** GET courier cost by product from the server */
  getCourierCostByProduct (city_id: any, subdist_id: any, product_id: any): Observable<City[]> {
    let cityUrl = this.apiUrl + 'courier_cost?destination_city=' + city_id + '&destination_subdistrict=' + subdist_id + '&product_id=' + product_id;
    return this.http.get<City[]>(cityUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCourierCostByProduct', []))
      );
  }

  /** GET courier cost by product from the server */
  getCourierCostByProductJNE (province_name: any, city_name: any, subdist_name: any, product_id: any, postal_code: any): Observable<City[]> {
    let cityUrl = this.apiUrl + 'jne_courier_cost?destination_province=' + province_name + '&destination_city=' + city_name + '&destination_subdistrict=' + subdist_name + '&product_id=' + product_id + '&postal_code=' + postal_code;
    return this.http.get<City[]>(cityUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCourierCostByProductJNE', []))
      );
  }

  /** GET shipping address by postal code from the server */
  getShippingAddressByPostalCode (postal_code: any, subdistrict: any): Observable<City[]> {
    let cityUrl = this.apiUrl + 'postal_shipping_address?postal_code=' + postal_code + '&subdistrict=' + subdistrict;
    return this.http.get<City[]>(cityUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getShippingAddressByPostalCode', []))
      );
  }

  /** GET cost address by postal code from the server */
  getTariffByPostalCode (tariff_code: any, product_id: any): Observable<City[]> {
    let cityUrl = this.apiUrl + 'postal_code_cost?tariff_code=' + tariff_code + '&product_id=' + product_id;
    return this.http.get<City[]>(cityUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getShippingByPostalCode', []))
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
    this.messageService.add('CityService: ' + message);
  }

}
