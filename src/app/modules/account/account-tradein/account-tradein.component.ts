import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TradeinService } from '../../../service/tradein/tradein.service';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-account-tradein',
  templateUrl: './account-tradein.component.html',
  styleUrls: ['./account-tradein.component.css']
})
export class AccountTradeinComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  statusActive: string = 'A';

  statusTradeins = [
    { name: 'Aproved', value: 'A' },
    { name: 'Pending', value: 'P' },
    { name: 'Reject', value: 'R' }
  ]
  trades: any;
  now = Date.now();
  datNow: string;
  countTrade: any;
  token: any;

  constructor(
    private tradeinService: TradeinService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private datePipe: DatePipe
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.getTradein(this.statusActive)
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Tradein');
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
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.datNow = this.datePipe.transform(this.now, 'y-MM-dd HH:mm:ss');
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

  backAccount(){
    this.router.navigate(['account']);
  }

  getTradein(status:any) {
    this.statusActive = status
    this.tradeinService.getTradeInProduct(status, this.token)
    .subscribe((trade:any) => {
        this.trades = trade['kitchenart']['results']
        this.countTrade = this.trades.length
    })
  }

  buyNow(transaction_no:string) {
    this.router.navigate(['account/trade_in/', transaction_no]);
  }

}
