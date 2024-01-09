import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Category } from './category';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class CategoryService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals) { }

  apiUrl = this.globals.apiUrl;

  /** GET list category home from the server */
  getCategoryByParentHome (publish: any, sidx: any, sort: any, limit: any, start: any): Observable<Category[]> {
    let categoryUrl = this.apiUrl + '/category/list?publish=' + publish + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<Category[]>(categoryUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCategoryByParentHome', []))
      );
  }

  /** GET list category from the server */
  getCategories (publish: any, sidx: any, sort: any): Observable<Category[]> {
    let categoryUrl = this.apiUrl + '/category?publish=' + publish + '&sidx=' + sidx + '&sort=' + sort;
    return this.http.get<Category[]>(categoryUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCategories', []))
      );
  }

  /** GET list category by parent from the server */
  getCategoryByParent (parent: any, publish: any, sidx: any, sort: any): Observable<Category[]> {
    let categoryUrl = this.apiUrl + '/category/list?parent=' + parent + '&publish=' + publish + '&sidx=' + sidx + '&sort=' + sort;
    return this.http.get<Category[]>(categoryUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCategoryByParent', []))
      );
  }

  /** GET list category compare from the server */
  getCategoryCompare (id: any): Observable<Category[]> {
    let categoryUrl = this.apiUrl + '/category/compare?id=' + id;
    return this.http.get<Category[]>(categoryUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCategoryCompare', []))
      );
  }

  /** GET list category kitchen partner from the server */
  getCategoryKitchenPartner (): Observable<Category[]> {
    let categoryUrl = this.apiUrl + '/category/kitchen';
    return this.http.get<Category[]>(categoryUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCategoryKitchenPartner', []))
      );
  }

  /** GET list category child from the server */
  getCategoryByChild (url: any): Observable<Category[]> {
    let categoryUrl = this.apiUrl + '/category/child?url=' + url;
    return this.http.get<Category[]>(categoryUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCategoryByChild', []))
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
    this.messageService.add(message);
  }

}
