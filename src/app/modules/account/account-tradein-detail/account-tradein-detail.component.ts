import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { TradeinService } from '../../../service/tradein/tradein.service';
import { FormControl } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-account-tradein-detail',
  templateUrl: './account-tradein-detail.component.html',
  styleUrls: ['./account-tradein-detail.component.css']
})
export class AccountTradeinDetailComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  
  referralCode: any;
  referrals: any;
  termIndonesia: any;
  termEnglish: any;
  metaKeyword: any;
  metaDescription: any;
  product_detail: any;
  videoUrl: any;
  specification: any = [];
  product_image: any;
  param: any;

  slide_active = 0;
  thumb_active = 0;
  price: any;
  discount_price: any;
  brand_name: any;
  name: any;
  highlight_indonesia: any;
  highlight_english: any;
  image_domain: any;
  banner_image_path: any;
  cutsize_image_path: any;
  product_excellence: any;
  banner_image_name: any;
  cutsize_image_name: any;
  description_indonesia: any;
  description_english: any;

  extended_warranties: any;
  contract_services: any;
  warranty = new FormControl()
  contractService = new FormControl()
  warranties: any = null;
  services: any = null
  lang: any;
  token: any;
  code: any;
  discount: any;

  constructor(
    private tradeinService: TradeinService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
  ) { 
    this.route.params.subscribe(params => {
      this.param = params['code']    
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.getTradeinDetail(this.param, this.token)
        }
      }
    });
    this.titleService.setTitle('KitchenArt - Referral Program');
  }

  getMeta(keyword:string, description:string) {
    this.termService.getTagMeta()
    .subscribe((meta:any) => {
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
    this.lang = this.localSt.retrieve('lang');
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

  getTradeinDetail(registration_no:string, token:any) {
    this.tradeinService.getTradeInProductDetail(registration_no, token)
    .subscribe((tradein:any) => {
      this.product_detail = tradein['kitchenart']['results'];
      if(this.product_detail != null){
        this.specification = this.product_detail['specification'];
        this.product_image = this.product_detail['product_image'];
        this.brand_name = this.product_detail['brand_name'];
        this.name = this.product_detail['name'];
        this.code = this.product_detail['code'];
        this.price = this.product_detail['price'];
        this.discount = this.product_detail['discount'];
        this.discount_price = this.product_detail['discount_price'];
        this.highlight_english = this.product_detail['highlight_english'];
        this.highlight_indonesia = this.product_detail['highlight_indonesia'];
        this.image_domain = this.product_detail['image_domain'];
        this.banner_image_path = this.product_detail['banner_image_path'];
        this.banner_image_name = this.product_detail['banner_image_name'];
        this.cutsize_image_path = this.product_detail['cutsize_image_path'];
        this.cutsize_image_name = this.product_detail['cutsize_image_name'];
        this.product_excellence = this.product_detail['product_excellence'];
        this.description_english = this.product_detail['description_english'];
        this.description_indonesia = this.product_detail['description_indonesia'];

        this.extended_warranties = this.product_detail['extended_warranties']
        this.contract_services = this.product_detail['contract_services']

        let keyword = this.product_detail['meta_keyword']
        let description = this.product_detail['meta_description']
        if(this.product_detail['video_url']){
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.product_detail['video_url']);
        }
        this.getMeta(keyword, description)
      }
    })
  }

  slideImage(i:any) {
    this.slide_active = i;
    this.thumb_active = i;
  }

  buyNow() {
    this.localSt.store('warranty', this.warranties);
    this.localSt.store('service', this.services);
    this.router.navigate(['checkout/trade_in/' + this.param + '/' + this.code]);
  }

  addWarranty(id:number, price:any, periode_english:any, periode_indonesia:any){
    this.warranties = {
      'id' : id,
      'price' : price,
      'periode_english' : periode_english,
      'periode_indonesia' : periode_indonesia
    };
  }

  removeWarranty() {
    this.warranties = null
  }

  addContractService(id:number, price:any, periode_english:any, periode_indonesia:any){
    this.services = {
      'id' : id,
      'price' : price,
      'periode_english' : periode_english,
      'periode_indonesia' : periode_indonesia
    };
  }

  removeService() {
    this.services = null
  }

}
