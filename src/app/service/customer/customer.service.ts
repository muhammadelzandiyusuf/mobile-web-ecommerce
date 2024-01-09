import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import {Customer} from './customer';
import {Activation} from './activation';
import {Login} from './login';
import {Globals} from '../../service/global';
import {MessageService} from './../../service/message.service';
import {Bussiness} from '../bussiness/bussiness';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
    })
};

@Injectable()
export class CustomerService {

    constructor(
        private http : HttpClient,
        private messageService : MessageService,
        private globals : Globals
    ) {}

    apiUrl = this.globals.apiUrl;

    // Registrasi Customer
    register(customer : Customer, token: any): Observable<Customer> {
        let registerUrl = this.apiUrl + 'customer/register';
        let httpParams = new HttpParams();
        Object
            .keys(customer)
            .forEach(function (key) {
                httpParams = httpParams.append(key, customer[key]);
            });
            httpParams = httpParams.append('token', token);
        return this
            .http
            .post<Customer>(registerUrl, httpParams, httpOptions)
            .pipe(catchError(this.handleError('register', customer)));
    }

    // Activation Customer
    activation(activation : Activation): Observable<Activation> {
        let activationrUrl = this.apiUrl + 'activation';
        let httpParams = new HttpParams();
        Object
            .keys(activation)
            .forEach(function (key) {
                httpParams = httpParams.append(key, activation[key]);
            });
        return this
            .http
            .post<Activation>(activationrUrl, httpParams, httpOptions)
            .pipe(catchError(this.handleError('activation', activation)));
    }

    // Login Customer
    userLogin(login : Login): Observable<Login> {
        let loginUrl = this.apiUrl + 'login';
        let httpParams = new HttpParams();
       
        httpParams = httpParams.append('password', login['password']);
        httpParams = httpParams.append('email', login['email']);

        return this
            .http
            .post<Login>(loginUrl, httpParams, httpOptions)
            .pipe(catchError(this.handleError('login', login)));
    }

    /** GET list customer from the server */
    getDetailCustomer(token: any): Observable<Bussiness[]> {
        let customerUrl = this.apiUrl + '/customer?token=' + token;
        return this
            .http
            .get<Bussiness[]>(customerUrl, httpOptions)
            .pipe(catchError(this.handleError('getBrands', [])));
    }

    /** Post Login Facebook */
    userLoginProviderFb(login : any): Observable<Login> {
        let loginUrl = this.apiUrl + 'facebook/callback';
        let httpParams = new HttpParams();
        Object
            .keys(login)
            .forEach(function (key) {
                httpParams = httpParams.append(key, login[key]);
            });
        return this
            .http
            .post<Login>(loginUrl, httpParams, httpOptions)
            .pipe(catchError(this.handleError('login', login)));
    }

    /** Post Login Google */
    userLoginProviderGoogle(login : any): Observable<Login> {
        let loginUrl = this.apiUrl + 'google/callback';
        let httpParams = new HttpParams();
        Object
            .keys(login)
            .forEach(function (key) {
                httpParams = httpParams.append(key, login[key]);
            });
        return this
            .http
            .post<Login>(loginUrl, httpParams, httpOptions)
            .pipe(catchError(this.handleError('login', login)));
    }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
    private handleError<T>(operation = 'operation', result? : T) {
        return(error : any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure console.error(error);
            // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${error.status}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message : string) {
        this
            .messageService
            .add(message);
    }

}
