import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Contractor } from './contractor';
import { ContractorContact } from './contractor-contact';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ContractorService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET contractor from the server */
  getContractor (sidx: any, sort: any, limit: any, start: any): Observable<Contractor[]> {
    let contractorUrl = this.apiUrl + 'contractor?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<Contractor[]>(contractorUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getContractor', []))
      );
  }

  /** GET contractor detail from the server */
  getContractorDetail (url: any): Observable<Contractor[]> {
    let contractorUrl = this.apiUrl + 'contractor/detail?url=' + url;
    return this.http.get<Contractor[]>(contractorUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getContractorDetail', []))
      );
  }

  /** GET contractor portfolio detail from the server */
  getContractorPortfolioDetail (url: any): Observable<Contractor[]> {
    let contractorUrl = this.apiUrl + 'contractor/portfolio?url=' + url;
    return this.http.get<Contractor[]>(contractorUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getContractorPortfolioDetail', []))
      );
  }

  // Create contractor contact
  createContractorContact (contractor_id: any, contractor: ContractorContact): Observable<ContractorContact> {
    let contractorUrl = this.apiUrl + 'contractor/contact';
    let httpParams = new HttpParams();
    Object.keys(contractor).forEach(function (key) {
          httpParams = httpParams.append(key, contractor[key]);
    });
    httpParams = httpParams.append('contractor_id', contractor_id);
    return this.http.post<ContractorContact>(contractorUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('create', contractor))
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
      // log to console instead
 
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
