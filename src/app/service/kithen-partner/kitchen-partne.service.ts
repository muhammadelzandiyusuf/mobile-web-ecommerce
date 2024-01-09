import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { KitchenPartner } from './kitchen-partner';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class KitchenPartneService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET list kitchen partner from the server */
  getKitchenPartners (sidx: any, sort: any, limit: any, offset: any): Observable<KitchenPartner[]> {
    let kitchenPartnerUrl = this.apiUrl + 'kitchen_partner?sidx=' + sidx  + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<KitchenPartner[]>(kitchenPartnerUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getKitchenPartners', []))
      );
  }

  /** GET detail kitchen partner from the server */
  getKitchenPartnerDetails (url: any): Observable<KitchenPartner[]> {
    let careerUrl = this.apiUrl + 'kitchen_partner/detail?url=' + url;
    return this.http.get<KitchenPartner[]>(careerUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getKitchenPartnerDetails', []))
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
