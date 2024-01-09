import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Product } from './product';
import { ProductContact } from './product-contact';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class ProductService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals) { }

  apiUrl = this.globals.apiUrl;

  /** GET list product from the server */
  getProductList (publish: any, sidx: any, sort: any, limit: any, start: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/list?publish=' + publish + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductList', []))
      );
  }

  /** GET list product from the server */
  getProductByCategory (category: any, brand: any, publish: any, sidx: any, sort: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/category?category=' + category + '&publish=' + publish + '&sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset + '&token=' + token + '&brand=' + brand;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductByCategory', []))
      );
  }

  /** GET list product from the server */
  getProductByBrand (brand: any, category: any, publish: any, sidx: any, sort: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/brand?brand=' + brand + '&publish=' + publish + '&sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset + '&token=' + token + '&category=' + category;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductByBrand', []))
      );
  }

  /** GET list product from the server */
  getProductByParent (category: any, publish: any, sidx: any, sort: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/parent?category=' + category + '&publish=' + publish + '&sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + offset + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductByParent', []))
      );
  }

  /** GET list product package deal from the server */
  getProductPackageDeal (publish: any, sidx: any, sort: any, limit: any, offset: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/packagedeal?publish=' + publish + '&sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductPackageDeal', []))
      );
  }

  /** GET list product free item deal from the server */
  getProductGetFree (publish: any, sidx: any, sort: any, limit: any, offset: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/free_item?publish=' + publish + '&sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductGetFree', []))
      );
  }

  /** GET list product package accessories from the server */
  getProductPackageAccessories (publish: any, sidx: any, sort: any, limit: any, offset: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/accessories?publish=' + publish + '&sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductPackageAccessories', []))
      );
  }

  /** GET list product from the server */
  getProducDetail (id: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/detail?id=' + id + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductList', []))
      );
  }

  /** GET list product from the server */
  getProducDetailPackage (id: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/detail/package?id=' + id + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductList', []))
      );
  }

  /** GET list product from the server */
  getProducDetailPackageItem (id: any, item_id: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/detail/package?id=' + id + '&item_id=' + item_id;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductList', []))
      );
  }

  /** GET list product from the server */
  getProducDetailPackageAccessories (id: any, access_id: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/detail/package?id=' + id + '&access_id=' + access_id;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductList', []))
      );
  }

  /** GET list product accessories from the server */
  getProducAccessories (url: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/accessories?url=' + url;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProducAccessories', []))
      );
  }

  /** POST Product Contact to the server */
  postProductContact (productContact: ProductContact, product_id: any): Observable<ProductContact> {
    let registerUrl = this.apiUrl + 'product/contact';
    let httpParams = new HttpParams();
    Object.keys(productContact).forEach(function (key) {
          httpParams = httpParams.append(key, productContact[key]);
    });
    httpParams = httpParams.append('product_id', product_id);
    return this.http.post<ProductContact>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Prodcut Contact Post', productContact))
      );
  }

  /** POST Product Issue to the server */
  postProductIssue (token: any, product_id: any, comment: any): Observable<ProductContact> {
    let registerUrl = this.apiUrl + 'product/product_issue';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('token', token);
    httpParams = httpParams.append('product_id', product_id);
    httpParams = httpParams.append('comment', comment['comment']);

    return this.http.post<ProductContact>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Prodcut Contact Post', comment))
      );
  }

  /** POST Product Discuss to the server */
  postProductDiscuss (parent: any, product_id: any, token: any, text: any): Observable<ProductContact> {
    let registerUrl = this.apiUrl + 'product/discussion';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('parent', parent);
    httpParams = httpParams.append('token', token);
    httpParams = httpParams.append('product_id', product_id);
    httpParams = httpParams.append('text', text);
    return this.http.post<ProductContact>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Prodcut Discuss Post', text))
      );
  }

  /** POST Product request to the server */
  postProductRequest (email: any, product_id: any): Observable<ProductContact> {
    let registerUrl = this.apiUrl + 'product/request';
    let httpParams = new HttpParams();
    
    httpParams = httpParams.append('email', email);
    httpParams = httpParams.append('product_id', product_id);

    return this.http.post<ProductContact>(registerUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('Prodcut request Post', email))
      );
  }

  /** GET list deal zone from the server */
  getProductDealZones (sidx: any, sort: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/deal_zones?sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductDealZones', []))
      );
  }

  /** GET list sale items from the server */
  getProductSaleItems (sidx: any, sort: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/sale_item?sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductDealZones', []))
      );
  }

  /** GET list sale event from the server */
  getProductSaleEvents (sidx: any, sort: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/sale_event?sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductDealZones', []))
      );
  }

  /** GET list sale event from the server */
  getProductSearch(search: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/search?search=' + search + '&limit=' + limit + '&start=' + offset + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductSearch', []))
      );
  }

  /** GET compare product from the server */
  getProductCompare(compare: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/compare?compare=' + compare;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductCompare', []))
      );
  }

  /** GET able to compare from the server */
  getProductAbleToCompare(category: any, first_id: any, second_id: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/able_compare?category=' + category + '&first_id=' + first_id + '&second_id=' + second_id;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductAbleToCompare', []))
      );
  }

  /** GET list product best seller from the server */
  getProductBestSeller (sidx: any, sort: any, limit: any, start: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product_home/best_seller?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductBestSeller', []))
      );
  }

  /** GET list product new collection from the server */
  getProductNewCollection (sidx: any, sort: any, limit: any, start: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product_home/new_collection?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductNewCollection', []))
      );
  }

  /** GET list product pre order from the server */
  getProductPreOrder (sidx: any, sort: any, limit: any, start: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product_home/pre_order?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductPreOrder', []))
      );
  }

  /** GET list product top picks from the server */
  getProductTopPicks (sidx: any, sort: any, limit: any, start: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product_home/top_picks?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductTopPicks', []))
      );
  }

  /** GET Search Autocomplate from the server */
  getProductSearchAuto(search: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/search_product?search=' + search + '&limit=' + limit + '&start=' + offset + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductSearchAuto', []))
      );
  }

  /** GET Product Quick Compare from the server */
  getProductQuickCompares(product_id: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/quick_compare?product_id=' + product_id + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductQuickCompares', []))
      );
  }

  /** GET list product promo from the server */
  getProductMenuNav (): Observable<Product[]> {
    let productUrl = this.apiUrl + 'navbar_menu';
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductMenuNav', []))
      );
  }

  /** GET list hot spectacular from the server */
  getProductHotSpectacular (sidx: any, sort: any, limit: any, offset: any, token: any): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/hot_spectacular?sidx=' + sidx + '&sort=' + sort  + '&limit=' + limit + '&start=' + offset + '&token=' + token;
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductHotSpectacular', []))
      );
  }

  /** GET list commercial from the server */
  getProductCommercial (): Observable<Product[]> {
    let productUrl = this.apiUrl + 'product/commercial';
    return this.http.get<Product[]>(productUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProductCommercial', []))
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
    this.messageService.add('ProductService: ' + message);
  }

}
