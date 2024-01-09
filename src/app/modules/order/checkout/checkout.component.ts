import { Component, OnInit, OnDestroy } from '@angular/core';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { CartService } from '../../../service/cart/cart.service';
import { ShippingAddressService } from '../../../service/shipping-address/shipping-address.service';
import { CheckoutService } from '../../../service/checkout/checkout.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

declare function paymentMidtrans(token: any): any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

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
  serviceCourierCost: number = null;
  serviceCourierEtd: any;
  serviceCourierName: any = null;
  courierStatus: boolean = false
  cekCourier: boolean = false
  totalPayment: number = 0
  vouchers: any;
  codeCoupon = new FormControl();
  notes = new FormControl()
  promo: any;
  messageError: any = null;
  promotion: any= null;
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
  lang: any;
  token: any;
  snapToken: any;
  transactionData: any;
  weight: any;
  promoId: any;
  payMethod: boolean = false;
  showPayment: boolean = false;
  panelOpenState: boolean = false;
  creditCards: any;
  bankTransfers: any;
  paymentId: any = null;
  paymentName: any = null;
  paymentType: string = null;
  notLoad: boolean = false;
  codeUseVoucher: any = null;
  serviceCourierEtdEnd: any;
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
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Checkout');
  }

  ngOnInit() {
    
  }

  initialiseInvites() {
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    let voucher = this.localSt.retrieve('voucher');
    if(voucher) {
      this.codeUseVoucher = voucher;
    }
    this.lang = this.localSt.retrieve('lang');
    this.getShippingAddres(this.token)
    this.getListCart(this.token)
    this.getListPaymentMethod(this.token)
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

        this.getServiceCourierVoucher(this.cityId, this.subdistrictId, this.token)
      }
      else{
        this.notLoad = true;
      }
    })
  }

  getListCart(token: any) {
    this.cartService.getListCart(token)
    .subscribe((cart: any) => {
      this.carts = cart['kitchenart']['results']
      this.contents = this.carts['contents']
      this.total = this.carts['total']
      this.totalItems = this.carts['total_items']

      const insuranceV = (0.2 * this.total) / 100;
      const insurance = insuranceV + 5000;
      this.insurancePrice = insurance;
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

  getServiceCourierVoucher(city_id: any, subdistrict_id: any, token: any) {
    let promo = null;
    let promo_code = null;
    this.checkoutService.getListCourier(city_id, subdistrict_id, token, promo, promo_code, null, this.postalZip)
    .subscribe((courier: any) => {
        this.courier = courier['kitchenart']['results']['service']
        this.courierName = this.courier['courier']
        this.freeShipping = this.courier['free_shipping']
        // if(this.freeShipping == 'T'){
        //   this.serviceCourierCost = 0
        //   if(this.useBalance == 'T'){
        //     this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount - this.balance 
        //   }
        //   else{
        //     this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount
        //   }
        // }
        this.services = this.courier['services']
        this.balance = courier['kitchenart']['results']['balance']
        this.weight = this.courier['weight']
        
        this.vouchers = courier['kitchenart']['results']['gift_vouchers']
        this.notLoad = true;
        setTimeout(() => {
          if(this.codeUseVoucher != null) {
            this.usePromoVoucher(this.codeUseVoucher)
          }
        }, 2000)
    });
  }

  usePromoCopon(){
    this.promotion = 'coupon'
    this.checkoutService.getUseVoucherCoupon(this.promotion, this.codeCoupon.value, this.token)
    .subscribe((coupon: any) => {
        let status = coupon['kitchenart']['results']['status']
        this.messageError = null
        if(status == 'success'){
          this.promo = coupon['kitchenart']['results']
          this.promoCode = this.promo['promo_code']
          this.promoId = this.promo['promo_code']
          this.messagePromo = this.promo['message']
          this.totalDiscount = this.promo['total_discount']
          this.cekCourier = true

          this.creditCards = this.promo['credit_cards']
          this.bankTransfers = this.promo['bank_transfers']

          setTimeout(() => {
            if(this.useBalance == 'T'){
              this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount - this.balance + this.insuranceForTotal
            }
            else{
              this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal
            }
            this.cekCourier = false
            this.voucherCoupon = false
          }, 1000)

          this.clearPayment();
        }
        else{
          this.cekCourier = true
          setTimeout(() => {
            this.cekCourier = false
          }, 1000)
          this.messageError = coupon['kitchenart']['results']['message']
        }
    })
  }

  notUseCoupon() {
    this.promoCode = null
    this.promoId = null
    this.messagePromo = null
    this.totalDiscount = 0
    setTimeout(() => {
      if(this.useBalance == 'T'){
        this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount - this.balance + this.insuranceForTotal
      }
      else{
        this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal
      }
    }, 1000)

    this.getListPaymentMethod(this.token);
  }

  usePromoVoucher(code: any){
    this.codeVoucher = code
    this.promotion = 'voucher'
    this.checkoutService.getUseVoucherCoupon(this.promotion, code, this.token)
    .subscribe((coupon: any) => {
        let status = coupon['kitchenart']['results']['status']
        this.messageError = null
        if(status == 'success'){
          this.promo = coupon['kitchenart']['results']
          this.promoId = this.promo['gift_id']
          this.promoCode = this.promo['promo_code']
          this.messagePromo = this.promo['message']
          this.totalDiscount = this.promo['total_discount']
          this.cekCourier = true

          this.creditCards = this.promo['credit_cards']
          this.bankTransfers = this.promo['bank_transfers']
          
          setTimeout(() => {
            if(this.useBalance == 'T'){
              this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount - this.balance + this.insuranceForTotal
            }
            else{
              this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal
            }
            this.cekCourier = false
            this.voucherCoupon = false
          }, 1000)

          this.clearPayment();
        }
        else{
          this.cekCourier = true
          setTimeout(() => {
            this.cekCourier = false
          }, 1000)
          this.messageError = coupon['kitchenart']['results']['message'];

          if(this.codeUseVoucher != null) {
            this.showMessageVoucher(this.messageError);
          }
        }
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
      if(this.useBalance == 'T'){
        this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount - this.balance + this.insuranceForTotal;
      }
      else{
        this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal;
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
            'promo_code': this.promoId,
            'use_balance': this.useBalance,
            'notes': this.notes.value,
            'token': this.token,
            'free_shipping': this.freeShipping,
            'payment_method_id': this.paymentId,
            'payment_type': this.paymentType,
            'use_insurance': this.useInsurance
          }
  
          let pay = false;
          
          if(this.payMethod === false){
            this.toastr.warning('Choose Payment Method');
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
                this.showSuccessPayment()
                this.snapToken  = checkout['kitchenart']['results']['snap_token']
                // this.url = checkout['kitchenart']['results']['url']
                setTimeout(() => {
                  this.cekCourier = false
                  paymentMidtrans(this.snapToken)
                  // window.location.href = this.url;
                  this.localSt.clear('voucher');
                }, 1000)
              }
            })
          }
        }
        else{
          this.cekCourier = false
          this.showError()
        }
      }
      else{
        this.cekCourier = false
        this.showError()
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
      this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal - this.balance 
    }
    else{
      this.useBalance = 'F'
      this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount + this.insuranceForTotal
    }
  }

  usingInsurance() {
    if (this.checkedInsurance === false) {
      this.useInsurance = 'T';
      this.insuranceForTotal = this.insurancePrice;
      this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount + this.insurancePrice; - this.balance 
    }
    else {
      this.useInsurance = 'F';
      this.insuranceForTotal = 0;
      this.totalPayment = this.total + this.serviceCourierCost - this.totalDiscount - this.balance;
    }
  }

  getVoucherCoupon(){
    this.voucherCoupon = true
  }

  closeVoucherCoupon(){
    this.voucherCoupon = false
  }

  addShippingAddress(): void {
    this.router.navigate(['shipping-address-add']);
  }

  choseShippingAddress(): void {
    this.router.navigate(['shipping-address']);
  }

  backToCart(): void {
    this.router.navigate(['cart']);
  }

  showError() {
    this.toastr.warning('Choose shipping courier');
  }

  showErrorPostal() {
    this.toastr.warning('Postal Code Not Found');
  }

  showSuccessPayment() {
    this.toastr.success('Payment Successful');
  }

  showMessageVoucher(message: any) {
    this.toastr.warning(message);
  }

  goTo() {
    window.location.href = 'https://google.com';
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

  clearPayment() {
    this.paymentId = null;
    this.paymentName = null;
    this.paymentType = null;
    this.payMethod = false;
  }

}
