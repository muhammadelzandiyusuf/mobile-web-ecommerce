import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TermService } from '../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AccountService } from '../../service/account/account.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import * as CryptoJS from 'crypto-js';
import { NotificationService } from '../../service/notification/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  notification: any = [];
  lang: any;
  token: any;
  activeMenu: any = 1;

  menus = [
    {id: 1, name_english: "Transaction", name_indonesia: "Transaksi"},
    {id: 2, name_english: "Tradein", name_indonesia: "Penukaran"}
  ]
  tradeins: any = [];

  constructor(
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private accountService: AccountService,
    private deviceService: DeviceDetectorService,
    private localSt: LocalStorageService,
    private notificationService: NotificationService
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Notification');
  }

  ngOnInit() {
  }

  activeMenuNotif(item: any) {
    this.activeMenu = item;
  }

  initialiseInvites() {
    this.lang = this.localSt.retrieve('lang');
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
      if(this.token != null){
        this.getNotification()
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

  getNotification() {
    this.accountService.getNotifications(this.token)
    .subscribe((notif: any) => {
        this.notification = notif['kitchenart']['results'];
        this.notificationService.getTradeinNotification(this.token)
        .subscribe((trade: any) => {
          let tradeins = trade['kitchenart']['results'];
          this.tradeins = tradeins;
        })
    })
  }

  backHome(){
    this.router.navigate(['/']);
  }

  detailNotif(statusId: any, code: any, orderProductId: any){
    if(statusId === 8) {
      this.router.navigate(['account/history_order/review/' + code + '/', orderProductId]);
    }
    else if(statusId === 6) {

    }
    else{
      this.router.navigate(['account/history_order/detail/', code]);
    }
  }

  detailNotifTrade(){
    this.router.navigate(['account/trade_in']);
  }

}
