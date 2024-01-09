import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { AboutUsService } from '../../../service/about-us/about-us.service';
import { CategoryService } from '../../../service/category/category.service';
import { TermService } from '../../../service/term/term.service';
import { ContactUsService } from '../../../service/contact-us/contact-us.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  dangerousVideoUrl: string;
  videoUrl: any;
  aboutUs: any = [];
  milestone: any = [];
  awards: any = [];
  awardYear: any = []
  awardCertificate: any = []
  milestones: any = []
  milestoneBrand: any = []
  milestoneShowroom: any = []

  config: any = {
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 30
  };

  terms: any = [];
  category: any = [];
  panelOpenState = false;
  content_english: any;
  metaTag: any;
  paymentMethod: any;
  lang: any;
  content_indonesia: any;
  deviceInfo: any;
  heightVideo: any;
  aboutDomain: any;
  assets: any;
  pathPaymentIcon: any;
  iconPermata: string;
  iconCredit: string;
  iconBca: string;
  iconMandiri: string;

  constructor(
    private sanitizer: DomSanitizer,
    private aboutService: AboutUsService,
    private categoryService: CategoryService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private contactService: ContactUsService,
    private localSt:LocalStorageService,
    private deviceService: DeviceDetectorService,
    private router : Router
  ) { 
    this.dangerousVideoUrl = 'https://www.youtube.com/embed/_jRIRI3cPBA';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - About Us');
  }

  ngOnInit() {
    this.getDataAboutUs();
    this.getDataMilestone();
    this.getDataAward();
    this.getParentOurProduct();
    this.getOurProduct();
    // this.getPaymentMethod();
    this.epicFunction();
    this.getDomain();
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if(isMobile){
      this.heightVideo = "250px"
    }
    else if(isTablet){
      this.heightVideo = "500px"
    }
  }

  getPaymentMethod() {
    this.contactService.getMethodPaymentsChannel()
    .subscribe((payment: any) => {
        this.paymentMethod = payment['kitchenart']['results']
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

  getDataAboutUs() {
    this.aboutService.getAboutUs()
    .subscribe((about: any) => {
      this.aboutUs = about['kitchenart']['results'];
      this.content_english = this.aboutUs['content_english']
      this.content_indonesia = this.aboutUs['content_indonesia']
    });
  }

  getDataMilestone() {
    this.aboutService.getMilestones()
    .subscribe((milestones: any) => {
      this.milestone = milestones['kitchenart']['results'];
      this.milestones = this.milestone['milestones']
      this.milestoneBrand = this.milestone['milestone_brand']
      this.milestoneShowroom = this.milestone['milestone_showroom']
    });
  }

  getDataAward() {
    this.aboutService.getAwards()
    .subscribe((award: any) => {
      this.awards = award['kitchenart']['results'];
      this.awardYear = this.awards['years']
      this.awardCertificate = this.awards['awards']
    });
  }

  getParentOurProduct(): void {
    let publish = '';
    let parent = '';
    let sidx = 'id';
    let sort = 'asc'

    this.categoryService.getCategoryByParent(parent, publish, sidx, sort)
    .subscribe((terms: any) => {
      this.terms = terms['kitchenart']['results'];
    });
  }

  getDomain() {
    this.aboutService.getDomain()
    .subscribe((about: any) => {
      this.aboutDomain = about['kitchenart']['results']
      this.assets = this.aboutDomain['assets_domain']
      this.pathPaymentIcon = this.aboutDomain['payment_icon_path']
      this.iconPermata = "channel_atm_permata_va_5bb5b23f848a4.png"
      this.iconCredit = "channel_credit_card_5bb6d2fadfab7.png"
      this.iconBca = "channel_bca_klikpay_5bb5b36343017.png"
      this.iconMandiri = "channel_mandiri_clickpay_5bb5b36346f73.png"
    })
  }

  goLinkCategory(parent: any, link: any){
    this.router.navigate(['category/' + parent + '/' + link]);
  }

  goProductBrand(brand: any): void {
    this.router.navigate(['brand/', brand]); 
  }

  goLinkShowroom(link: any): void {
    this.router.navigate(['showrooms/', link]);
  }

  getOurProduct(): void {
    let publish = '';
    let sidx = 'id';
    let sort = 'asc'

    this.categoryService.getCategories(publish, sidx, sort)
    .subscribe((categories: any) => {
      this.category = categories['kitchenart']['results'];
    });
  }

}
