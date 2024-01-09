import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { ContactUs } from './contact-us';
import { PaymentMethod } from './payment-method';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ContactUsService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET contact us from the server */
  getContactUs (): Observable<ContactUs[]> {
    let contactUrl = this.apiUrl + 'contact_us'
    return this.http.get<ContactUs[]>(contactUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getContactUs', []))
      );
  }

  /** GET payments method & Channel from the server */
  getMethodPaymentsChannel (): Observable<PaymentMethod[]> {
    let contactUrl = this.apiUrl + 'contact_us/payment_method'
    return this.http.get<PaymentMethod[]>(contactUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getMethodPaymentsChannel', []))
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
    this.messageService.add('ContactUsService: ' + message);
  }

}
