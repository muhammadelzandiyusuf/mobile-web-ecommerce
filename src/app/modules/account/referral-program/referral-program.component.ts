import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AccountService } from '../../../service/account/account.service';
import { ReferralProgramService } from '../../../service/referral-program/referral-program.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { TitleTagService } from '../../../service/meta/titletag.service';

@Component({
  selector: 'app-referral-program',
  templateUrl: './referral-program.component.html',
  styleUrls: ['./referral-program.component.css']
})
export class ReferralProgramComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id:number = null;
  subcription: Subscription;
  navigationSubscription:any
  metaTag: any;
  user: any;
  referralCode: any;
  referrals: any;
  termIndonesia: any;
  termEnglish: any;
  url: any
  domain: any;
  twitterText: string;
  token: any;
  domain_image: any;
  path_image: any;
  image_code: any;
  image_get: any;
  image_send: any;
  lang: string;
  show: boolean = false;
  shareLink: boolean = false;
  facebookShare: boolean = false;
  twitterShare: boolean = false;
  copyLink: any;
  title: any;
  image: any;
  description: any;
  site: any;
  fbEnable: any;
  twText: any;
  twEnable: any;
  gmail = new FormControl();
  body: any;
  notLoad: boolean = false
  websiteDomain: any;

  constructor(
    private accountService: AccountService,
    private referralService: ReferralProgramService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private titleTagService: TitleTagService
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
    this.titleService.setTitle('KitchenArt - Referral Program');
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
    this.lang = this.localSt.retrieve('lang');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
      if(this.token){
        this.getDataProfile(this.token);
      }
    }
    this.getDataReferralProgram()
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
        this.referralCode = this.user['referral_code']
        this.domain = this.user['domain_primary']
        this.url = this.domain + '/' + 'invite/' + this.referralCode
        this.websiteDomain = this.user['website_domain']
        this.twitterText = "Dapatkan%20diskon%20untuk%20pembelian%20Produk%20Built%20In%20Hob%2060%20cm%20HR602BA.%20Beli%20Di%20~%20"
    })
  }

  getDataReferralProgram() {
    this.notLoad = false;
    this.referralService.getReferralProgram(this.token)
    .subscribe((referral:any) => {
        if(referral['kitchenart']['status']['code'] === 200) {
          this.referrals = referral['kitchenart']['results']
          if(this.referrals.length > 0) {
            this.termIndonesia = this.referrals[0]['term_condition_indonesia']
            this.termEnglish = this.referrals[0]['term_condition_english']
          }
        }

        const data = referral['kitchenart']['step']
        this.domain_image = data['domain_image']
        this.path_image = data['path_image']
        this.image_code = data['image_code']
        this.image_get = data['image_get']
        this.image_send = data['image_send']
        this.show = true
        this.notLoad = true
    })
  }

  /* To copy Text from Textbox */
  copyInputMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.showSuccess()
  }

  shareLinkHandler(copylink: any, title: any, image: any, site: any, description: any, fbEnable: boolean, twText: any, twEnable: boolean) {
    this.shareLink = true;
    this.copyLink = copylink;
    this.title = title;
    this.image = image;
    this.site = site;
    this.description = description;
    this.fbEnable = fbEnable;
    this.twText = twText;
    this.twEnable = twEnable;
    this.body = "Dapatkan promo menarik dengan mengunjungi kode link referral sebagai berikut " + this.copyLink + ". Belanja mudah hanya di rumah aja"

    this.titleTagService.setTitle('KitchenArt - Referral Program');
    this.titleTagService.setSocialMediaTags(
      copylink, 
      title,
      description,
      image,
      twText,
      this.domain);
  }

  showSuccess() {
    this.toastr.success('Copied');
  }

  shareButtonTW() {
    window.open('https://twitter.com/share?url='+ this.copyLink + '&text=' + this.twText + '&via=kitchenart_id', '_blank');
  }

  shareButtonFB() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + this.copyLink, '_blank');
  }

  shareButtonWA() {
    window.open('whatsapp://send?text=' + this.copyLink, '_blank');
  }

  shareButtonGoogle() {
    window.open('mailto:' + this.gmail.value + '?subject=Link Referral Program KitchenArt' + '&body=' + this.body, '_blank');
  }

  copyLinkHandler() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.copyLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.showSuccess()
  }

  shareLinkCloseHandler() {
    this.shareLink = false;
  }

  goProductDetail(url: any) {
    this.router.navigate(['base/', url]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

}
