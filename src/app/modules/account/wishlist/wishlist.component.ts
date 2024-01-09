import { Component, OnInit, OnDestroy } from '@angular/core';
import { WishlistService } from '../../../service/wishlist/wishlist.service';
import { Subscription } from 'rxjs';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  products: any;
  countProduct: any;
  token: any;

  constructor(
    private wishlistService: WishlistService,
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
    this.titleService.setTitle('KitchenArt - Wishlist');
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
      if(this.token){
        this.getDataWishlist(this.token)
      }
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

  getDataWishlist(id: number){
    this.wishlistService.getWishlist(id)
    .subscribe((wishlist: any) => {
      this.products = wishlist['kitchenart']['results']
      this.countProduct = this.products.length
    })
  }

  goProductDetail(id: any, type: number) {
    if(type == 1) {
      this.router.navigate(['base/', id]);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
    else{
      this.router.navigate(['package/', id]);
    }
    // location.reload();
  }

  gotToWishlist(){
    this.router.navigate(['account/product/wishlist/']);
  }

  gotToLastView(){
    this.router.navigate(['account/product/last_view/']);
  }

}
