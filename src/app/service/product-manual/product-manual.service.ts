import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { ProductManual } from './product-manual';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Category } from '../category/category';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ProductManualService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET product manual category from the server */
  getProductManualCategory (): Observable<ProductManual[]> {
    let productManualUrl = this.apiUrl + 'product_manual/category';
    return this.http.get<ProductManual[]>(productManualUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductManualCategory', []))
      );
  }

  /** GET product manual from the server */
  getProductManual (sidx: any, sort: any, limit: any, start: any, category: any): Observable<ProductManual[]> {
    let productManualUrl = this.apiUrl + 'product_manual?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start + '&category[]=' + category;
    return this.http.get<ProductManual[]>(productManualUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductManual', []))
      );
  }

  /** GET Product Manual Detail from the server */
  getProductManualDetail (url: any): Observable<ProductManual[]> {
    let recipeUrl = this.apiUrl + 'product_manual/detail?url=' + url;
    return this.http.get<ProductManual[]>(recipeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductManualDetail', []))
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
    this.messageService.add('ProductManualService: ' + message);
  }

}
