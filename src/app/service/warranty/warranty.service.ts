import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Warranty } from './warranty';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { WarrantyProduct } from './warranty-product';
import { DatePipe } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class WarrantyService {

  pipe = new DatePipe('en-ID');
  date_purchase1: string;
  date_purchase2: string;
  date_purchase3: string;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET Cek Kode Warranty from the server */
  getWarrantyCekCode (code: any, brand_id: any): Observable<Warranty[]> {
    let warrantyUrl = this.apiUrl + 'warranty/cek_code?code=' + code + '&brand_id=' + brand_id;
    return this.http.get<Warranty[]>(warrantyUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getWarrantyCekCode', []))
      );
  }

  /** GET search warranty product from the server */
  getSearchWarrantyProduct (search: any, brand_id: any): Observable<WarrantyProduct[]> {
    let warrantyUrl = this.apiUrl + 'warranty/search_product?search=' + search + '&brand_id=' + brand_id;
    return this.http.get<WarrantyProduct[]>(warrantyUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getSearchWarrantyProduct', []))
      );
  }

  // Registrasi Warranty
  postRegistrasiWarranty (warranty: Warranty, product_id_1: any, product_id_2: any, product_id_3: any, purchase_date_1: any, purchase_date_2: any, purchase_date_3: any, total_product: any): Observable<Warranty> {
    let warrantyUrl = this.apiUrl + 'warranty';
    let httpParams = new HttpParams();
    let date_purchase_1 = this.pipe.transform(purchase_date_1, 'y-M-d');
    let date_purchase_2 = this.pipe.transform(purchase_date_2, 'y-M-d');
    let date_purchase_3 = this.pipe.transform(purchase_date_3, 'y-M-d');
    Object.keys(warranty).forEach(function (key) {
          httpParams = httpParams.append(key, warranty[key]);
    });
    httpParams = httpParams.append('product_id_1', product_id_1);
    httpParams = httpParams.append('product_id_2', product_id_2);
    httpParams = httpParams.append('product_id_3', product_id_3);
    httpParams = httpParams.append('date_purchase_1', date_purchase_1);
    httpParams = httpParams.append('date_purchase_2', date_purchase_2);
    httpParams = httpParams.append('date_purchase_3', date_purchase_3);
    httpParams = httpParams.append('total_product', total_product);
    return this.http.post<Warranty>(warrantyUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postRegistrasiWarranty', warranty))
      );
  }

  // Upload Image Warranty
  warrantyUploadImage(card_image_1: File, card_image_2: File, card_image_3: File):any{
    let warrantyUrl = this.apiUrl + 'warranty/upload';
    const formData: FormData = new FormData();

    formData.append('card_image_1', card_image_1, card_image_1.name);
    if(card_image_2) {
      formData.append('card_image_2', card_image_2, card_image_2.name);
    }
    if(card_image_3) {
      formData.append('card_image_3', card_image_3, card_image_3.name);
    }
    
    const req = new HttpRequest('POST', warrantyUrl, formData, {
      reportProgress: true // for progress data
    });
    return this.http.request(req)
  }

  /** GET download file pdf from the server */
  getWarrantyFile (): Observable<Warranty[]> {
    let warrantyUrl = this.apiUrl + 'warranty/download_pdf';
    return this.http.get<Warranty[]>(warrantyUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getWarrantyFile', []))
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
    this.messageService.add('WarrantyService: ' + message);
  }

}
