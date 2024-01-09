import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { InstallationVideo } from './installation-video';
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
export class InstallationVideoService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET installation video category from the server */
  getInstallationVideoCategory (): Observable<InstallationVideo[]> {
    let installationVideoUrl = this.apiUrl + 'installation_video/category';
    return this.http.get<InstallationVideo[]>(installationVideoUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getInstallationVideoCategory', []))
      );
  }

  /** GET installation video from the server */
  getInstallationVideo (sidx: any, sort: any, limit: any, start: any, category: any): Observable<InstallationVideo[]> {
    let installationVideoUrl = this.apiUrl + 'installation_video?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start + '&category[]=' + category;
    return this.http.get<InstallationVideo[]>(installationVideoUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getInstallationVideo', []))
      );
  }

  /** GET installation video Detail from the server */
  getInstallationVideoDetail (id: any): Observable<InstallationVideo[]> {
    let recipeUrl = this.apiUrl + 'installation_video/detail?id=' + id;
    return this.http.get<InstallationVideo[]>(recipeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getInstallationVideoDetail', []))
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
    this.messageService.add('InstallationVideoService: ' + message);
  }

}
