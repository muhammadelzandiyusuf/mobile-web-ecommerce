import { Component, OnInit, OnDestroy } from '@angular/core';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { ServiceInstallationService } from '../../../../service/service-installation/service-installation.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-service-installation',
  templateUrl: './service-installation.component.html',
  styleUrls: ['./service-installation.component.css']
})
export class ServiceInstallationComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any

  metaTag: any;
  term: any;
  termNameIndo: any;
  termNameEng: any;
  categories: any;
  lang: any;
  token: any;

  constructor(
    private installationService: ServiceInstallationService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Service & Installation');
  }

  ngOnInit() {
    this.getTerm();
    this.getServiceCategories()
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

  getTerm() {
    let slug = 'service_installations'
    this.termService.getBannerTerms(slug)
    .subscribe((term: any) => {
        this.term = term['kitchenart']['results']
        this.termNameIndo = this.term['name_indonesia']
        this.termNameEng = this.term['name_english']
    })  
  }

  getFormService(url: any): void {
    this.router.navigate(['service_installations/', url]);
  }

  getServiceCategories() {
    this.installationService.getServiceCategory()
    .subscribe((category: any) => {
      this.categories = category['kitchenart']['results']
    });
  }

}
