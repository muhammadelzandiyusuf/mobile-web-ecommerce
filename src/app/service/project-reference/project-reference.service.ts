import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { ProjectReference } from './project-reference';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ProjectReferenceService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET project reference province from the server */
  getProjectReferenceProvince (): Observable<ProjectReference[]> {
    let projectUrl = this.apiUrl + 'project_reference/province';
    return this.http.get<ProjectReference[]>(projectUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProjectReferenceProvince', []))
      );
  }

  /** GET project reference by province from the server */
  getProjectReferenceByProvince (province_id: any, sidx: any, sort: any, limit: any, start: any): Observable<ProjectReference[]> {
    let projectUrl = this.apiUrl + 'project_reference?province_id=' + province_id + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<ProjectReference[]>(projectUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProjectReferenceByProvince', []))
      );
  }

  /** GET project reference detail from the server */
  getProjectReferenceDetail (url: any): Observable<ProjectReference[]> {
    let projectUrl = this.apiUrl + 'project_reference/detail?url=' + url;
    return this.http.get<ProjectReference[]>(projectUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProjectReferenceDetail', []))
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
