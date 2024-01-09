import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng4-validators/ng4-validators';

import { Bussiness } from '../../../service/bussiness/bussiness';
import { BussinessService } from '../../../service/bussiness/bussiness.service';
import { Province } from '../../../service/province/province';
import { ProvinceService } from '../../../service/province/province.service';
import { MessageService } from './../../../service/message.service';
import { CityService } from '../../../service/city/city.service';
import { City } from '../../../service/city/city';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-bussiness-partners',
  templateUrl: './bussiness-partners.component.html',
  styleUrls: ['./bussiness-partners.component.css']
})
export class BussinessPartnersComponent implements OnInit {
  images: any;
  hide: boolean = true;
  submit: boolean = false;
  cityDisabled: boolean = true;
  companyCityDisabled: boolean = true;
  fileToUpload1: File  = null;
  fileToUpload2: File  = null;

  model = new Bussiness();
  bussines: any;
  provinces: Province[];
  companyProvince: any = [];
  cities: City[];
  companyCities: City[];
  postalCode: string = '';
  country: string = '';
  companyPostalCode: string = '';
  companyCountry: string = '';

  registerForm: FormGroup;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  postal: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/];
  identity_card: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  pwdPattern: any = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9- ]).{8,30}$";
  namePattern: any = "^(?=.*[a-z])(?=.*[A-Z])";

  step: number = 0;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date(2020, 0, 1);

  file_1: any;
  metaTag: any;
  lang: any;

  setStep(index: number) {
      this.step = index;
  }

  nextStep() {
      this.step++;
  }

  prevStep() {
      this.step--;
  }

  @ViewChild('fileInput1') fileInput1: ElementRef;
  @ViewChild('fileInput2') fileInput2: ElementRef;

  constructor(
    private router: Router,
    private bussinessService: BussinessService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    public messageService: MessageService,
    private toastr: ToastrService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt:LocalStorageService
  ) {
    this.createForm();
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');  
    this.titleService.setTitle('KitchenArt - Bussineess Partners');
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

  ngOnInit() {
      this.getProvince();
  }

  createForm() {
    let email = new FormControl('', [Validators.required, Validators.email]);
    let sameEmail = new FormControl('', CustomValidators.equalTo(email));

    this.registerForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl(''),
      email: email,
      same_email: sameEmail,
      identity_no: new FormControl('', Validators.required),
      handphone: new FormControl('', Validators.required),
      birthday: new FormControl('', [Validators.required, CustomValidators.date]),
      document_type_2: new FormControl('', Validators.required),
      document_file_1: new FormControl (null, Validators.required),
      document_file_2: new FormControl(null, Validators.required),
      address: new FormControl(''),
      gender: new FormControl('', Validators.required),
      person_as: new FormControl('', Validators.required),
      province_id: new FormControl(''),
      city_id: new FormControl(''),
      postal_code: new FormControl(''),
      telephone: new FormControl(''),
      company_name: new FormControl(''),
      company_website: new FormControl(''),
      company_title: new FormControl(''),
      company_industry: new FormControl(''),
      company_address: new FormControl(''),
      company_province_id: new FormControl(''),
      company_city_id: new FormControl(''),
      company_postal_code: new FormControl(''),
      company_telephone: new FormControl(''),
      company_fax: new FormControl('')
    });
  }

  onFileChange(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.registerForm.get('document_file_1').setValue(file);
      this.fileToUpload1 = file;
    }
  }

  onFileChangeDoc(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.registerForm.get('document_file_2').setValue(file);
      this.fileToUpload2 = file;
    }
  }

  getProvince(): void {
    this.provinceService.getProvinces()
    .subscribe((provinces) => {
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

  getCompanyCityByProvince(province_id: any): void {
    this.companyCityDisabled = false;
    this.cityService.getCities(province_id)
    .subscribe((cities: any) => {
      this.companyCities = cities['kitchenart']['results'];
    });
  }

  getPostalCode(postal_code: any): void{
    this.postalCode = postal_code;
    this.country = 'Indonesia';
  }

  getCompanyPostalCode(postal_code: any): void{
    this.companyPostalCode = postal_code;
    this.companyCountry = 'Indonesia';
  }

  registerBussiness(){
    const formModel = this.registerForm.value;

    this.bussinessService.bussinessRegister(formModel)
      .subscribe((bussiness: any) => {
        this.bussines = bussiness['kitchenart']['results']['status'];
          if (this.bussines === 'error' ) {
            this.showError();
          } else {
            setTimeout(()=>{
              this.bussinessService.bussinessRegisterImage(this.fileToUpload1, this.fileToUpload2)
              .subscribe((images : any) => {
                if (this.bussines === 'error' ) {
                  this.showError();
                } else {
                  this.showSuccess();
                  setTimeout(()=>{
                    this.reset();
                    this.router.navigate(['/']);
                  },1000);
                }
              });
            },1000);
          }     
      });
  }

  registerIMage() {
    this.bussinessService.bussinessRegisterImage(this.fileToUpload1, this.fileToUpload2)
      .subscribe((bussiness: any) => {
        if (this.bussines === 'error' ) {
          this.showError();
        } else {
          this.showSuccess();
          setTimeout(()=>{
            this.reset();
            this.router.navigate(['/']);
          },1000);
        }
      });
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    if(this.lang == 'en'){
      this.toastr.success('Please Check Your Email To Activate Account');
    }
    else{
      this.toastr.success('Silakan Periksa Email Anda Untuk Mengaktifkan Akun');
    }
  }

  showError() {
    if(this.lang == 'en'){
      this.toastr.error('Email is exist');
    }
    else{
      this.toastr.error('Email sudah ada');
    }
  }

}
