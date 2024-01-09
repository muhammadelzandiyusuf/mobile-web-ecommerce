import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Term } from './term';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class TermService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals) { }

    apiUrl = this.globals.apiUrl;

    /** GET footer menu from the server */
    getMenuFooter (publish: any, parent: any, sidx: any, sort: any): Observable<Term[]> {
      let footerMenuUrl = this.apiUrl + 'footer_menu?publish=' + publish + '&parent=' + parent + '&sidx=' + sidx + '&sort=' + sort;
      return this.http.get<Term[]>(footerMenuUrl, httpOptions)
        .pipe(
          catchError(this.handleError('getMenuFooter', []))
        );
    }

    /** GET footer menu by parent from the server */
    getMenuFooterByParent (publish: any, parent: any, sidx: any, sort: any): Observable<Term[]> {
      let footerMenuUrl = this.apiUrl + 'footer_menu/list?publish=' + publish + '&parent=' + parent + '&sidx=' + sidx + '&sort=' + sort;
      return this.http.get<Term[]>(footerMenuUrl, httpOptions)
        .pipe(
          catchError(this.handleError('getMenuFooterByParent', []))
        );
    }

    /** GET Child Term from the server */
    getChildTerm (parent: any): Observable<Term[]> {
      let termUrl = this.apiUrl + 'term/child?parent=' + parent;
      return this.http.get<Term[]>(termUrl, httpOptions)
        .pipe(
          catchError(this.handleError('getChildTerm', []))
        );
    }

    /** GET Child Term from the server */
    getBannerTerms (slug: any): Observable<Term[]> {
      let termUrl = this.apiUrl + 'term/banner?slug=' + slug;
      return this.http.get<Term[]>(termUrl, httpOptions)
        .pipe(
          catchError(this.handleError('getBannerTerms', []))
        );
    }

    /** GET Meta Tag Term from the server */
    getTagMeta (): Observable<Term[]> {
      let termUrl = this.apiUrl + 'term/meta';
      return this.http.get<Term[]>(termUrl, httpOptions)
        .pipe(
          catchError(this.handleError('getTagMeta', []))
        );
    }

    /** GET PDF File Warranty from the server */
    getTermConditionWarranty (): Observable<Term[]> {
      let termUrl = this.apiUrl + 'term/pdf_file';
      return this.http.get<Term[]>(termUrl, httpOptions)
        .pipe(
          catchError(this.handleError('getTermConditionWarranty', []))
        );
    }

    /** GET Term Menu Footer & Payment Channel from the server */
    getFooterMenuPaymentChannel (): Observable<Term[]> {
      let termUrl = this.apiUrl + 'term/menu_footer';
      return this.http.get<Term[]>(termUrl, httpOptions)
        .pipe(
          catchError(this.handleError('getFooterMenuPaymentChannel', []))
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
    this.messageService.add('TermService: ' + message);
  }

}
