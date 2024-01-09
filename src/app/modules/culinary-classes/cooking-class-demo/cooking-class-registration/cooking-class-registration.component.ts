import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { CookingClassDemoService } from '../../../../service/cooking-class-demo/cooking-class-demo.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

declare function paymentMidtrans(token: any): any;

@Component({
  selector: 'app-cooking-class-registration',
  templateUrl: './cooking-class-registration.component.html',
  styleUrls: ['./cooking-class-registration.component.css']
})
export class CookingClassRegistrationComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  terms: any;
  param: any;
  metaKeyword: any;
  metaDescription: any;
  exhibitions: any;
  dateStart: any;
  dateEnd: any;
  timeOpen: any;
  timeClose: any;
  title: any;
  location: any;
  locationUrl: any;
  hosts: any;
  cost: any;
  step: number = 0;

  participant2: boolean = false
  participant3: boolean = false
  countParticipant: number = 1

  registerForm: FormGroup;
  name_2 = new FormControl();
  phone_2 = new FormControl();
  email_2 = new FormControl();

  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  name_3 = new FormControl();
  phone_3 = new FormControl();
  email_3 = new FormControl();

  loading: boolean = false
  grandCost: number;
  url: any;
  token: any;
  snapToken: any;

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private route: ActivatedRoute,
    private cookingService: CookingClassDemoService,
    private toastr: ToastrService
  ) { 
    this.createForm()
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
      }
    });
    this.route.params.subscribe((params: any) => {
      this.param = params['url']
      this.getDetailCookingClass(params['url'])
    })
  }

  createForm() {
    this.registerForm = new FormGroup({
      name_1: new FormControl('', Validators.required),
      phone_1: new FormControl('', Validators.required),
      email_1: new FormControl('', [Validators.required, Validators.email]),
      name_2: this.name_2,
      phone_2: this.phone_2,
      email_2: this.email_2,
      name_3: this.name_3,
      phone_3: this.phone_3,
      email_3: this.email_3
    });
  }

  getMeta(keyword: string, description: string) {
    this.termService.getTagMeta()
    .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];
        if(keyword == '' || keyword == null){
          this.metaKeyword = this.metaTag['meta_keyword']
        }
        else{
          this.metaKeyword = keyword
        }

        if(description == '' || description == null){
          this.metaDescription = this.metaTag['meta_description']
        }
        else{
          this.metaDescription = description
        }

        this.meta.updateTag(
          {name: 'description', content: this.metaDescription}
        );

        this.meta.updateTag(
          {name: 'keywords', content: this.metaKeyword}
        );

        this.meta.updateTag({
          name: 'author', content: 'kitchenart.id'
        })
        
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

  getDetailCookingClass(url: string) {
    this.cookingService.getDetail(url)
    .subscribe((exhibition: any) => {
      this.exhibitions = exhibition['kitchenart']['results']
      this.dateStart = this.exhibitions['date_start']
      this.dateEnd = this.exhibitions['date_end']
      this.timeOpen = this.exhibitions['time_open']
      this.timeClose = this.exhibitions['time_close']
      this.title = this.exhibitions['title']
      this.location = this.exhibitions['showroom_name']
      this.locationUrl = this.exhibitions['showroom_url']
      this.hosts = this.exhibitions['hosts']
      this.cost = this.exhibitions['cost']

      this.grandCost = this.cost * this.countParticipant

      let keyword = this.exhibitions['meta_keyword']
      let description = this.exhibitions['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.title);
    })
  }

  getDetailHost(url: string){
    this.router.navigate(['partner_chefs/', url]);
  }

  getDetailShowroom(link: string): void {
    this.router.navigate(['showrooms/', link]);
  }

  setStep(index: number) {
    this.step = index;
  }

  addParticipant() {
    this.countParticipant++
    if(this.countParticipant == 2) {
      this.participant2 = true
      this.formValidateProduct2()
    }
    else if(this.countParticipant == 3) {
      this.participant3 = true
      this.formValidateProduct3()
    }
    this.grandCost = this.cost * this.countParticipant
  }

  removeParticipant() {
    this.countParticipant--
    if(2 <= this.countParticipant) {
      this.participant3 = false
      this.formValidateNotActive3()
    }
    else if(1 == this.countParticipant){
      this.participant2 = false
      this.formValidateNotActive2()
    }
    this.grandCost = this.cost * this.countParticipant
  }

  formValidateProduct2(){
    this.name_2 = new FormControl ('', Validators.required)
    this.phone_2 = new FormControl ('', Validators.required)
    this.email_2 = new FormControl ('', [Validators.required, Validators.email])
  }

  formValidateNotActive2() {
    this.name_2 = new FormControl ('')
    this.phone_2 = new FormControl ('')
    this.email_2 = new FormControl ('')
  }

  formValidateProduct3(){
    this.name_3 = new FormControl ('', Validators.required)
    this.phone_3 = new FormControl ('', Validators.required)
    this.email_3 = new FormControl ('', [Validators.required, Validators.email])
  }

  formValidateNotActive3() {
    this.name_3 = new FormControl ('')
    this.phone_3 = new FormControl ('')
    this.email_3 = new FormControl ('')
  }

  saveFreeRegister() {
    if(this.registerForm.invalid){
      this.showNotValid()
    }
    else{
      this.loading = true
      const data = this.registerForm.value
      const count = this.countParticipant
      const url = this.param
      const token = 'toQ4tdsqVyZRmAP1DW0MFkoJaqL0oQEl'
      this.cookingService.postFreeRegistration(data, url, count, token)
      .subscribe((data: any) => {
        let status = data['kitchenart']['results']['status']
        if(status == 'success'){
          this.showSuccess()
          setTimeout(() => {
            this.loading = false
            this.router.navigate(['cooking_class_demo/registration/free/', this.param]);
          }, 1000)
        }
        else{
          this.showError()
          this.loading = false
        }
      })
    }
  }

  saveRegister() {
    if(this.registerForm.invalid){
      this.showNotValid()
    }
    else{
      this.loading = true
      const data = this.registerForm.value
      const count = this.countParticipant
      const url = this.param
      this.cookingService.postRegistration(data, url, count, this.token)
      .subscribe((data: any) => {
        let status = data['kitchenart']['results']['status']
        if(status == 'success'){
          this.showSuccess()
          this.snapToken  = data['kitchenart']['results']['snap_token']
          setTimeout(() => {
            this.loading = false
            paymentMidtrans(this.snapToken)
          }, 1000)
        }
        else{
          this.showError()
          this.loading = false
        }
      })
    }
  }

  showSuccess() {
    this.toastr.success('Registration success');
  }

  showError() {
    this.toastr.error('Registration unsuccess');
  }

  showNotValid() {
    this.toastr.warning('Complete your data');
  }

}
