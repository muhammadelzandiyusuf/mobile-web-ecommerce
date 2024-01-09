import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../service/account/account.service';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;

  startDate = new FormControl();
  endDate = new FormControl();
  balances: any;
  totalBalance: any;
  monthAgo: any;
  today: any;
  countBalance: any;
  now = Date.now();
  datNow: string;
  dateMonthAgo: string;
  dateAgo: number;
  startDateNow = new Date();
  endDateNow = new Date();
  searching: boolean = false
  token: any;

  constructor(
    private accountService: AccountService,
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
          this.getBalances()
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Balance');
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
    this.datNow = this.datePipe.transform(this.now, 'y-MM-dd');
    var currentDate = new Date();
    this.dateMonthAgo = (currentDate.getFullYear())+ '-'+ currentDate.getMonth() + '-'+ currentDate.getDate();

    this.startDate.setValue(this.dateMonthAgo)
    this.endDate.setValue(this.datNow)
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

  getBalances() {
    this.searching = false
    this.accountService.getBalances(this.token, this.startDate.value, this.endDate.value)
    .subscribe((balance:any) => {
      this.balances = balance['kitchenart']['results']['balance']
      this.totalBalance = balance['kitchenart']['results']['total_balance']
      this.countBalance = this.balances.length
      this.monthAgo = balance['kitchenart']['results']['month_ago']
      this.today = balance['kitchenart']['results']['today']
    })
  }

  getSerach(search: boolean) {
    if(search == false){
      this.searching = true
    }
    else{
      this.searching = false
    }
  }

}
