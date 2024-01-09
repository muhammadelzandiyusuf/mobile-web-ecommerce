import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { ServiceInstallation } from './service-installation';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ServiceInstallationService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET service category from the server */
  getServiceCategory (): Observable<ServiceInstallation[]> {
    let servicetUrl = this.apiUrl + 'service_installation/category';
    return this.http.get<ServiceInstallation[]>(servicetUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getServiceCategory', []))
      );
  }

  /** GET detail service category from the server */
  getDetailServiceCategory (url: any): Observable<ServiceInstallation[]> {
    let servicetUrl = this.apiUrl + 'service_installation/detail?url=' + url;
    return this.http.get<ServiceInstallation[]>(servicetUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getDetailServiceCategory', []))
      );
  }

  // Service Installation
  postServiceInstallation (service: ServiceInstallation, category: any, token: any, total_product: any): Observable<ServiceInstallation> {
    let serviceUrl = this.apiUrl + 'service_installation';
    let httpParams = new HttpParams();
    Object.keys(service).forEach(function (key) {
          httpParams = httpParams.append(key, service[key]);
    });
    httpParams = httpParams.append('category', category);
    httpParams = httpParams.append('token', token);
    httpParams = httpParams.append('total_product', total_product);
    return this.http.post<ServiceInstallation>(serviceUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Service Installation', service))
      );
  }

  postUploadImage(fileItem1:File, fileItem2:File, fileItem3:File):any{
    let apiCreateEndpoint = this.apiUrl + 'service_installation/upload';
    const formData = new FormData();

    formData.append('product_file_1', fileItem1, fileItem1.name);
    if(fileItem2) {
      formData.append('product_file_2', fileItem2, fileItem2.name);
    }
    if(fileItem3) {
      formData.append('product_file_3', fileItem3, fileItem3.name);
    }
    
    const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
      reportProgress: true // for progress data
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
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('ServiceInstallationService: ' + message);
  }

}
