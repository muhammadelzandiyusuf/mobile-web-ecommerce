import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Bussiness } from './bussiness';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class BussinessService {

  results: any;
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  // Registrasi Customer
  bussinessRegister (bussiness: Bussiness): Observable<Bussiness> {
    let registerUrl = this.apiUrl + 'business/register';
    let httpParams = new HttpParams();
    Object.keys(bussiness).forEach(function (key) {
          httpParams = httpParams.append(key, bussiness[key]);
    });
    return this.http.post<Bussiness>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('register', bussiness))
      );
  }

  bussinessRegisterImage(fileItem1:File, fileItem2:File):any{
    let apiCreateEndpoint = this.apiUrl + 'business/upload';
    const formData: FormData = new FormData();

    formData.append('document_file_1', fileItem1, fileItem1.name);
    formData.append('document_file_2', fileItem2, fileItem2.name);
    
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
