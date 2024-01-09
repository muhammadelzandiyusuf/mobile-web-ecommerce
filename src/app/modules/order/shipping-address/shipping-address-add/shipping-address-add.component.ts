import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Router, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { ShippingAddressService } from '../../../../service/shipping-address/shipping-address.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProvinceService } from '../../../../service/province/province.service';
import { CityService } from '../../../../service/city/city.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-shipping-address-add',
  templateUrl: './shipping-address-add.component.html',
  styleUrls: ['./shipping-address-add.component.css']
})
export class ShippingAddressAddComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any

  metaTag: any;
  term: any;

  shippingForm: FormGroup;
  provinces: any = []
  cities: any = []
  subdistricts: any = []
  cityDisabled: boolean = true;
  subdistrictDisabled: boolean = true;
  postal: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  spinner: boolean = false
  message: any;
  token: any;
  isLoading: boolean = false;
  destinations: any = [];
  postalCodeShow: boolean = true;

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private shippingAddressService: ShippingAddressService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private toastr: ToastrService,
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
      }
    });
    this.createForm()
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Shipping Address');
  }

  ngOnInit() {
    this.getProvince();

    // this.shippingForm
    //   .get('postal_zip')
    //   .valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     tap(() => this.isLoading = true),
    //     switchMap((value: any) => this.cityService.getShippingAddressByPostalCode(value, this.shippingForm.value['subdistrict_id']['name'])
    //     .pipe(
    //       finalize(() => this.isLoading = false),
    //       )
    //     )
    //   )
    //   .subscribe((destiny: any) => this.destinations = destiny['kitchenart']['results']);
  }

  createForm() {

    this.shippingForm = new FormGroup({
      label: new FormControl('', Validators.required),
      receiver_name: new FormControl('', Validators.required),
      receiver_phone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      province_id: new FormControl('', Validators.required),
      city_id: new FormControl('', Validators.required),
      subdistrict_id: new FormControl('', Validators.required),
      postal_zip: new FormControl('', Validators.required)
    });

  }

  // displayFn(address: ShippingDestination) {
  //   if (address) { return address.full_address; }
  // }

  getProvince(): void {
    this.provinceService.getProvinces()
    .subscribe((provinces: any) => {
      this.provinces = provinces['kitchenart']['results'];
    });
  }

  getCityByProvince(province_id: any): void {
    this.cityDisabled = false;
    this.cityService.getCities(province_id)
    .subscribe((cities: any) => {
      this.cities = cities['kitchenart']['results'];
    });
  }

  getSubdistrict(city_id: any): void {
    this.subdistrictDisabled = false;
    this.cityService.getSubdistricts(city_id)
    .subscribe((subdistrict: any) => {
      this.subdistricts = subdistrict['kitchenart']['results'];
    });
  }

  getPostalCode(name: string): void {
    this.postalCodeShow = false;
    this.cityService.getShippingAddressByPostalCode(null, name)
    .subscribe((postalcode: any) => {
      this.destinations = postalcode['kitchenart']['results'];
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

  registerShipping(): void {
    this.spinner = true
    const formModel = this.shippingForm.value;

    this.shippingAddressService.postAdd(formModel, this.token)
    .subscribe((shipping: any) => {
      const status = shipping['kitchenart']['results']['status'];
      this.message = shipping['kitchenart']['results']['message'];
      if(status == 'success'){
        this.showSuccess();
        setTimeout(()=>{
          this.spinner = false
          this.reset();
          this.router.navigate(['shipping-address']);
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
    this.toastr.success(this.message);
  }

  showError() {
    this.toastr.error(this.message);
  }

}
