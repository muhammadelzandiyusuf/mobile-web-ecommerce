import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../service/account/account.service';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-commision',
  templateUrl: './commision.component.html',
  styleUrls: ['./commision.component.css']
})
export class CommisionComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;

  startDate = new FormControl();
  endDate = new FormControl();
  commisions: any;
  totalCommision: any;
  monthAgo: any;
  today: any;
  countCommision: any;
  now = Date.now();
  datNow: string;
  dateMonthAgo: string;
  dateAgo: number;
  startDateNow = new Date();
  endDateNow = new Date();
  searching: boolean = false
  commisionClaimable: any;
  token: any;
  message: any;

  constructor(
    private accountService: AccountService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.getCommisions()
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Commision');
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
    this.datNow = this.datePipe.transform(this.now, 'y-MM-dd' + '23:59:59');
    var currentDate = new Date();
    let month;
    if(currentDate.getMonth() > 9) {
      month = currentDate.getMonth()
    }
    else{
      month = '0' + currentDate.getMonth()
    }
    this.dateMonthAgo = (currentDate.getFullYear())+ '-'+ month + '-'+ currentDate.getDate();

    const lang = this.localSt.retrieve('lang');
    if(lang == 'id'){
      this.message = 'Komisi anda kurang dari Rp. 100.000';
    }
    else{
      this.message = 'Your commission are less than Rp. 100.000';
    }
    // this.startDate.setValue(this.dateMonthAgo)
    // this.endDate.setValue(this.datNow)
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

  getCommisions() {
    this.searching = false;
    this.accountService.getCommsions(this.token, this.startDate.value, this.endDate.value)
    .subscribe((commision:any) => {
      this.commisions = commision['kitchenart']['results']['commision']
      this.totalCommision = commision['kitchenart']['results']['total_comision']
      this.countCommision = this.commisions.length
      this.monthAgo = commision['kitchenart']['results']['month_ago']
      this.today = commision['kitchenart']['results']['today']
      this.commisionClaimable = commision['kitchenart']['results']['commision_claimable']
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

  detailWithdraw(){
    if(this.totalCommision >= 100000) {
      this.router.navigate(['commisions/withdraw']);
    }
    else{
      this.toastr.warning(this.message);
    }
  }

}
