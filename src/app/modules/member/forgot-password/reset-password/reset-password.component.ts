import { Component, OnInit } from '@angular/core';
import { ForgotPasswordService } from '../../../../service/forgot-password/forgot-password.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng4-validators';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  metaTag: any;
  spinner: boolean = false
  forgotPasswordForm: FormGroup;
  pwdPattern: any = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9- ]).{8,30}$";
  customer: any;
  param: any;
    lang: any;

  constructor(
    private fogotPasswordService : ForgotPasswordService,
      private toastr : ToastrService,
      private router : Router,
      private route: ActivatedRoute,
      private termService : TermService,
      private meta : Meta,
      private titleService: Title,
      private localSt:LocalStorageService
  ) { 
    this.route.params.subscribe(params => {
      this.param = params['code'];     
    })
    this.createForm()
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');  
    this.titleService.setTitle('KitchenArt - Reset Password');
  }

  ngOnInit() {
  }

  getMeta() {
      this.termService.getTagMeta()
      .subscribe(meta => {
          this.metaTag = meta['kitchenart']['results'];

          this.meta.addTags([
              {name: 'description', content: this.metaTag['meta_description']},
              {name: 'author', content: 'kitchenart.id'},
              {name: 'keywords', content: this.metaTag['meta_keyword']}
            ]);
      })
  }

  createForm() {
      let password = new FormControl('', [
          Validators.required,
          Validators.pattern(this.pwdPattern)
      ]);
      let confirmPassword = new FormControl('', CustomValidators.equalTo(password));

      this.forgotPasswordForm = new FormGroup({
          email: new FormControl('', [Validators.required, Validators.email]),
          password: password,
          confirmPassword: confirmPassword
      });
  }

  resetPassword() {
      this.spinner = true
      let data = this.forgotPasswordForm.value;
      this
          .fogotPasswordService
          .postResetPassword(data, this.param)
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
        this
          .toastr
          .success('Password success reset');
      }
      else{
        this
        .toastr
        .success('Password berhasil direset');
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

}
