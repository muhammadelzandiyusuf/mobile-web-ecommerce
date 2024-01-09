import { Component, OnInit } from '@angular/core';
import { ForgotPasswordService } from '../../../../service/forgot-password/forgot-password.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  metaTag: any;
  spinner: boolean = false
  forgotPasswordForm: FormGroup;
  pwdPattern: any = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9- ]).{8,30}$";
    lang: any;

  constructor(
      private fogotPasswordService : ForgotPasswordService,
      private toastr : ToastrService,
      private router : Router,
      private termService : TermService,
      private meta : Meta,
      private titleService: Title,
      private localSt:LocalStorageService
  ) { 
      this.createForm()
      this.getMeta()
      this.lang = this.localSt.retrieve('lang');  
      this.titleService.setTitle('KitchenArt - Forgot Password');
  }

  ngOnInit() {
  }

  createForm() {
      this.forgotPasswordForm = new FormGroup({
          email: new FormControl('', [Validators.required, Validators.email])
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

  forgotPassword() {
      this.spinner = true
      let data = this.forgotPasswordForm.value;
      this
          .fogotPasswordService
          .postForgotPassword(data)
          .subscribe((forgot: any) => {
              let status = forgot['kitchenart']['results']['status'];
              if (status == 'error') {
                  this.spinner = false
                  this.showError();
              } else {
                  this.showSuccess();
                  setTimeout(() => {
                      this.spinner = false
                      this.reset();
                      this
                          .router
                          .navigate(['/']);
                  }, 1000);
              }

          });
  }

  reset() {
      this.createForm();
  }

  showSuccess() {
      if(this.lang == 'en'){
        this.toastr.success('Password change request accepted');
      }
      else{
        this.toastr.success('Permintaan ganti password diterima');
      }
  }

  showError() {
    if(this.lang == 'en'){
      this
          .toastr
          .error("Email not available");
    }
    else{
        this
          .toastr
          .error("Email tidak tersedia");
    }
  }

  back() {
    this.router.navigate(['login']);
    }

}
