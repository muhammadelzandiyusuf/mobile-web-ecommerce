import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ShippingAddressService } from '../../../../service/shipping-address/shipping-address.service';
import { ProvinceService } from '../../../../service/province/province.service';
import { CityService } from '../../../../service/city/city.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { ShippingDestination } from '../../../../service/shipping-address/shipping-destination';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account-shipping-address-update',
  templateUrl: './account-shipping-address-update.component.html',
  styleUrls: ['./account-shipping-address-update.component.css']
})
export class AccountShippingAddressUpdateComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any

  metaTag: any;
  term: any;

  selectedProvince: any

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
  shippings: any;
  province_id: any;
  paramId: any;
  city_id: any;
  provinceId: any;
  cityId: any;
  shippingId: any;
  token: any;
  isLoading: boolean = false;
  destinations: any = [];
  cityName: any;
  subdistrictName: any;
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
    private route: ActivatedRoute  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
      }
    });
    this.route.params.subscribe(params => {
      this.paramId = params['id']
    })
    this.createForm()
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Shipping Address');
  }

  ngOnInit() {
    // this.shippingForm
    //     .get('postal_zip')
    //     .valueChanges
    //     .pipe(
    //       debounceTime(300),
    //       tap(() => this.isLoading = true),
    //       switchMap((value: any) => this.cityService.getShippingAddressByPostalCode(value, this.shippingForm.value['subdistrict_id']['name'])
    //       .pipe(
    //         finalize(() => this.isLoading = false),
    //         )
    //       )
    //     )
    //     .subscribe((destiny: any) => this.destinations = destiny['kitchenart']['results']);
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

  getCityByProvince(province_id:number): void {
    this.cityDisabled = false;
    this.cityService.getCities(province_id)
    .subscribe((cities: any) => {
      this.cities = cities['kitchenart']['results'];
    });
  }

  getSubdistrict(city_id:number): void {
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

  registerShipping(): void {
    this.spinner = true
    const formModel = this.shippingForm.value;
    if (formModel['postal_zip'] === 0 || formModel['postal_zip'] === '' || formModel['postal_zip'] === null) {
      this.toastr.warning('Postal Code Can Not Empty');
      this.spinner = false
    }
    else{
      this.shippingAddressService.postEdit(formModel, this.shippingId, this.token)
      .subscribe((shipping: any) => {
        const status = shipping['kitchenart']['results']['status'];
        this.message = shipping['kitchenart']['results']['message'];
        if(status == 'success'){
          this.showSuccess();
          setTimeout(()=>{
            this.spinner = false
            this.reset();
            this.router.navigate(['account/shipping_address']);
          },1000);
        }
        else{
          this.showError();
        }
      });
    }
    
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

  getShippingAddres(id:number) {
    this.shippingAddressService.getShippingAddress(id, this.token)
    .subscribe((shipping: any) => {
      this.shippings = shipping['kitchenart']['results']
      this.cityId = this.shippings['city_id']
      this.cityName = this.shippings['city_name']
      this.subdistrictName = this.shippings['subdistrict_name']
      this.provinceId = this.shippings['province_id']
      this.shippingId = this.shippings['id']

      this.shippingForm.setValue(
        {
          label: this.shippings['label'],
          receiver_name: this.shippings['receiver_name'],
          receiver_phone: this.shippings['receiver_phone'],
          address: this.shippings['address'],
          province_id: this.shippings['province_id'],
          city_id: this.shippings['city_id'],
          subdistrict_id: this.shippings['subdistrict_id'],
          postal_zip: this.shippings['postal_zip']
        }
      )

      setTimeout(()=>{
        this.getCityByProvince(this.provinceId);
        this.getSubdistrict(this.cityId);
        this.getPostalCode(this.subdistrictName);
      }, 1000)
    })
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
    this.getShippingAddres(this.paramId);
    this.getProvince()
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.subcription){
      this.subcription.unsubscribe();
    }
  }

  compareProvince(x: any, y: any): boolean {
    return x && y ? x == y : x == y;
  }

  compareCity(x: any, y: any): boolean {
    return x && y ? x == y : x == y;
  }

  compareSubdistrict(x: any, y: any): boolean {
    return x && y ? x == y : x == y;
  }

  comparePostalZip(x: any, y: any): boolean {
    return x && y ? x == y : x == y;
  }

}
