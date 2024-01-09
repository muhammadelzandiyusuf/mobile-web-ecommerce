import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { AboutUs } from './about-us';
import { Milestone } from './milestone';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class AboutUsService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET about us from the server */
  getAboutUs (): Observable<AboutUs[]> {
    let aboutUrl = this.apiUrl + 'about_us'
    return this.http.get<AboutUs[]>(aboutUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getAboutUs', []))
      );
  }

  /** GET milestones from the server */
  getMilestones (): Observable<Milestone[]> {
    let milestoneUrl = this.apiUrl + 'milestone'
    return this.http.get<Milestone[]>(milestoneUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getMilestones', []))
      );
  }

  /** GET award from the server */
  getAwards (): Observable<Milestone[]> {
    let awardUrl = this.apiUrl + 'award'
    return this.http.get<Milestone[]>(awardUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getAwards', []))
      );
  }

  /** GET Domain from the server */
  getDomain (): Observable<AboutUs[]> {
    let aboutUrl = this.apiUrl + 'domain'
    return this.http.get<AboutUs[]>(aboutUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getDomain', []))
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
    this.messageService.add('AboutUsService: ' + message);
  }

}
