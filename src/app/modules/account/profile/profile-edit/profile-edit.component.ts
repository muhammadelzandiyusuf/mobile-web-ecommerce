import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../../service/account/account.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CityService } from '../../../../service/city/city.service';
import { ProvinceService } from '../../../../service/province/province.service';
import { CustomValidators } from 'ng4-validators';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id:any = null;
  subcription: Subscription;
  navigationSubscription:any
  metaTag: any;
  user: any;
  fullName: string;
  personUs: any;
  email: any;
  handphone: any;
  telephone: any;
  birthday: any;
  address: any;
  companyName: any;
  companyWebsite: any;
  companyTitle: any;
  companyIndusty: any;
  companyTelephone: any;
  companyFax: any;
  companyAddress: any;
  documentType1: any;
  documentFile1: any;
  documentFile2: any;
  documentType2: any;
  imageDomain: any;
  documentPath: any;
  avatarPath: any;
  avatarImage: any;

  fileToUpload1: File  = null;
  @ViewChild('fileInput1') fileInput1: ElementRef;
  urlImage: any = null;

  registerForm: FormGroup;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  postal: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  identity_card: any[] = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  cityDisabled = true;
  provinces:any = [];
  cities:any = [];
  minDate = new Date(1900, 0, 1);
  maxDate = new Date(2000, 0, 12);
  identityNo: any;
  provinceId: any;
  stateId: any;
  postalCode: any;
  companyProvinceId: any;
  companyStateId: any;
  companyPostalCode: any;

  companyIndustry:any = []
  companyCityDisabled: boolean;
  companyCities: any;
  companyProvince: any;
  cekProfile: boolean = false
  token: any;

  constructor(
    private accountService: AccountService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private provinceService: ProvinceService,
    private cityService: CityService,
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
    this.titleService.setTitle('KitchenArt - Profile');
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
      if(this.token){
        this.getDataProfile(this.token)
        this.getProvince();
      }
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

  getDataProfile(token:any) {
    this.accountService.getCustomerProfile(token)
    .subscribe((customer:any) => {
        this.user = customer['kitchenart']['results']
        this.fullName = this.user['first_name'] + ' ' + this.user['last_name']
        this.personUs = this.user['person_as']
        this.email = this.user['email']
        this.handphone = this.user['handphone']
        this.telephone = this.user['telephone']
        this.birthday = this.user['birthday']
        this.address = this.user['address']
        this.identityNo = this.user['identity_no']
        this.provinceId = this.user['province_id']
        this.stateId = this.user['state_id']
        this.postalCode = this.user['postal_code']

        this.companyName = this.user['company_name']
        this.companyWebsite = this.user['company_website']
        this.companyTitle = this.user['company_title']
        this.companyIndusty = this.user['company_industry']
        this.companyTelephone = this.user['company_telephone']
        this.companyFax = this.user['company_fax']
        this.companyAddress = this.user['company_address']
        this.documentType1 = this.user['document_type_1']
        this.documentFile1 = this.user['document_file_1']
        this.documentType2 = this.user['document_type_2']
        this.documentFile2 = this.user['document_file_2']
        this.companyProvinceId = this.user['company_province_id']
        this.companyStateId = this.user['company_state_id']
        this.companyPostalCode = this.user['company_postal_code']

        this.imageDomain = this.user['image_domain']
        this.documentPath = this.user['document_path']
        this.avatarPath = this.user['avatar_path']
        this.avatarImage = this.user['avatar_image']

        if(this.provinceId){
          this.getCityByProvince(this.provinceId)
        }

        if(this.companyProvinceId){
          this.getCompanyCityByProvince(this.companyProvinceId)
        }

        this.registerForm.setValue(
          {
            handphone: this.handphone,
            birthday: this.birthday,
            address: this.address,
            province_id: this.provinceId,
            city_id: this.stateId,
            postal_code: this.postalCode,
            telephone: this.telephone,
            company_name: this.companyName,
            company_website: this.companyWebsite,
            company_title: this.companyTitle,
            company_industry: this.companyIndusty,
            company_address: this.companyAddress,
            company_province_id: this.companyProvinceId,
            company_city_id: this.companyStateId,
            company_postal_code: this.companyPostalCode,
            company_telephone: this.companyTelephone,
            company_fax: this.companyFax
          }
        )

        this.companyIndustry = [
          { name:'Architect' },
          { name:'Contractor Builder' },
          { name:'Design Studio' },
          { name:'Chef & Somelier' },
          { name:'Food & Baverage' },
          { name:'Hospitality' },
          { name:'Cullinary Class' }
        ]
    })
  }

  backProfile(){
    this.router.navigate(['account/profile']);
  }

  onFileChange(event:any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload1 = file;
    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.urlImage = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getProvince(): void {
    this.provinceService.getProvinces()
    .subscribe((provinces:any) => {
      this.provinces = provinces['kitchenart']['results'];
      this.companyProvince = provinces['kitchenart']['results'];
    });
  }

  getCityByProvince(province_id:number): void {
    this.cityDisabled = false;
    this.cityService.getCities(province_id)
    .subscribe((cities:any) => {
      this.cities = cities['kitchenart']['results'];
    });
  }

  getCompanyCityByProvince(province_id:string): void {
    this.companyCityDisabled = false;
    this.cityService.getCities(province_id)
    .subscribe((cities:any) => {
      this.companyCities = cities['kitchenart']['results'];
    });
  }

  createForm() {
    this.registerForm = new FormGroup({
      handphone: new FormControl('', Validators.required),
      birthday: new FormControl('', [Validators.required, CustomValidators.date]),
      address: new FormControl(''),
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

  updateProfile() {
    let data = this.registerForm.value
    this.cekProfile = true

    this.accountService.postUpdate(data, this.token)
    .subscribe((profile:any) => {
      const status = profile['kitchenart']['results']['status'];
      if(status == 'success'){
        if(this.fileToUpload1 != null){
          this.accountService.postUpload(this.fileToUpload1, this.token).subscribe((data:any) => {
            this.showSuccess();
            setTimeout(()=>{
              this.cekProfile = false
              this.router.navigate(['account/profile']);
            },1000);
          }) 
        }
        else{
          this.showSuccess();
            setTimeout(()=>{
              this.cekProfile = false
              this.router.navigate(['account/profile']);
            },1000);
        }
      }
      else{
        this.showError();
      }
    })
  }

  changePassword(){
    this.router.navigate(['account/profile/change_password']);
  }

  compareProvince(x:any, y:any): boolean {
    return x && y ? x == y : x == y;
  }

  compareCity(x:any, y:any): boolean {
    return x && y ? x == y : x == y;
  }

  compareIndustry(x:any, y:any): boolean {
    return x && y ? x == y : x == y;
  }

  compareCompanyProvince(x:any, y:any): boolean {
    return x && y ? x == y : x == y;
  }

  compareCompanyCity(x:any, y:any): boolean {
    return x && y ? x == y : x == y;
  }

  showSuccess() {
    this.toastr.success('Successfully update');
  }

  showError() {
    this.toastr.error('Cannot update');
  }

}
