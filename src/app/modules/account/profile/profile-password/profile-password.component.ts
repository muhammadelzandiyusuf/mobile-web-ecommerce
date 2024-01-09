import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../../service/account/account.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng4-validators';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.css']
})
export class ProfilePasswordComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id:number = null;
  subcription: Subscription;
  navigationSubscription:any
  metaTag: any;

  registerForm: FormGroup;
  pwdPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9- ]).{8,30}$";

  cekProfile: boolean = false
  message: any;
  token: any;

  constructor(
    private accountService: AccountService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private toastr: ToastrService
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
      }
    });
    this.createForm();
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Change Password');
  }

  getMeta() {
    this.termService.getTagMeta()
    .subscribe((meta:any) => {
        this.metaTag = meta['kitchenart']['results'];

        this.meta.addTags([
            {name: 'description', content: this.metaTag['meta_description']},
            {name: 'author', content: 'kitchenart.id'},
            {name: 'keywords', content: this.metaTag['meta_keyword']}
          ]);
    })
  }

  initialiseInvites() {
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.subcription){
      this.subcription.unsubscribe();
    }
  }

  ngOnInit() {
  }

  backAccount(){
    this.router.navigate(['account/profile/edit']);
  }

  createForm() {
    let password = new FormControl('', [
        Validators.required,
        Validators.pattern(this.pwdPattern)
    ]);
    let confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.registerForm = new FormGroup({
      old_password: new FormControl('', Validators.required),
      new_password: password,
      confirm_password: confirmPassword,
    });
  }

  saveChangePassword() {
    this.cekProfile = true
    const formModel = this.registerForm.value;
    this.accountService.postChangePassword(formModel, this.token)
    .subscribe((profile:any) => {
      const status = profile['kitchenart']['results']['status'];
      this.message = profile['kitchenart']['results']['message'];
      if(status == 'success'){
        this.showSuccess();
        setTimeout(()=>{
          this.cekProfile = false
          this.router.navigate(['account/profile']);
        },1000);
      }
      else{
        this.showError();
        this.cekProfile = false
      }
    });
  }

  showSuccess() {
    this.toastr.success(this.message);
  }

  showError() {
    this.toastr.error(this.message);
  }

}
