import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Cart } from './cart';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class CartService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET list cart promo from the server */
  getListCartPromo (promo: any, promo_code: any, productCode: any, token: any, warranty_id: any, service_id: any): Observable<Cart[]> {
    let cartUrl = this.apiUrl + 'checkout?promo=' + promo + '&promo_code=' + promo_code + '&code=' + productCode + '&token=' + token + '&warranty_id=' + warranty_id + '&service_id=' + service_id;
    return this.http.get<Cart[]>(cartUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getListCartPromo', []))
      );
  }

  /** GET list cart from the server */
  getListCart (token: any): Observable<Cart[]> {
    let cartUrl = this.apiUrl + 'cart?token=' + token;
    return this.http.get<Cart[]>(cartUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getListCart', []))
      );
  }

  /** GET count item cart from the server */
  getCountCart (token: any): Observable<Cart[]> {
    let cartUrl = this.apiUrl + 'cart/count?token=' + token;
    return this.http.get<Cart[]>(cartUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCountCart', []))
      );
  }

  /** GET validation cart from the server */
  getValidationCart (product_id: any): Observable<Cart[]> {
    let cartUrl = this.apiUrl + 'cart/validation?product_id=' + product_id;
    return this.http.get<Cart[]>(cartUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getValidationCart', []))
      );
  }

  // Add to cart
  postAdd (product_id: any, token: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/add';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('product_id', product_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postAdd', product_id))
      );
  }

  // Add to warranty
  postAddWarranty (cart_id: any, product_warranty_id: any, token: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/add_warranty';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('cart_id', cart_id);
    httpParams = httpParams.append('product_warranty_id', product_warranty_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postAddWarranty', token))
      );
  }

  // Edit to cart
  postEdit (cart_id: any, quantity: any, token: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/edit';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('cart_id', cart_id);
    httpParams = httpParams.append('quantity', quantity);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postEdit', cart_id))
      );
  }

  // Delete cart
  postDelete (cart_id: any, token: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/delete';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('cart_id', cart_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postDelete', cart_id))
      );
  }

  // Delete Warranty
  postDeleteWarranty (cart_id: any, token: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/delete_warranty';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('cart_id', cart_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postDeleteWarranty', cart_id))
      );
  }

  // Destroy cart
  postDestroy (token: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/destroy';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postDestroy', token))
      );
  }

  // Delete cart and Add To Wishlist
  postDeleteWishlist (cart_id: any, token: any): Observable<Cart> {
    let wishlistUrl = this.apiUrl + 'cart/delete_wishlist';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('cart_id', cart_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(wishlistUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postDeleteWishlist', cart_id))
      );
  }

  // Save login to cart
  postSave (product_id: any, quantity: any, customer_id: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/save';
    let httpParams = new HttpParams();
    httpParams = httpParams.append('product_id', product_id);
    httpParams = httpParams.append('quantity', quantity);
    httpParams = httpParams.append('customer_id', customer_id);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postSave', customer_id))
      );
  }

  // Add to contract service
  postAddContractService (cart_id: any, product_contract_service_id: any, token: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/add_contact_service';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('cart_id', cart_id);
    httpParams = httpParams.append('product_contract_service_id', product_contract_service_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postAddContractService', token))
      );
  }

  // Delete contract service
  postDeleteContractService (cart_id: any, token: any): Observable<Cart> {
    let cartUrl = this.apiUrl + 'cart/delete_contact_service';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('cart_id', cart_id);
    httpParams = httpParams.append('token', token);
  
    return this.http.post<Cart>(cartUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('postDeleteContractService', cart_id))
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
