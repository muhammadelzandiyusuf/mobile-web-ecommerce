import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

import { MatSidenav } from '@angular/material';

import { MatDialog } from '@angular/material';
import { MenuFooterComponent } from './modules/views/menu-footer/menu-footer.component';

import { Term } from './service/term/term';
import { TermService } from './service/term/term.service';

import { LocalStorageService } from 'ngx-webstorage';
import { Bussiness } from './service/bussiness/bussiness';
import { CustomerService } from './service/customer/customer.service';
import { ToastrService } from '../../node_modules/ngx-toastr';
import { Subscription } from 'rxjs';
import { CartService } from './service/cart/cart.service';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AboutUsService } from './service/about-us/about-us.service';
import * as CryptoJS from 'crypto-js';
import { NotificationService } from './service/notification/notification.service';
import { ProductService } from './service/product/product.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  subcription: Subscription;

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  navigationSubscription: any;

  id: any = null;
  title = 'app';
  spinner: boolean = false

  selected: string;
  footerMenu = ['Our Company', 'Help & Info', 'Shopping Tools', 'Professional Resources', 'Culinary & Classes'];

  languages = [
    { value: 'en', viewValue: 'English' },
    { value: 'id', viewValue: 'Indonesia' }
  ];

  config: any = {
    slidesPerView: 4,
    spaceBetween: 5,
    grabCursor: true,

    mousewheelControl: true,
    keyboardControl: true,
    direction: 'horizontal',
    preloadImages: true,
    updateOnImagesReady: true,
    pagination: '.swiper-pagination',
    paginationClickable: true,
  };


  animal: string;
  name: string;
  terms: Term[];
  menuPopup: Term[];

  customer: Bussiness[];
  countCart: number = 0;
  cart: any;
  localItemCart: any;
  countCartLocal: number = 0
  domainImage: any;
  avatarPath: any;
  avatarImage: any = null;
  firstName: any = null;
  lastName: any =  null;
  personAs: any;
  lang: any;
  aboutDomain: any;
  websiteDomain: any;
  mobileDomain: any;
  time: any;
  token: any;
  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  countTransaction: number = 0;
  countTradein: number = 0;
  countNotif: number = 0;
  packageDeal: number = 0;
  dealzone: number = 0;
  giveaway: number = 0;
  clearance_sale: number = 0;
  sale_event: number = 0;
  tradein: number = 0;
  hotSpectacular: number = 0;
  sale_event_name: any;
  sale_event_url: any;
  assetDomain: any;
  pathIcon: any;
  pathPayment: any;
  security: any = [];
  termsFooterMenu: any = [];
  paymentInstants: any = [];
  paymentVirtuals: any = [];
  paymentCredits: any = [];
  paymentInstallments: any = [];

  constructor(
    private localSt: LocalStorageService,
    private router: Router,
    public dialog: MatDialog,
    private termService: TermService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private cartService: CartService,
    private translate: TranslateService,
    private deviceService: DeviceDetectorService,
    private aboutService: AboutUsService,
    private notificationService: NotificationService,
    private productService: ProductService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.epicFunction()
        this.initialiseInvites();
        if (this.token != null) {
          this.getDetailsCustomers();
        }
      }
    });
  }

  ngOnInit(): void {
    this.getFooterMenus();
    this.getMenuNavAvailable();
    this.getFooterMenuPayment();
  }

  getFooterMenuPayment() {
    this.termService.getFooterMenuPaymentChannel()
    .subscribe((channel: any) => {
      let data = channel['kitchenart']['results'];
      this.assetDomain = data['asset_domain'];
      this.pathIcon = data['path_icon'];
      this.pathPayment = data['path_payment'];
      this.security = data['security'];
      
      this.termsFooterMenu = data['terms'];
      this.paymentInstants = data['payment_instants'];
      this.paymentVirtuals = data['payment_virtuals'];
      this.paymentCredits = data['payment_credits'];
      this.paymentInstallments = data['payment_installments'];
    })
  }

  getMenuNavAvailable() {
    this.productService.getProductMenuNav()
    .subscribe((available: any) => {
      let data = available['kitchenart']['results'];
      this.packageDeal = data['package_deal']
      this.dealzone = data['dealzone']
      this.giveaway = data['giveaway']
      this.clearance_sale = data['clearance_sale']
      this.sale_event = data['sale_event']
      this.sale_event_name = data['sale_event_name']
      this.sale_event_url = data['sale_event_url']
      this.tradein = data['tradein']
      this.hotSpectacular = data['hot_spectacular']
    })
  }

  getCountNotification() {
      this.notificationService.getCountTransaction(this.token)
      .subscribe((notif: any) => {
        let notification = notif['kitchenart']['results'];
        this.countTransaction = notification['count'];

        this.notificationService.getCountTradein(this.token)
        .subscribe((trade: any) => {
          let tradein = trade['kitchenart']['results'];
          this.countTradein = tradein['count'];

          this.countNotif = this.countTransaction + this.countTradein;
        })
      })
  }

  epicFunction() {
    this.aboutService.getDomain()
    .subscribe((about: any) => {
      this.aboutDomain = about['kitchenart']['results']
      this.websiteDomain = this.aboutDomain['website_domain']
      this.mobileDomain = this.aboutDomain['mobile_domain']

      const isDesktopDevice = this.deviceService.isDesktop();
      if(isDesktopDevice){
        window.location.href = this.websiteDomain + this.router.url;
      }
    })
  }

  initialiseInvites() {
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }

    let time = this.localSt.retrieve('time');
    if(time){
      this.time = CryptoJS.AES.decrypt(time, this.key).toString(CryptoJS.enc.Utf8);
    }

    if(this.time) {
        let getTimeNow = new Date().getTime();
        if (getTimeNow > this.time) {
          this.logOut();
        }
    }
    this.localItemCart = this.localSt.retrieve('carts')
    if(this.localItemCart != null){
      this.countCartLocal = this.localItemCart.length
    }

    this.lang = this.localSt.retrieve('lang');
    if(this.lang){
      this.translate.setDefaultLang(this.lang);
      this.localSt.store('lang', this.lang);
      this.selected = this.lang
    }
    else{
      this.translate.setDefaultLang('en');
      this.localSt.store('lang', 'en');
      this.selected = 'en'
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

  getDetailsCustomers(): void {
    this.customerService.getDetailCustomer(this.token)
      .subscribe((customer: any) => {
        if(customer['kitchenart']['status']['code'] > 400){
          this.logOut();
        }
        else{
          this.customer = customer['kitchenart']['results'][0];
          this.domainImage = this.customer['image_domain']
          this.avatarPath = this.customer['avatar_path']
          this.avatarImage = this.customer['avatar_image']
          this.firstName = this.customer['first_name']
          this.lastName = this.customer['last_name']
          this.personAs = this.customer['person_as']

          this.cartService.getCountCart(this.token)
          .subscribe(cart => {
            this.cart = cart['kitchenart']['results']
            this.countCart = this.cart['total_items']

            this.getCountNotification();

            let getTimeNow = new Date().getTime();
            if (getTimeNow > this.time) {
              this.logOut();
            }
          })
        }
      });
  }

  getFooterMenus(): void {
    let publish = '';
    let parent = '';
    let sidx = 'id';
    let sort = 'asc'

    this.termService.getMenuFooter(publish, parent, sidx, sort)
      .subscribe((terms: any) => {
        this.terms = terms['kitchenart']['results'];
      });
  }

  getMenuPopUp(parent: any): void {
    let publish = 'T';
    let sidx = 'position';
    let sort = 'asc'

    this.termService.getMenuFooterByParent(publish, parent, sidx, sort)
      .subscribe((terms: any) => {
        this.menuPopup = terms['kitchenart']['results'];
        let dialogRef = this.dialog.open(MenuFooterComponent, {
          width: '100%',
          height: '100%',
          data: { name_english: this.menuPopup[0]['parent_name_english'], name_indonesia: this.menuPopup[0]['parent_name_indonesia'], results: this.menuPopup, language: this.selected }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.menuPopup = [];
        });
      });
  }

  goProduct(group: any) {
    this.router.navigateByUrl(`/product/${group}`);
    this.sidenav.toggle();
  }

  goLink(link: any): void {
    this.router.navigate([link]);
    this.sidenav.toggle();
  }

  

  logOut() {
    this.spinner = true
    this.showSuccess()
    this.localSt.clear('customer');
    this.localSt.clear('carts');
    this.localSt.clear('time');
    this.localSt.clear('token');
    this.localSt.clear('voucher');
    this.countCartLocal = 0
    this.token = null;
    this.sidenav.toggle();
    setTimeout(() => {
      this.spinner = false
      this.router.navigate(['/']);
      location.reload()
    }, 2000);
  }

  getSearch() {
    this.router.navigate(['/search/result?search=']);
  }

  toChart() {
    this.router.navigate(['/cart']);
  }

  showSuccess() {
    this
      .toastr
      .success('Logout');
  }

  searchProduct(){
    this.router.navigate(['/search']);
  }

  notification() {
    this.router.navigate(['/notification']);
  }

  toLink(link: any) {
    this.router.navigate([link]);
  }

  useLanguage(language: string) {
    this.translate.use(language);
    this.localSt.store('lang', language);
    setTimeout(() => {
      window.location.href = this.router.url
    }, 1000)
  }

}