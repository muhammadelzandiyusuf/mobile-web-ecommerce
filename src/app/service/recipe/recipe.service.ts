import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';
import { Recipe } from './recipe';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class RecipeService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET Recipe from the server */
  getRecipes (sidx: any, sort: any, limit: any, start: any, course: any, cuisine: any, host: any, brand: any): Observable<Recipe[]> {
    let recipeUrl = this.apiUrl + 'recipe?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start + '&course[]=' + course + '&cuisine[]=' + cuisine + '&host[]=' + host + '&brand[]=' + brand;
    return this.http.get<Recipe[]>(recipeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getRecipes', []))
      );
  }

  /** GET Recipe Detail from the server */
  getRecipeDetail (url: any): Observable<Recipe[]> {
    let recipeUrl = this.apiUrl + 'recipe/detail?url=' + url;
    return this.http.get<Recipe[]>(recipeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getRecipeDetail', []))
      );
  }

  /** GET Recipe Course from the server */
  getRecipeCourse (): Observable<Recipe[]> {
    let recipeUrl = this.apiUrl + 'recipe/course';
    return this.http.get<Recipe[]>(recipeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getRecipeCourse', []))
      );
  }

  /** GET Recipe Cuisine from the server */
  getRecipeCuisine (): Observable<Recipe[]> {
    let recipeUrl = this.apiUrl + 'recipe/cuisine';
    return this.http.get<Recipe[]>(recipeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getRecipeCuisine', []))
      );
  }

  /** GET Recipe Host from the server */
  getRecipeHost (): Observable<Recipe[]> {
    let recipeUrl = this.apiUrl + 'recipe/host';
    return this.http.get<Recipe[]>(recipeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getRecipeHost', []))
      );
  }

  /** GET Recipe Brand from the server */
  getRecipeBrand (): Observable<Recipe[]> {
    let recipeUrl = this.apiUrl + 'recipe/brand';
    return this.http.get<Recipe[]>(recipeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getRecipeBrand', []))
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
    this.messageService.add('RecipeService: ' + message);
  }


}
