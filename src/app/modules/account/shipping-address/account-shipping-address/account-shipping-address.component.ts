import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ShippingAddressService } from '../../../../service/shipping-address/shipping-address.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-account-shipping-address',
  templateUrl: './account-shipping-address.component.html',
  styleUrls: ['./account-shipping-address.component.css']
})
export class AccountShippingAddressComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id:number = null;
  subcription: Subscription;
  navigationSubscription: any

  metaTag: any;
  term: any;
  shippings: any;
  actionDelete: boolean = false;
  addressLabel: any;
  addressId: any;
  choseShipping: boolean = false;
  token: any;

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private shippingAddressService: ShippingAddressService,
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
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Shipping Address');
  }

  initialiseInvites() {
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
      this.getShippingAddressList(this.token)
    }
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
  
  getShippingAddressList(token: any) {
    this.shippingAddressService.getListShippingAddress(token)
    .subscribe((shipping: any) => {
        this.shippings = shipping['kitchenart']['results']
    })
  }

  backToCheckout(): void {
    this.router.navigate(['account']);
  }

  updateAddres(id:number): void {
    this.router.navigate(['account/shipping_address/edit/', id]);
  }

  addAddress(): void {
    this.router.navigate(['account/shipping_address/add']);
  }

  deleteAddress(id:number): void {
    this.shippingAddressService.postDelete(id, this.token)
    .subscribe((shipping: any) => {
      let status = shipping['kitchenart']['results']['status']
      if(status == 'success') {
        this.showSuccess()
        this.getShippingAddressList(this.token)
        this.closeDelete()
      }
      else{
        this.showError()
      }
    })
  }

  updateShipping(id:number): void {
    this.shippingAddressService.postUpdate(id, this.token)
    .subscribe((shipping: any) => {
      let status = shipping['kitchenart']['results']['status']
      if(status == 'success') {
        this.choseShipping = true
        setTimeout(() => {
          this.getShippingAddressList(this.token)
          this.choseShipping = false
      }, 2000);
      }
      else{
        this.showErrorShipping()
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

  showSuccess() {
    this.toastr.success('Success Remove');
  }

  showError() {
    this.toastr.error('Can Not Remove');
  }

  showErrorShipping() {
    this.toastr.error('Can Not Choose Address');
  }

}
