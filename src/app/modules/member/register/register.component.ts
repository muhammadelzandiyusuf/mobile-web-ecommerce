import {Component, OnInit} from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';

import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from 'ng4-validators/ng4-validators';

import {Customer} from '../../../service/customer/customer';
import {Activation} from '../../../service/customer/activation';
import {CustomerService} from '../../../service/customer/customer.service';
import {Province} from '../../../service/province/province';
import {ProvinceService} from '../../../service/province/province.service';
import {MessageService} from './../../../service/message.service';

import {LocalStorageService} from 'ngx-webstorage';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser} from 'angular5-social-auth';
import {Meta, Title} from '@angular/platform-browser';
import {TermService} from '../../../service/term/term.service';
import * as CryptoJS from 'crypto-js';

@Component(
    {selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.css']}
)
export class RegisterComponent implements OnInit {
    hide: boolean = true;
    submit: boolean = false;

    model = new Customer();
    customer: any;
    provinces: Province[];
    registerForm: FormGroup;
    pwdPattern: any = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9- ]).{8,30}$";
    namePattern: any = "^(?=.*[a-z])(?=.*[A-Z])";
    minDate = new Date(1900, 0, 1);
    maxDate = new Date(2020, 0, 1);
    spinner: boolean = false ;
    activation = new Activation();
    // id = this
    //     .route
    //     .snapshot
    //     .paramMap
    //     .get('id');
    activations = this
        .route
        .snapshot
        .paramMap
        .get('activation');
    params: any;

    users: SocialUser;
    loggedInFb: boolean = false;
    loggedInGoogle: boolean = false;
    metaTag: any;
    lang: any;
    token: any = "toQ4tdsqVyZRmAP1DW0MFkoJaqL0oQEl";
    key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";

    constructor(
        private route : ActivatedRoute,
        private router : Router,
        private customerService : CustomerService,
        private provinceService : ProvinceService,
        public messageService : MessageService,
        private toastr : ToastrService,
        private localSt : LocalStorageService,
        private socialAuthService : AuthService,
        private termService : TermService,
        private meta : Meta,
        private titleService : Title
    ) {
        this.createForm();
        this.getMeta()
        this.lang = this.localSt.retrieve('lang');  
        this
            .titleService
            .setTitle('KitchenArt - Register');
    }

    ngOnInit() {
        this.getProvince();
        this.userActivation();
    }

    getMeta() {
        this
            .termService
            .getTagMeta()
            .subscribe((meta : any) => {
                this.metaTag = meta['kitchenart']['results'];

                this
                    .meta
                    .addTags([
                        {
                            name: 'description',
                            content: this.metaTag['meta_description']
                        }, {
                            name: 'author',
                            content: 'kitchenart.id'
                        }, {
                            name: 'keywords',
                            content: this.metaTag['meta_keyword']
                        }
                    ]);
            })
    }

    createForm() {
        let password = new FormControl('', [
            Validators.required,
            // Validators.pattern(this.pwdPattern)
        ]);
        let confirmPassword = new FormControl('', CustomValidators.equalTo(password));

        this.registerForm = new FormGroup({
            // tslint:disable-next-
            fname: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            province: new FormControl('', Validators.required),
            birthday: new FormControl('', [Validators.required, CustomValidators.date]),
            password: password,
            confirmPassword: confirmPassword
        });
    }

    getProvince(): void {
        this
            .provinceService
            .getProvinces()
            .subscribe((provinces : any) => {
                this.provinces = provinces['kitchenart']['results'];
            });
    }

    addRegister() {
        this.spinner = true
        this
            .customerService
            .register(this.model, this.token)
            .subscribe((customer : any) => {
                this.customer = customer['kitchenart']['results']['status'];
                if (this.customer == 'error') {
                    this.showError();
                    this.spinner = false
                } else {
                    this.showSuccess();
                    setTimeout(() => {
                        this.spinner = false
                        this.reset();
                        this
                            .router
                            .navigate(['/register-success']);
                    }, 1000);
                }

            });
    }

    userActivation(): void {
        
        if (this.activations) {
            this.params = {
                activation_code: this.activations
            };
            this
                .customerService
                .activation(this.params)
                .subscribe((activation : any) => {
                    let status = activation['kitchenart']['results']['status'];
                    if (status = 'success') {
                        this.activationSuccess();
                        setTimeout(() => {
                            this
                                .router
                                .navigate(['/']);
                        }, 3000);
                    } else {
                        this.activationEror();
                    }

                });
        }
        
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
                                    this.spinner = false;
                                    this
                                    .router
                                    .navigate(['/']);       
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
                                    this.spinner = false;
                                    this
                                    .router
                                    .navigate(['/']);    
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

    reset() {
        this.createForm();
    }

    showSuccess() {
        if (this.lang == 'en') {
            this
                .toastr
                .success('Please Check Your Email To Activate Account');
        } else {
            this
                .toastr
                .success('Silakan Periksa Email Anda Untuk Mengaktifkan Akun');
        }
    }

    showError() {
        if (this.lang == 'en') {
            this
                .toastr
                .error('Email is exist');
        } else {
            this
                .toastr
                .error('Email sudah ada');
        }
    }

    activationSuccess() {
        if (this.lang == 'en') {
            this
                .toastr
                .success('Congratulations, your account is active');
        } else {
            this
                .toastr
                .success('Selamat, akun Anda aktif');
        }

    }

    activationEror() {
        if (this.lang == 'en') {
            this
                .toastr
                .error('Sorry, your account was not successful activated');
        } else {
            this
                .toastr
                .error('Maaf, akun Anda tidak berhasil diaktifkan');
        }
    }

    showErrorFailed() {
        if (this.lang == 'en') {
            this
                .toastr
                .error('Filed Login');
        } else {
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

}
