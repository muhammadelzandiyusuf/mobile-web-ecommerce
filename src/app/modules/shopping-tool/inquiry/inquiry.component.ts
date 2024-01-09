import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng4-validators/ng4-validators';

import { CityService } from '../../../service/city/city.service';
import { ProvinceService } from '../../../service/province/province.service';
import { InquiryService } from '../../../service/inquiry/inquiry.service';
import { Province } from '../../../service/province/province';
import { City } from '../../../service/city/city';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {
  provinces: Province[];
  companyProvince: any;
  cities: City[];
  salutaion = [
    {name:"Mr"}, {name:"Mrs"}, {name:"Ms"}
  ]
  spinner: boolean = false
  metaTag: any;

  constructor(
    private router: Router,
    private inquiryService: InquiryService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private toastr: ToastrService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.createForm();
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Inquiry');
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

  cityDisabled: boolean = true;
  registerForm: FormGroup;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  postal: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  pwdPattern: any = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9- ]).{8,30}$";
  namePattern: any = "^(?=.*[a-z])(?=.*[A-Z])";

  ngOnInit() {
    this.getProvince();
  }

  createForm() {
    let email = new FormControl('', [Validators.required, Validators.email]);
    let sameEmail = new FormControl('', CustomValidators.equalTo(email));

    this.registerForm = new FormGroup({
      salutation: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl(''),
      company_name: new FormControl(''),
      email: email,
      same_email: sameEmail,
      handphone: new FormControl('', Validators.required),
      address: new FormControl(''),
      person_as: new FormControl('', Validators.required),
      province_id: new FormControl(''),
      state_id: new FormControl(''),
      postal_zip: new FormControl(''),
      telephone: new FormControl(''),
      message: new FormControl('', Validators.required)
    });

  }

  getProvince(): void {
    this.provinceService.getProvinces()
    .subscribe(provinces => {
      this.provinces = provinces['kitchenart']['results'];
      this.companyProvince = provinces['kitchenart']['results'];
    });
  }

  getCityByProvince(province_id: any): void {
    this.cityDisabled = false;
    this.cityService.getCities(province_id)
    .subscribe((cities: any) => {
      this.cities = cities['kitchenart']['results'];
    });
  }

  registerInquiry(): void {
    this.spinner = true
    const formModel = this.registerForm.value;

    this.inquiryService.createInquiry(formModel)
    .subscribe((inquiry: any) => {
      const status = inquiry['kitchenart']['status']['code'];
      if(status == 200){
        this.showSuccess();
        setTimeout(()=>{
          this.spinner = false
          this.reset();
          this.router.navigate(['/']);
        },1000);
      }
      else{
        this.showError();
      }
    });
    
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    this.toastr.success('Inquiry success');
  }

  showError() {
    this.toastr.error('Filed');
  }

}
