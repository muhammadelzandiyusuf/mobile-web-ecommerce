import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { ProductService } from '../../../service/product/product.service';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import * as CryptoJS from 'crypto-js';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-product-promo',
  templateUrl: './give-away.component.html',
  styleUrls: ['./give-away.component.css']
})

export class GiveAwayComponent implements OnInit {

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  products: Array<any> = [];
  url: string;
  metaTag: any;

  discount: boolean
  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  token: any;
  navigationSubscription: any;
  count: number = 0

  constructor(
    private router: Router,
    private productService: ProductService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
    });
    this.getMeta()
  }

  initialiseInvites() { 
    let token = this.localSt.retrieve('token');
    if(token){
        this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }

    this.getFreeItem();
    this.discount = true
    this.titleService.setTitle('KitchenArt - Package Free');
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

  ngOnInit() {
      
  }

  getFreeItem(): void {
    this.count = 0
    const publish = 'T';
    const sidx = '';
    const sort = '';
    const limit = 0;
    const offset = 0;

    this
        .productService
        .getProductGetFree(publish, sidx, sort, limit, offset)
        .subscribe((products: any) => {
            this.products = products['kitchenart']['results']
            this.count = this.products.length

        });
    }

    goProductDetail(url: any) {
        this.router.navigate(['package/', url]);
    }
}
