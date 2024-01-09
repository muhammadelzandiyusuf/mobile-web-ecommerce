import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VoucherService } from '../../../../service/voucher/voucher.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.component.css']
})
export class VoucherDetailComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  param: any;
  vouchers: any;
  name: any;
  code: any;
  minimumAmount: any;
  domainAsset: any;
  pathImage: any;
  bannerImage: any;
  highlightIndonesia: any;
  highlightEnglish: any;
  termUseIndonesia: any;
  termUseEnglish: any;
  howToUseIndonesia: any;
  howToUseEnglish: any;
  dateStart: any;
  dateEnd: any;
  lang: any;
  token: any;
  countCart: any;
  voucher_id: any;

  constructor(
    private voucherService: VoucherService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private route: ActivatedRoute,
    private toastr : ToastrService
  ) { 
    this.route.params.subscribe((params : any) => {
      this.param = params['code']    
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.getDetailVoucher()
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Voucher');
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

  getDetailVoucher() {
    this.voucherService.getDetailVoucher(this.token, this.param)
    .subscribe((voucher: any) => {
      this.vouchers = voucher['kitchenart']['results']
      this.voucher_id = this.vouchers['voucher_id']
      this.name = this.vouchers['name']
      this.code = this.vouchers['code']
      this.minimumAmount = this.vouchers['minimum_amount']
      this.domainAsset = this.vouchers['domain_asset']
      this.pathImage = this.vouchers['path_image']
      this.bannerImage = this.vouchers['banner_image']
      this.highlightIndonesia = this.vouchers['highlight_indonesia']
      this.highlightEnglish = this.vouchers['highlight_english']
      this.termUseIndonesia = this.vouchers['term_use_indonesia']
      this.termUseEnglish = this.vouchers['term_use_english']
      this.howToUseIndonesia = this.vouchers['how_to_use_indonesia']
      this.howToUseEnglish = this.vouchers['how_to_use_english']
      this.dateStart = this.vouchers['date_start']
      this.dateEnd = this.vouchers['date_end']
      this.countCart = this.vouchers['count_cart']
    })
  }

  back() {
    this.router.navigate(['account/voucher']);
  }

  ngOnInit() {
  }

  useVoucher() {
    this.localSt.store('voucher', this.voucher_id);
    if(this.countCart > 0) {
      this.toastr.success('Successful to used');
      setTimeout(() => {
        this.router.navigate(['checkout']);
      }, 2000)
    }
    else {
      this.toastr.warning('Please, add item to cart');
      setTimeout(() => {
        this.router.navigate(['cart']);
      }, 3000)
    }
  
  }

}
