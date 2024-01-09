import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { ProductService } from '../../../service/product/product.service';

@Component({
  selector: 'app-product-commercial',
  templateUrl: './product-commercial.component.html',
  styleUrls: ['./product-commercial.component.css']
})
export class ProductCommercialComponent implements OnInit {

    lang: any;
    navigationSubscription: any;

    domainImage: any;
    pathBanner: any;
    bannerImage: any;
    bannerName: any;
    url: any;
    pathBrand: any;
    brands: any = [];
    categories: any = [];
    pathCategory: any;
    metaTag: any;
    meta: any;
    nameCategory: any;
    notLoad: boolean = false;
    
    constructor(
        private router: Router,
        private titleService: Title,
        private termService: TermService,
        private productService: ProductService,
        private localSt: LocalStorageService    ) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
              this.initialiseInvites();
            }
        });
    }

    getCommercial() {
        this.productService.getProductCommercial()
        .subscribe((commercial: any) => {
            const data = commercial['kitchenart']['results'];
            this.domainImage = data['asset_domain'];
            this.pathBanner = data['banner_path'];
            this.bannerImage = data['image_banner'];
            this.bannerName = data['title_banner'];
            this.url = data['category_url'];
            this.pathBrand = data['brand_logo_path'];
            this.pathCategory = data['category_path'];
            this.brands = data['brands'];
            this.categories = data['categories'];
            this.nameCategory = data['category_name_english'];
            this.notLoad = true;
        });
    }

    initialiseInvites() { 
        this.lang = this.localSt.retrieve('lang');
        this.titleService.setTitle('KitchenArt - Commercial');
    }

    ngOnInit() {
        this.getCommercial();
    }

    goBrand(url: any) {
        this.router.navigate(['brand/', url]);
    }

    goCategory(url: any) {
        this.router.navigate(['category/', url]);
    }

}
