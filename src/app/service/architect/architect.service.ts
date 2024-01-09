import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Architect } from './architect';
import { ArchitectContact } from './architect-contact';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ArchitectService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET architect category from the server */
  getArchitectCategory (): Observable<Architect[]> {
    let architectUrl = this.apiUrl + 'architect/category';
    return this.http.get<Architect[]>(architectUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getArchitectCategory', []))
      );
  }

  /** GET architect by category from the server */
  getArchitectByCategory (id: any, sidx: any, sort: any, limit: any, start: any): Observable<Architect[]> {
    let architectUrl = this.apiUrl + 'architect?id=' + id + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<Architect[]>(architectUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getArchitectByCategory', []))
      );
  }

  /** GET architect detail from the server */
  getArchitectDetail (url: any): Observable<Architect[]> {
    let architectUrl = this.apiUrl + 'architect/detail?url=' + url;
    return this.http.get<Architect[]>(architectUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getArchitectDetail', []))
      );
  }

  /** GET architect portfolio detail from the server */
  getArchitectPortfolioDetail (url: any): Observable<Architect[]> {
    let architectUrl = this.apiUrl + 'architect/portfolio?url=' + url;
    return this.http.get<Architect[]>(architectUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getArchitectPortfolioDetail', []))
      );
  }

  // Create architect contact
  createArchitectContact (architect_id: any, architect: ArchitectContact): Observable<ArchitectContact> {
    let architectUrl = this.apiUrl + 'architect/contact';
    let httpParams = new HttpParams();
    Object.keys(architect).forEach(function (key) {
          httpParams = httpParams.append(key, architect[key]);
    });
    httpParams = httpParams.append('architect_id', architect_id);
    return this.http.post<ArchitectContact>(architectUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('create', architect))
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
    this.messageService.add('ArchitectService: ' + message);
  }

}
