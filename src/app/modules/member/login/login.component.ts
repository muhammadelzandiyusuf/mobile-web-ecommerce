import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import {Router, NavigationEnd} from "@angular/router";
import { Location } from '@angular/common';

import {ToastrService} from 'ngx-toastr';

import {Login} from '../../../service/customer/login';
import {CustomerService} from '../../../service/customer/customer.service';
import {MessageService} from './../../../service/message.service';

import {LocalStorageService} from 'ngx-webstorage';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser} from 'angular5-social-auth';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { CartService } from '../../../service/cart/cart.service';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Component(
    {selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.css']}
)
export class LoginComponent implements OnInit, OnDestroy {
    subcription: Subscription;
    navigationSubscription: any

    model = new Login();
    user: any;
    customer: any;
    login = new Login();

    loginForm: FormGroup;
    pwdPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9- ]).{8,30}$";

    public data: any = [];

    users: SocialUser;
    loggedInFb: boolean = false;
    loggedInGoogle: boolean = false;
    metaTag: any;
    carts: any = null
    lang: any;

    key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
    spinner: boolean = false;

    constructor(
        private localSt : LocalStorageService,
        private customerService : CustomerService,
        public messageService : MessageService,
        private toastr : ToastrService,
        private router : Router,
        private socialAuthService : AuthService,
        private termService : TermService,
        private meta : Meta,
        private titleService: Title,
        private cartService: CartService,
        private location: Location,
    ) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
              this.initialiseInvites();
            }
          });
        this.createForm();
        this.getMeta()
        this.titleService.setTitle('KitchenArt - Login');
    }

    initialiseInvites() {
        this.carts = this.localSt.retrieve('carts')
        this.lang = this.localSt.retrieve('lang');  
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.navigationSubscription) {
          this.navigationSubscription.unsubscribe();
        }
        if(this.subcription){
          this.subcription.unsubscribe();
        }
    }

    createForm() {
        let password = new FormControl('', Validators.required);

        this.loginForm = new FormGroup({
            // tslint:disable-next-
            password: password,
            email: new FormControl('', [Validators.required, Validators.email])
        });
    }

    socialLoginFb() {
        this.spinner = true;
        let socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        this
            .socialAuthService
            .signIn(socialPlatformProvider)
            .then((userData) => {
                this.loggedInFb = true;
                this.loggedInGoogle =  false;
                if (this.loggedInFb == true) {
                    this
                        .customerService
                        .userLoginProviderFb(userData)
                        .subscribe((login: any) => {
                            let status = login['kitchenart']['status'];
                            let value = login['kitchenart']['status']['customer'];
                            let token = login['kitchenart']['status']['token'];

                            if (status['code'] == 200) {
                                this.showSuccess();
                                let nowSetUpTime = (60 * 60 * 8) * 1000 ;
                                let dateNow = new Date().getTime() + nowSetUpTime;
                                let timeValue = CryptoJS.AES.encrypt(dateNow.toString(), this.key).toString();
                                let tokenValue = CryptoJS.AES.encrypt(token, this.key).toString();

                                this.localSt.store('time', timeValue);
                                this.localSt.store('token', tokenValue);
                                setTimeout(() => {
                                    if(this.carts != null){
                                        for(let item of this.carts){
                                            this.cartService.postSave(item.product_id, item.quantity, value)
                                            .subscribe((cart: any) => {
                                                let cartStatus = cart['kitchenart']['results']['status']
                                                if(cartStatus == 'success'){
                                                    this.localSt.clear('carts');
                                                }
                                            })
                                        }
                                        this.spinner = false;
                                        this.location.back();
                                    }
                                    else{
                                        this.spinner = false;
                                        this.location.back();
                                    }
                                }, 3000);
                            } else {
                                this.spinner = false;
                                let description_english = login['kitchenart']['status']['description_english'];
                                let description_indonesia = login['kitchenart']['status']['description_indonesia'];
                                this.spinner = false;
                                this.showErrorFailedSosmed(description_english, description_indonesia);
                            }
                        });
                }
                // Now sign-in with userData
            });
    }

    socialLoginGoogle() {
        this.spinner = true;
        let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        this
            .socialAuthService
            .signIn(socialPlatformProvider)
            .then((userData) => {
                this.loggedInGoogle = true;
                this.loggedInFb = false;
                if (this.loggedInGoogle == true) {
                    this
                        .customerService
                        .userLoginProviderGoogle(userData)
                        .subscribe((login: any) => {
                            let status = login['kitchenart']['status'];
                            let value = login['kitchenart']['status']['customer'];
                            let token = login['kitchenart']['status']['token'];

                            if (status['code'] == 200) {
                                this.showSuccess();
                                let nowSetUpTime = (60 * 60 * 8) * 1000 ;
                                let dateNow = new Date().getTime() + nowSetUpTime;
                                let timeValue = CryptoJS.AES.encrypt(dateNow.toString(), this.key).toString();
                                let tokenValue = CryptoJS.AES.encrypt(token, this.key).toString();

                                this.localSt.store('time', timeValue);
                                this.localSt.store('token', tokenValue);
                                setTimeout(() => {
                                    if(this.carts != null){
                                        for(let item of this.carts){
                                            this.cartService.postSave(item.product_id, item.quantity, value)
                                            .subscribe((cart: any) => {
                                                let cartStatus = cart['kitchenart']['results']['status']
                                                if(cartStatus == 'success'){
                                                    this.localSt.clear('carts');
                                                }
                                            })
                                        }
                                        this.spinner = false;
                                        this.location.back();
                                    }
                                    else{
                                        this.spinner = false;
                                        this.location.back();
                                    }
                                }, 3000);
                            } else {
                                let description_english = login['kitchenart']['status']['description_english'];
                                let description_indonesia = login['kitchenart']['status']['description_indonesia'];
                                this.spinner = false;
                                this.showErrorFailedSosmed(description_english, description_indonesia);
                            }
                        });
                }
                // Now sign-in with userData
            });
    }

    loginUser(): void {
        this.spinner = true;
        this
            .customerService
            .userLogin(this.model)
            .subscribe((login: any) => {
                let statusCode = login['kitchenart']['status'];

                if(statusCode['code'] == 404){
                    let description_english = statusCode['description_english'];
                    let description_indonesia = statusCode['description_indonesia'];
                    this.spinner = false;
                    this.showErrorFailedSosmed(description_english, description_indonesia);
                }
                else{
                    let status = login['kitchenart']['results']['status'];
                    let value = login['kitchenart']['results']['customer'];
                    let token = login['kitchenart']['results']['token'];
                    if (status == 'success') {
                        this.showSuccess();
                        setTimeout(() => {
                            let nowSetUpTime = (60 * 60 * 8) * 1000 ;
                            let dateNow = new Date().getTime() + nowSetUpTime;
                            let timeValue = CryptoJS.AES.encrypt(dateNow.toString(), this.key).toString();
                            let tokenValue = CryptoJS.AES.encrypt(token, this.key).toString();
    
                            this
                                .localSt
                                .store('time', timeValue);
                            this
                                .localSt
                                .store('token', tokenValue);
                            if(this.carts != null){
                                for(let item of this.carts){
                                    this.cartService.postSave(item.product_id, item.quantity, value)
                                    .subscribe((cart: any) => {
                                        let cartStatus = cart['kitchenart']['results']['status']
                                        if(cartStatus == 'success'){
                                            this.localSt.clear('carts');
                                        }
                                    })
                                }
                                this.spinner = false;
                                this.location.back();
                            }
                            else{
                                this.spinner = false;
                                this.location.back();
                            }
                        }, 3000);
                    } else if (status == '') {
                        this.spinner = false;
                        this.showExist();
                    } else if (status == 'error') {
                        this.spinner = false;
                        this.showErrorEmpty();
                    } else {
                        this.spinner = false;
                        this.showError();
                    }
                }

            });
    }

    getMeta() {
        this.termService.getTagMeta()
        .subscribe((meta: any) => {
            this.metaTag = meta['kitchenart']['results'];

            this.meta.addTags([
                {name: 'description', content: this.metaTag['meta_description']},
                {name: 'author', content: 'kitchenart.id'},
                {name: 'keywords', content: this.metaTag['meta_keyword']}
              ]);
        })
    }

    showSuccess() {
        if(this.lang == 'en'){
            this
                .toastr
                .success('Login success');
        }
        else{
            this
                .toastr
                .success('Berhasil Masuk');
        }
    }

    showExist() {
        if(this.lang == 'en'){
            this
                .toastr
                .error('Already logged in');
        }
        else{
            this
                .toastr
                .error('Anda Telah Masuk');
        }
    }

    showError() {
        if(this.lang == 'en'){
            this
                .toastr
                .error('Password not correct');
        }
        else{
            this
                .toastr
                .error('Kata sandi tidak benar');
        }
    }

    showErrorEmpty() {
        if(this.lang == 'en'){
            this
                .toastr
                .error('Email & Password Required');
        }
        else{
            this
                .toastr
                .error('Email & Password wajib diisi');
        }
    }

    showErrorFailed() {
        if(this.lang == 'en'){
            this
                .toastr
                .error('Filed Login');
        }
        else{
            this
                .toastr
                .error('Gagal Masuk');
        }
    }

    showErrorFailedSosmed(descriptionEnglish: any, descriptioIndonesia: any) {
        if(this.lang == 'en'){
            this
                .toastr
                .error(descriptionEnglish);
        }
        else{
            this
                .toastr
                .error(descriptioIndonesia);
        }
    }

    goRegister() {
        this
            .router
            .navigate(['register']);
    }

    back() {
        this.router.navigate(['/']);
    }

    forgotPassword() {
        this.router.navigate(['forgot-password']);
    }

}
