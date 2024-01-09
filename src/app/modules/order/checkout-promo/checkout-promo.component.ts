import { Component, OnInit, OnDestroy } from '@angular/core';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { CartService } from '../../../service/cart/cart.service';
import { ShippingAddressService } from '../../../service/shipping-address/shipping-address.service';
import { CheckoutService } from '../../../service/checkout/checkout.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CityService } from '../../../service/city/city.service';
import { ProvinceService } from '../../../service/province/province.service';
import * as CryptoJS from 'crypto-js';
import { ShippingDestination } from '../../../service/shipping-address/shipping-destination';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

declare function paymentMidtrans(token: any): any;

@Component({
  selector: 'app-checkout-promo',
  templateUrl: './checkout-promo.component.html',
  styleUrls: ['./checkout-promo.component.css']
})
export class CheckoutPromoComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any

  metaTag: any;
  term: any;
  carts: any;
  contents: any;
  total: any = 0;
  totalItems: any;
  shippings: any;
  label: any;
  receiverName: any = null;
  address: any;
  province: any;
  city: any;
  subdistrict: any;
  postalZip: any;
  receiverPhone: any;
  cityId: any;
  subdistrictId: any;
  courier: any;
  courierName: any;
  freeShipping: any;
  services: any;
  courierId: any = null
  serviceCourier: any = null;
  serviceCourierCost: any = null;
  serviceCourierEtd: any;
  serviceCourierName: any = null;
  courierStatus: boolean = false
  cekCourier: boolean = false
  totalPayment: any = 0
  vouchers: any;
  codeCoupon = new FormControl();
  notes = new FormControl()
  promo: any;
  messageError: any = null;
  promotion: any = null;
  codeVoucher: any = null;
  voucherCoupon: boolean = false;
  totalDiscount: number = 0;
  promoCode: any = null;
  messagePromo: any;
  balance: number = 0;
  checked: boolean = false;
  checkedInsurance: boolean = false
  useBalance: string = 'F'
  shippingId: any;
  url: any;
  promoName: any;
  codePromo: any;
  ErrorMessage: any = null;
  subtotal: number = 0;
  promotionText: string

  shippingForm: FormGroup;
  provinces: any = []
  cities: any = []
  subdistricts: any = []
  cityDisabled = true;
  subdistrictDisabled = true;
  postal: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  spinner: boolean = false
  message: any;

  addShipping: boolean = false
  listShipping: boolean = false
  shippingLists: any = [];
  actionDelete: boolean = false;
  addressLabel: any;
  addressId: any;
  choseShipping: boolean = false;
  updateShippingCheck: boolean = false

  shippingUpdateForm: FormGroup;
  provinceId: any;
  shippingCityId: any;
  shippingUpdates: any;
  shippingUpdateId: any;

  warranty: any = null
  service: any = null
  warrantyID: any = null;
  warrantyPrice: any;
  warrantyPeriodeEnglish: any;
  warrantyPeriodeIndonesia: any;
  serviceID: any = null;
  servicePrice: any;
  servicePeriodeEnglish: any;
  servicePeriodeIndonesia: any;
  lang: any;
  token: any;
  snapToken: any;
  productCode: any;
  payMethod: boolean = false;
  showPayment: boolean = false;
  panelOpenState: boolean = false;
  creditCards: any;
  bankTransfers: any;
  paymentId: any = null;
  paymentName: any;
  paymentType: string = null;
  notLoad: boolean = false;
  cekShipping: boolean = true;
  serviceCourierEtdEnd: any;
  isLoading: boolean = false;
  destinations: any = [];
  cityName: any;
  subdistrictName: any;
  postalCodeShow: boolean = true;
  postal_zip: any;

  useInsurance: any = 'F';
  insurancePrice: any = 0;
  insuranceForTotal: any = 0;

  constructor(
    private cartService: CartService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private shippingAddressService: ShippingAddressService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private provinceService: ProvinceService,
    private cityService: CityService,
  ) { 
    this.route.params.subscribe((params: any) => {
      if(params['promo'] == 'trade_in'){
        this.promotionText = 'Trade In'
      }
      else{
        this.promotionText = 'Referral'
      }
      this.promotion = params['promo']
      this.promoName = params['promo']  
      this.codePromo = params['code'] 
      this.productCode = params['product'] 
    })
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
    this.titleService.setTitle('KitchenArt - Checkout');
  }

  ngOnInit() {
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

    // this.shippingUpdateForm
    //   .get('postal_zip')
    //   .valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     tap(() => this.isLoading = true),
    //     switchMap((value: any) => this.cityService.getShippingAddressByPostalCode(value, this.shippingUpdateForm.value['subdistrict_id']['name'])
    //     .pipe(
    //       finalize(() => this.isLoading = false),
    //       )
    //     )
    //   )
    //   .subscribe((destiny: any) => this.destinations = destiny['kitchenart']['results']);
  }

  // displayFn(address: ShippingDestination) {
  //   if (address) { return address.full_address; }
  // }

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

    this.shippingUpdateForm = new FormGroup({
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

  initialiseInvites() {
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.lang = this.localSt.retrieve('lang');
    this.warranty = this.localSt.retrieve('warranty')
    if(this.warranty != null){
        this.warrantyID = this.warranty['id']
        this.warrantyPrice = this.warranty['price']
        this.warrantyPeriodeEnglish = this.warranty['periode_english']
        this.warrantyPeriodeIndonesia = this.warranty['periode_indonesia']
    }
    this.service = this.localSt.retrieve('service')
    if(this.service != null){
      this.serviceID = this.service['id']
      this.servicePrice = this.service['price']
      this.servicePeriodeEnglish = this.service['periode_english']
      this.servicePeriodeIndonesia = this.service['periode_indonesia']
    }
    this.getShippingAddres(this.token)
    setTimeout(() => {
      this.getListCart(this.promoName, this.codePromo, this.token)
      this.getListPaymentMethod(this.token)
    }, 2000)
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.subcription){
      this.subcription.unsubscribe();
    }
  }

  getShippingAddres(token: any) {
    this.shippingAddressService.getActiveShippingAddress(token)
    .subscribe((shipping: any) => {
      this.shippings = shipping['kitchenart']['results']
      if(this.shippings['status'] === 'success'){
        this.label = this.shippings['label']
        this.shippingId = this.shippings['id']
        this.receiverName = this.shippings['receiver_name']
        this.receiverPhone = this.shippings['receiver_phone']
        this.address = this.shippings['address']
        this.province = this.shippings['province']
        this.city = this.shippings['city']
        this.cityId = this.shippings['city_id']
        this.subdistrict = this.shippings['subdistrict']
        this.subdistrictId = this.shippings['subdistrict_id']
        this.postalZip = this.shippings['postal_zip']

        this.getServiceCourierVoucher(this.cityId, this.subdistrictId, this.token, this.promotion, this.codePromo)
      }
      else{
        this.notLoad = true;
      }
    })
  }

  getListCart(promo: any, promo_code: any, token: any) {
    this.cartService.getListCartPromo(promo, promo_code, this.productCode, token, this.warrantyID, this.serviceID)
    .subscribe((cart: any) => {
      this.carts = cart['kitchenart']['results']
      this.contents = this.carts['contents']
      this.total = this.carts['total']
      this.totalItems = this.carts['total_items']
      this.subtotal = this.carts['subtotal']

      this.promoCode = promo_code
      this.messagePromo = this.carts['message']
      this.totalDiscount = this.carts['discount']
      this.ErrorMessage = this.carts['message_error']

      const insuranceV = (0.2 * this.subtotal) / 100;
      const insurance = insuranceV + 5000;
      this.insurancePrice = insurance;

      if(this.freeShipping == 'T'){
        this.totalPayment = this.subtotal + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal
      }
    })
  }

  getListPaymentMethod(token: any) {
    this.checkoutService.getPaymentMethodChannel(token)
    .subscribe((payment: any) => {
      const data = payment['kitchenart']['results']
      this.creditCards = data['credit_cards']
      this.bankTransfers = data['bank_transfers']
    })
  }

  getServiceCourierVoucher(city_id: any, subdistrict_id: any, token: any, promo: any, promo_code: any) {
    this.checkoutService.getListCourier(city_id, subdistrict_id, token, promo, promo_code, this.productCode, this.postalZip)
    .subscribe((courier: any) => {
        this.courier = courier['kitchenart']['results']['service']
        this.courierName = this.courier['courier']
        this.freeShipping = this.courier['free_shipping']
        if(this.freeShipping == 'T'){
          this.serviceCourierCost = 0
        }
        this.services = this.courier['services']
        this.balance = courier['kitchenart']['results']['balance']
        
        this.vouchers = courier['kitchenart']['results']['gift_vouchers']

        setTimeout(() => {
          this.totalPayment = this.subtotal + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal
          this.notLoad = true;
        }, 3000)
    })
  }

  showCourier() {
    this.courierStatus = true
  }

  closeCourier() {
    this.courierStatus = false
  }

  chooseCourier(index: any){
    this.courierId = index
    this.serviceCourier = this.services[index]
    // this.serviceCourierName = this.serviceCourier['service']
    // this.serviceCourierEtd = this.serviceCourier['etd']
    // this.serviceCourierCost = this.serviceCourier['cost']
    this.serviceCourierName = this.serviceCourier['service_display']
    this.serviceCourierEtd = this.serviceCourier['etd_from']
    this.serviceCourierEtdEnd = this.serviceCourier['etd_thru']
    this.serviceCourierCost = this.serviceCourier['total_price']
    this.courierStatus = false
    this.cekCourier = true
    setTimeout(() => {
      this.cekCourier = false
      if(this.useBalance == 'T') {
        this.totalPayment = this.subtotal + this.serviceCourierCost - this.totalDiscount - this.balance + this.insuranceForTotal
      }
      else{
        this.totalPayment = this.subtotal + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal
      }
    }, 1000)
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

  payment() {
    if (this.postalZip !== 0) {
      if (this.serviceCourierCost !== null) {
        if(this.totalPayment != 0){
          let dataPayment = {
            'shipping_address_id': this.shippingId,
            'service': this.serviceCourierName,
            'promo': this.promotion,
            'promo_code': this.codePromo,
            'use_balance': this.useBalance,
            'notes': this.notes.value,
            'token': this.token,
            'free_shipping': this.freeShipping,
            'warranty_id': this.warrantyID,
            'service_id': this.serviceID,
            'code': this.productCode,
            'payment_method_id': this.paymentId,
            'payment_type': this.paymentType,
            'use_insurance': this.useInsurance
          }

          let pay = false;
          if(this.payMethod === false){
            this.toastr.warning('Choose Payment Method');
          }
          else if (this.freeShipping === 'F' && this.serviceCourierCost === null) {
            this.toastr.warning('Choose Courier Shipping');
          }
          else{
            pay = true;
          }



          if(pay === true) {
            this.cekCourier = true
            this.checkoutService.checkoutPayment(dataPayment)
            .subscribe((checkout: any) => {
              let status = checkout['kitchenart']['results']['status']
              if(status == 'success'){
                this.localSt.clear('warranty');
                this.localSt.clear('service');
                this.showSuccessPayment()
                this.snapToken  = checkout['kitchenart']['results']['snap_token']
                setTimeout(() => {
                  this.cekCourier = false
                  paymentMidtrans(this.snapToken)
                }, 1000)
              }
            })
          }
        }
        else{
          this.showError()
          this.cekCourier = false
        }
      }
      else {
        this.showError()
        this.cekCourier = false
      }
    }
    else {
      this.cekCourier = false
        this.showErrorPostal()
    }
  }

  usingBalance(){
    this.useBalance = 'T'
    if(this.checked === false){
      this.useBalance = 'T'
      this.totalPayment = this.subtotal + this.serviceCourierCost - this.totalDiscount - this.balance + this.insuranceForTotal
    }
    else{
      this.useBalance = 'F'
      this.totalPayment = this.subtotal + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal
    }
  }

  usingInsurance() {
    if (this.checkedInsurance === false) {
      this.useInsurance = 'T';
      this.insuranceForTotal = this.insurancePrice;
      this.totalPayment = this.subtotal + this.serviceCourierCost - this.totalDiscount + this.insurancePrice; - this.balance 
    }
    else {
      this.useInsurance = 'F';
      this.insuranceForTotal = 0;
      this.totalPayment = this.subtotal + this.serviceCourierCost - this.totalDiscount - this.balance;
    }
  }

  addShippingAddress(): void {
    this.addShipping = true
    this.listShipping = false
    this.updateShippingCheck = false
    this.getProvince();
  }

  closeShipping(): void {
    this.addShipping = false
    this.listShipping = false
    this.updateShippingCheck = false
  }

  updateAddres(id: any): void {
    this.updateShippingCheck = true
    this.addShipping = false
    this.listShipping = false
    this.getUpdateShippingAddres(id);
    this.getProvince()
    // setTimeout(()=>{
    //   this.getCityByProvince(this.provinceId)
    //   this.getSubdistrict(this.cityId)
    // }, 1000)
  }

  choseShippingAddress(): void {
    this.listShipping = true
    this.getShippingAddressList(this.token)
  }

  backToDetail(): void {
    if(this.promotion == 'trade_in'){
      this.router.navigate(['account/trade_in/', this.promoCode]);
    }
    else{
      this.router.navigate(['invite/' + this.productCode + '/' + this.promoCode]);
    }
  }

  showError() {
    this.toastr.warning('Choose shipping courier');
  }

  showSuccessPayment() {
    this.toastr.success('Payament successfully');
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
          this.addShipping = false
          location.reload();
        },1000);
      }
      else{
        this.showErrorShipping();
      }
    });
    
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    this.toastr.success(this.message);
  }

  showErrorShipping() {
    this.toastr.error(this.message);
  }

  getShippingAddressList(id: any) {
    this.shippingAddressService.getListShippingAddress(id)
    .subscribe((shipping: any) => {
        this.shippingLists = shipping['kitchenart']['results']
        this.cekShipping = false;
    })
  }

  deleteAddress(id: any): void {
    this.shippingAddressService.postDelete(id, this.token)
    .subscribe((shipping: any) => {
      let status = shipping['kitchenart']['results']['status']
      if(status == 'success') {
        this.showSuccessList()
        this.getShippingAddressList(this.token)
        this.closeDelete()
      }
      else{
        this.showErrorList()
      }
    })
  }

  updateShipping(id: any): void {
    this.shippingAddressService.postUpdate(id, this.token)
    .subscribe((shipping: any) => {
      let status = shipping['kitchenart']['results']['status']
      if(status == 'success') {
        this.choseShipping = true
        this.getShippingAddres(this.token)
        this.choseShipping = false
        this.closeShipping()
        setTimeout(() => {
          location.reload();
      }, 2000);
      }
      else{
        this.showErrorShippingList()
      }
    })
  }

  deleteAddressShow(label: any, id: any) {
    this.addressLabel = label
    this.addressId = id
    this.actionDelete = true
  }

  closeDelete(){
    this.actionDelete = false
  }

  showSuccessList() {
    this.toastr.success('Success Remove');
  }

  showErrorList() {
    this.toastr.error('Can Not Remove');
  }

  showErrorShippingList() {
    this.toastr.error('Can Not Choose Address');
  }

  showErrorPostal() {
    this.toastr.warning('Postal Code Not Found');
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

  getUpdateShippingAddres(id: any) {
    this.shippingAddressService.getShippingAddress(id, this.token)
    .subscribe((shipping: any) => {
      this.shippingUpdates = shipping['kitchenart']['results']
      this.shippingCityId = this.shippingUpdates['city_id']
      this.cityName = this.shippingUpdates['city_name']
      this.subdistrictName = this.shippingUpdates['subdistrict_name']
      this.provinceId = this.shippingUpdates['province_id']
      this.shippingUpdateId = this.shippingUpdates['id']

      this.shippingUpdateForm.setValue(
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
        this.getSubdistrict(this.shippingCityId);
        this.getPostalCode(this.subdistrictName);
      }, 1000)
    })
  }

  registerUpdateShipping(): void {
    this.spinner = true
    const formModel = this.shippingUpdateForm.value;

    if (formModel['postal_zip'] === 0 || formModel['postal_zip'] === '' || formModel['postal_zip'] === null) {
      this.toastr.warning('Postal Code Can Not Empty');
      this.spinner = false
    }
    else{
      this.shippingAddressService.postEdit(formModel, this.shippingUpdateId, this.token)
      .subscribe((shipping: any) => {
        const status = shipping['kitchenart']['results']['status'];
        this.message = shipping['kitchenart']['results']['message'];
        if(status == 'success'){
          this.showSuccess();
          this.spinner = false
          this.reset();
          this.getShippingAddres(this.token)
          this.closeShipping()
          setTimeout(()=>{
            location.reload();
          },2000);
        }
        else{
          this.showError();
        }
      });
    }
    
  }

  paymentMethod() {
    this.showPayment = true;
  }

  closePaymentMethod() {
    this.showPayment = false;
  }

  chossePayment(id: any, name: any, cc: any) {
    this.paymentId = id;
    this.paymentName = name;
    if(cc === 'T') {
      this.paymentType = 'credit_card';
    }
    else{
      this.paymentType = 'bank_transfer';
    }
  }

  submitPaymentChannel(){
    if(this.paymentId === null) {
      this.toastr.warning('Choose Payment Method');
    }
    else{
      this.cekCourier = true
      setTimeout(() => {
        this.payMethod = true;
        this.cekCourier = false
        this.showPayment = false;
      }, 2000)
    }
  }

}
