import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductService } from '../../../service/product/product.service';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-product-accessories',
  templateUrl: './product-accessories.component.html',
  styleUrls: ['./product-accessories.component.css']
})
export class ProductAccessoriesComponent implements OnInit {

    products: Array<any> = [];
    name: string;

    lang: any;
    navigationSubscription: any;
    statusCode: number = 0;
    url: any;
    count: number = 0

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private productService: ProductService,
        private titleService: Title,
        private localSt: LocalStorageService    ) {
        this.route.params.subscribe((params: any) => {
            this.url = params['url']    
        }) 
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
              this.initialiseInvites();
            }
        });
    }

    initialiseInvites() { 
        this.lang = this.localSt.retrieve('lang');
        setTimeout(() => {
            this.getProduct(this.url);
        }, 3000)
    }

    ngOnInit() {
        
    }

    getProduct(url: any): void {
        this.productService.getProducAccessories(url)
        .subscribe((product: any) => {
            const name = product['kitchenart']['product_name']
            const code = product['kitchenart']['product_code']

            this.products = product['kitchenart']['results']
            this.statusCode = product['kitchenart']['status']['code']

            this.count = this.products.length;
            this.name = name + ' ' + code;

            this.titleService.setTitle('KitchenArt - Product Accessories ' + this.name);
        });
    }

    goProductDetail(url: any) {
        this.router.navigate(['base/', url]);
        setTimeout(() => {
            location.reload();
          }, 3000);
    }

}
