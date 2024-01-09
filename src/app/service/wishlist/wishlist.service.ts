import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Wishlist } from './wishlist';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class WishlistService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET wishlist from the server */
  getWishlist (token: any): Observable<Wishlist[]> {
    let wishlistUrl = this.apiUrl + 'wishlist?token=' + token;
    return this.http.get<Wishlist[]>(wishlistUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getWishlist', []))
      );
  }

  /** GET last view from the server */
  getProductLastView (token: any): Observable<Wishlist[]> {
    let wishlistUrl = this.apiUrl + 'product_last_view?token=' + token;
    return this.http.get<Wishlist[]>(wishlistUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductLastView', []))
      );
  }

  // Add to Wishlist
  postAdd (product_id: any, token: any): Observable<Wishlist> {
    let wishlistUrl = this.apiUrl + 'wishlist/add';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('product_id', product_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Wishlist>(wishlistUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postAdd', product_id))
      );
  }

  // Delete Wishlist
  postDelete (wishlist_id: any): Observable<Wishlist> {
    let wishlistUrl = this.apiUrl + 'wishlist/delete';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('wishlist_id', wishlist_id);
  
    return this.http.post<Wishlist>(wishlistUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postDelete', wishlist_id))
      );
  }

  // Destroy Wishlist
  postDestroy (customer_id: any): Observable<Wishlist> {
    let wishlistUrl = this.apiUrl + 'wishlist/destroy';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('customer_id', customer_id);
  
    return this.http.post<Wishlist>(wishlistUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postDestroy', customer_id))
      );
  }

  // Add to Last View
  postAddLastView (product_id: any, token: any): Observable<Wishlist> {
    let wishlistUrl = this.apiUrl + 'product_last_view/add';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('product_id', product_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Wishlist>(wishlistUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postAddLastView', product_id))
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
