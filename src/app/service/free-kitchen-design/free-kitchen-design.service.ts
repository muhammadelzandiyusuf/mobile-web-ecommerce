import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { FreeKitchenDesign } from './free-kitchen-design';
import { FreeKitchenDesignContact } from './free-kitchen-design-contact';
import { KitchenPartner } from '../kithen-partner/kitchen-partner';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};


@Injectable()
export class FreeKitchenDesignService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET list kitchen design from the server */
  getKitchenDesigns (kitchen_id: any, sidx: any, sort: any, limit: any, offset: any): Observable<FreeKitchenDesign[]> {
    let kitchenDesignUrl = this.apiUrl + 'kitchen_design?kitchen_id=' + kitchen_id + '&sidx=' + sidx  + '&sort=' + sort + '&limit=' + limit + '&start=' + offset;
    return this.http.get<FreeKitchenDesign[]>(kitchenDesignUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getKitchenDesigns', []))
      );
  }

  /** GET detail kitchen design from the server */
  getKitchenDesignDetail (url: any): Observable<FreeKitchenDesign[]> {
    let kitchenDesignUrl = this.apiUrl + 'kitchen_design/detail?url=' + url;
    return this.http.get<FreeKitchenDesign[]>(kitchenDesignUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getKitchenDesignDetail', []))
      );
  }

  // Free Kitchen Design Contact
  freeKitchenDesignContact (freeKitchen: FreeKitchenDesignContact, kitchen_partner_id: any, preferredDesign: any, categories: any, brands: any): Observable<FreeKitchenDesignContact> {
    let kitchenDesignUrl = this.apiUrl + 'free_kitchen_design';
    let httpParams = new HttpParams();
    Object.keys(freeKitchen).forEach(function (key) {
          httpParams = httpParams.append(key, freeKitchen[key]);
    });
   
    httpParams = httpParams.append('kitchen_partner_id', kitchen_partner_id);
    httpParams = httpParams.append('preferred_designs', preferredDesign);
    httpParams = httpParams.append('categories', categories);
    httpParams = httpParams.append('brands', brands);
    return this.http.post<FreeKitchenDesignContact>(kitchenDesignUrl, httpParams, httpOptions)
      .pipe(
        catchError(this.handleError('freeKitchenDesignContact', freeKitchen))
      );
  }

  // Free Kitchen Design Uplod
  freeKitchenDesignUpload(layout_plan:File):any{
    let apiCreateEndpoint = this.apiUrl + 'free_kitchen_design/upload';
    const formData: FormData = new FormData();

    formData.append('layout_design', layout_plan, layout_plan.name);
    
    const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
      reportProgress: true // for progress data
    });
    return this.http.request(req)
  }

  /** GET detail kitchen design from the server */
  getKitchenPartners (id: any): Observable<KitchenPartner[]> {
    let kitchenDesignUrl = this.apiUrl + 'free_kitchen_design/kitchen_partner?id=' + id;
    return this.http.get<KitchenPartner[]>(kitchenDesignUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getKitchenPartners', []))
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
