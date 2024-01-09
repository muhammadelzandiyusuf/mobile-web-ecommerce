import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../../service/account/account.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id :any= null;
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
  token: any;

  constructor(
    private accountService: AccountService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService
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
    this.titleService.setTitle('KitchenArt - Profile');
  }

  getMeta() {
    this.termService.getTagMeta()
    .subscribe(meta => {
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
    if(this.token){
      this.getDataProfile(this.token)
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

  getDataProfile(token: any) {
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
        this.imageDomain = this.user['image_domain']
        this.documentPath = this.user['document_path']
        this.avatarPath = this.user['avatar_path']
        this.avatarImage = this.user['avatar_image']
    })
  }

  backAccount(){
    this.router.navigate(['account']);
  }

  goToUrl() {
    this.router.navigate(['account/profile/edit']);
  }

}
