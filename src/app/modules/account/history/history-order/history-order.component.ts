import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { HistoryOrderService } from '../../../../service/history-order/history-order.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-history-order',
  templateUrl: './history-order.component.html',
  styleUrls: ['./history-order.component.css']
})
export class HistoryOrderComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id:number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  terms: any;
  segment: string;
  countVal: number;
  orderStatus: any;
  orderStatusId: any;
  historyOrder: any;
  countHistory: any;
  reviewProducts: any;
  countReview: any;
  lang: any;
  token: any;

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private route: ActivatedRoute,
    private historyOrderService: HistoryOrderService
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
    this.titleService.setTitle('KitchenArt - History Order');
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
    this.lang = this.localSt.retrieve('lang');
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.getOrderStatus()
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

  activedMenu(segment:any, statusId:any) {
    this.segment = segment
    this.getHistoryOrder(statusId)
  }

  activedMenureview(segment:any) {
    this.segment = segment
    this.getReviewProduct()
  }

  getReviewProduct() {
    this.countHistory = 0;
    this.historyOrderService.getReviewProducts(this.token)
    .subscribe((reviews:any) => {
        this.reviewProducts = reviews['kitchenart']['results']
        this.countReview = this.reviewProducts.length
    })
  }

  getOrderStatus() {
    this.historyOrderService.getStatusOrder(this.token)
    .subscribe((order:any) => {
      this.orderStatus = order['kitchenart']['results']
      this.segment = this.orderStatus[0]['name']
      this.orderStatusId = this.orderStatus[0]['id']

      this.getHistoryOrder(this.orderStatusId)
    })
  }

  getHistoryOrder(status_id:any) {
    this.countReview = 0
    const sidx = 'id';
    const sort = 'asc';
    const limit = 10;
    const offset = 0;

    this.historyOrderService.getHistoryOrder(this.token, status_id, sidx, sort, limit, offset)
    .subscribe((order:any) => {
      this.historyOrder = order['kitchenart']['results']
      this.countHistory = this.historyOrder.length
    })
  }

  backAccount() {
    this.router.navigate(['account']);
  }

  checkout() {
    this.router.navigate(['checkout']);
  }

  historyDetail(code:string) {
    this.router.navigate(['account/history_order/detail/', code]);
  }

  reviewDetail(code:string, id:number) {
    this.router.navigate(['account/history_order/review/' + code + '/', id]);
  }

}
