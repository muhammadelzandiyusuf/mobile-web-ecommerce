import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Router, NavigationEnd} from "@angular/router";

import {Banner} from '../../service/banner/banner';
import {BannerService} from '../../service/banner/banner.service';

import {MatSnackBar} from '@angular/material';
import {ProductService} from '../../service/product/product.service';
import {TermService} from '../../service/term/term.service';
import {Meta, Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {BrandService} from '../../service/brand/brand.service';
import {CategoryService} from '../../service/category/category.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';

@Component(
    {selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.css']}
)
export class HomeComponent implements OnInit, OnDestroy {
    subcription: Subscription;

    lang: string;
    navigationSubscription: any

    mode = new FormControl('over');
    products: any = [];
    metaTag: any= [];

    text: any = {
        Year: 'Y',
        Month: 'M',
        Weeks: "W",
        Days: ":",
        Hours: ":",
        Minutes: ":",
        Seconds: "",
        MilliSeconds: "MS"
    };

    config: any = {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        centeredSlides: true,
        autoplay: 2500,
        autoplayDisableOnInteraction: false,

        mousewheelControl: true,
        keyboardControl: true,
        direction: 'horizontal',
        preloadImages: true,
        updateOnImagesReady: true
    };

    configProd: any = {};

    configDeal: any = {};

    banners: Banner[];
    saleItems: any;
    countSale: any;
    dealzones: any;
    countDealzone: any;
    brands: any;
    categories: any;
    bestSellers: any;
    countBestSeller: any;
    topPicks: any;
    countTopPicks: any;
    newCollections: any;
    countNewCollection: any;
    preOrder: any;
    countPreOrder: any;
    key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
    token: any = '';
    underDevelop: boolean = true;
    dateDelalZone: any;
    freeItems: any;
    hotSpectacular: any;
    countHot: number = 0;
    popUpPromo: boolean = false;
    bannerImage: any = null;
    bannerUrl: any = null;
    bannerPublish: any = 'F';
    saleEventProducts: any;
    countSaleEvent: any;
    saleEventUrl: any;
    saleEventName: any;
    

    constructor(
        private bannerService : BannerService,
        private router : Router,
        public snackBar : MatSnackBar,
        private productService : ProductService,
        private termService : TermService,
        private meta : Meta,
        private titleService : Title,
        private brandService : BrandService,
        private categoryService : CategoryService,
        private localSt: LocalStorageService,
        private deviceService: DeviceDetectorService
    ) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
              this.initialiseInvites();
            }
        });
        this.getMeta()
    }

    initialiseInvites() { 
        this.lang = this.localSt.retrieve('lang');
        let token = this.localSt.retrieve('token');
        if(token){
            this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
        }
        this.epicFunction();
        setTimeout(() => {
            this.getSaleEvent();
        }, 3000)
    }

    underClose() {
        this.underDevelop = false;
    }

    ngOnInit() {
        this.getBannerPromotion();
        this.getBanner();
        this.getProductPackage();
        this.getSaleItem()
        this.getDealZone()
        this.getBrandHome()
        this.getCategoryParent()
        this.getBestseller()
        this.getTopPicks()
        this.getNewCollection()
        this.getPreOrder()
        this.getFreeItem()
        this.getHotSpectacular()
        this
            .titleService
            .setTitle('Welcome to Kitchenart');
    }

    ngOnDestroy() {

    }

    epicFunction() {
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        if(isMobile){
            this.configProd = {
                slidesPerView: 2,
                spaceBetween: 5,
                grabCursor: true,
                centeredSlides: true,

                mousewheelControl: true,
                keyboardControl: true,
                direction: 'horizontal',
                preloadImages: true,
                updateOnImagesReady: true
            };
            this.configDeal = {
                slidesPerView: 2,
                spaceBetween: 10,
                grabCursor: true,
                centeredSlides: false,
                mousewheelControl: true,
                keyboardControl: true,
                direction: 'horizontal',
                preloadImages: true,
                updateOnImagesReady: true
            };
        }
        else if(isTablet){
            this.configProd = {
                slidesPerView: 4,
                spaceBetween: 5,
                grabCursor: true,
                centeredSlides: true,

                mousewheelControl: true,
                keyboardControl: true,
                direction: 'horizontal',
                preloadImages: true,
                updateOnImagesReady: true
            };
            this.configDeal = {
                slidesPerView: 4,
                spaceBetween: 5,
                grabCursor: true,
                centeredSlides: false,
                mousewheelControl: true,
                keyboardControl: true,
                direction: 'horizontal',
                preloadImages: true,
                updateOnImagesReady: true
            };
        }
      }

    getBrandHome() {
        let publish = 'T'
        let sidx = 'position'
        let sort = 'ASC'
        let limit = 8;
        const tablet = this.deviceService.isTablet();
        if(tablet){
            limit = 12;
        }
        let start = 0

        this
            .brandService
            .getBrandHome(publish, sidx, sort, limit, start)
            .subscribe((brand: any) => {
                this.brands = brand['kitchenart']['results']
            })
    }

    getProductPackage(): void {
        const publish = 'T';
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;

        this
            .productService
            .getProductPackageDeal(publish, sidx, sort, limit, offset)
            .subscribe((products: any) => {
                this.products = products['kitchenart']['results'];
            });
    }

    getFreeItem(): void {
        const publish = 'T';
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;

        this
            .productService
            .getProductGetFree(publish, sidx, sort, limit, offset)
            .subscribe((products: any) => {
                this.freeItems = products['kitchenart']['results'];
            });
    }

    getSaleItem(): void {
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;
        this
            .productService
            .getProductSaleItems(sidx, sort, limit, offset, this.token)
            .subscribe((product: any) => {
                this.saleItems = product['kitchenart']['results']
                this.countSale = this.saleItems.length
            });
    }

    getSaleEvent(): void {
        const sidx = 'id';
        const sort = 'asc';
        const limit = 10;
        const offset = 0;
        
        this.productService.getProductSaleEvents(sidx, sort, limit, offset, this.token)
        .subscribe((product: any) => {
          this.saleEventProducts = product['kitchenart']['results']
          this.countSaleEvent = this.saleEventProducts.length;
          if(this.countSaleEvent > 0) {
            this.saleEventUrl = this.saleEventProducts[0]['event_url']
            this.saleEventName = this.saleEventProducts[0]['sale_event_name']
          }
        });
      }

    getHotSpectacular(): void {
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;
        this
            .productService
            .getProductHotSpectacular(sidx, sort, limit, offset, this.token)
            .subscribe((product: any) => {
                this.hotSpectacular = product['kitchenart']['results']
                this.countHot = this.hotSpectacular.length
            });
    }

    getDealZone(): void {
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;
        this
            .productService
            .getProductDealZones(sidx, sort, limit, offset, this.token)
            .subscribe((product: any) => {
                this.dealzones = product['kitchenart']['results']
                this.countDealzone = this.dealzones.length
                if(this.countDealzone > 0) {
                    this.dateDelalZone = this.dealzones[0]['date_end']
                }
            });
    }

    getBestseller(): void {
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;
        this
            .productService
            .getProductBestSeller(sidx, sort, limit, offset, this.token)
            .subscribe((product: any) => {
                this.bestSellers = product['kitchenart']['results']
                this.countBestSeller = this.bestSellers.length
            });
    }

    getTopPicks(): void {
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;
        this
            .productService
            .getProductTopPicks(sidx, sort, limit, offset, this.token)
            .subscribe((product: any) => {
                this.topPicks = product['kitchenart']['results']
                this.countTopPicks = this.topPicks.length
            });
    }

    getNewCollection(): void {
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;
        this
            .productService
            .getProductNewCollection(sidx, sort, limit, offset, this.token)
            .subscribe((product: any) => {
                this.newCollections = product['kitchenart']['results']
                this.countNewCollection = this.newCollections.length
            });
    }

    getPreOrder(): void {
        const sidx = 'id';
        const sort = 'desc';
        const limit = 10;
        const offset = 0;
        this
            .productService
            .getProductPreOrder(sidx, sort, limit, offset, this.token)
            .subscribe((product: any) => {
                this.preOrder = product['kitchenart']['results']
                this.countPreOrder = this.preOrder.length
            });
    }

    getBanner(): void {
        const publish = 'T';
        const sidx = 'position';
        const sort = 'asc';

        this
            .bannerService
            .getBanners(publish, sidx, sort)
            .subscribe((banners: any) => {
                this.banners = banners['kitchenart']['results'];
            });
    }

    getBannerPromotion(): void {
        this
            .bannerService
            .getBannerPromotion()
            .subscribe((banners: any) => {
                const data = banners['kitchenart']['results'];
                if (banners['kitchenart']['status']['code'] === 200) {
                    this.bannerImage = data['image_domain'] + '/' + data['image_path'] + '/' + data['image'];
                    this.bannerUrl = data['url'];
                    this.bannerPublish = data['publish'];
                    setTimeout(() => {
                        if(this.token !== '') {
                            this.popUpPromo = false
                        }
                        else{
                            this.popUpPromo = true
                        }
                    }, 2000);
                }
                else{
                    this.popUpPromo = false
                }
            });
    }

    getCategoryParent(): void {
        const publish = 'T';
        const sidx = 'parent';
        const sort = 'asc';
        let limit = 8;
        const tablet = this.deviceService.isTablet();
        if(tablet){
            limit = 12;
        }
        const start = 0;

        this
            .categoryService
            .getCategoryByParentHome(publish, sidx, sort, limit, start)
            .subscribe((category: any) => {
                this.categories = category['kitchenart']['results'];
            });
    }

    goLink(link: any): void {
        this
            .router
            .navigate([link]);
    }

    goProductDetail(id: any) {
        this
            .router
            .navigate(['package/', id]);
            // location.reload();
    }

    goProductDetailBase(id: any) {
        this
            .router
            .navigate(['base/', id]);
            // location.reload();
    }

    getProductBrand(id: any) {
        this
            .router
            .navigate(['brand/', id]);
    }

    getBannerUrl(url: any) {
        window.location.href = url;
    }

    getProductCategory(url: any) {
        this
            .router
            .navigate(['category/', url]);
    }

    goToLogin() {
        this
            .router
            .navigate([this.bannerUrl]);
    }

    closeBannerPromotion () {
        this.popUpPromo = false;
    }

    getMeta() {
        this
            .termService
            .getTagMeta()
            .subscribe((meta: any) => {
                this.metaTag = meta['kitchenart']['results'];

                this
                    .meta
                    .addTags([
                        {
                            name: 'description',
                            content: this.metaTag['meta_description']
                        }, {
                            name: 'author',
                            content: 'kitchenart.id'
                        }, {
                            name: 'keywords',
                            content: this.metaTag['meta_keyword']
                        }
                    ]);
            })
    }

}
