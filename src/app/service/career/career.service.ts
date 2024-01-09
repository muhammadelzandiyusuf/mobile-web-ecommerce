import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { CareerAplicant } from './career-aplicant';
import { CareerPost } from './career-post';
import { CareerSpecialization } from './career-specialization';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class CareerService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET list career from the server */
  getCareerPost (sidx: any, sort: any, limit: any, offset: any): Observable<CareerPost[]> {
    let careerUrl = this.apiUrl + 'career/fulltimejob/list?sidx=' + sidx  + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<CareerPost[]>(careerUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCareerPost', []))
      );
  }

  /** GET list career from the server */
  getCareerSpecialization (): Observable<CareerSpecialization[]> {
    let careerUrl = this.apiUrl + 'career/specialization';
    return this.http.get<CareerSpecialization[]>(careerUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCareerSpecialization', []))
      );
  }

  /** GET detail career from the server */
  getCareerDetail (url: any): Observable<CareerPost[]> {
    let careerUrl = this.apiUrl + 'career/fulltimejob/detail?url=' + url;
    return this.http.get<CareerPost[]>(careerUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCareerDetail', []))
      );
  }

  // Registrasi Career Internship
  careerPostInternship (careerAplicant: CareerAplicant): Observable<CareerAplicant> {
    let registerUrl = this.apiUrl + 'career/internship';
    let httpParams = new HttpParams();
    Object.keys(careerAplicant).forEach(function (key) {
          httpParams = httpParams.append(key, careerAplicant[key]);
    });
    return this.http.post<CareerAplicant>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('careerPostInternship', careerAplicant))
      );
  }

  // Upload File Internship
  careerPostUploadInternship(photo_file:File, application_file:File, academy_file:File, cv_file:File):any{
    let apiCreateEndpoint = this.apiUrl + 'career/internship/upload';
    const formData: FormData = new FormData();

    formData.append('file_photo', photo_file, photo_file.name);
    formData.append('file_application', application_file, application_file.name);
    formData.append('file_academy', academy_file, academy_file.name);
    formData.append('file_cv', cv_file, cv_file.name);
    
    const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
      reportProgress: false // for progress data
    });

    return this.http.request(req);
  
  }

  // Registrasi Career Full Time Job
  careerPostFullTimeJob (careerAplicant: CareerAplicant, url: string): Observable<CareerAplicant> {
    let registerUrl = this.apiUrl + 'career/fulltimejob';
    let httpParams = new HttpParams();
    Object.keys(careerAplicant).forEach(function (key) {
          httpParams = httpParams.append(key, careerAplicant[key]);
    });
    httpParams = httpParams.append('url', url);
    return this.http.post<CareerAplicant>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('careerPostFullTimeJob', careerAplicant))
      );
  }

  // Upload File Full Time Job
  careerPostUploadFullTimeJob(photo_file:File, application_file:File, cv_file:File):any{
    let apiCreateEndpoint = this.apiUrl + 'career/fulltimejob/upload';
    const formData: FormData = new FormData();

    formData.append('file_photo', photo_file, photo_file.name);
    formData.append('file_application', application_file, application_file.name);
    formData.append('file_cv', cv_file, cv_file.name);
    
    const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
      reportProgress: false // for progress data
    });
    return this.http.request(req)
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
