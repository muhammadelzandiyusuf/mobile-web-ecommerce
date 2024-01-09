import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account/account.service';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-commision-detail',
  templateUrl: './commision-detail.component.html',
  styleUrls: ['./commision-detail.component.css']
})
export class CommisionDetailComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  startDate = new FormControl();
  endDate = new FormControl();
  totalCommision: any;
  amount = new FormControl();
  banks: any;
  checked: boolean = false
  information: string = "T";
  commision: boolean = false

  withdrawForm: FormGroup;
  number: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  lang: any;
  token: any;

  constructor(
    private accountService: AccountService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private toastr: ToastrService
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.getCommisions();
          this.getBanks();
        }
      }
    });
    this.getMeta()
    this.createForm();
    this.titleService.setTitle('KitchenArt - Commision');
  }

  createForm() {
    this.withdrawForm = new FormGroup({
      amount: new FormControl('', Validators.required),
      account_name: new FormControl('', Validators.required),
      account_number: new FormControl('', Validators.required),
      bank_id: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
      // password: new FormControl('', Validators.required)
    });
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
    this.lang = this.localSt.retrieve('lang');
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
    this.accountService.getCommsions(this.token, this.startDate.value, this.endDate.value)
    .subscribe((commision:any) => {
      this.totalCommision = commision['kitchenart']['results']['total_comision']
    })
  }

  getBanks() {
    this.accountService.getBanks()
    .subscribe((bank:any) => {
      this.banks = bank['kitchenart']['results'];
    })
  }

  usingInformation(){
    if(this.checked == true) {
      this.checked = false
    }
    else{
      this.checked = true
    }
  }

  claimCommission() {
    this.commision = true;
    const formModel = this.withdrawForm.value;
    const totalAmount = this.totalCommision;
    const amount = formModel['amount'];
    if(totalAmount >= 100000){
      if(amount >= 100000){
        if(amount <= totalAmount){
          this.accountService.postWithdrawCommission(formModel, this.token)
          .subscribe((withdraw: any) => {
            const status = withdraw['kitchenart']['status']['code'];
            if(status == 200){
              this.showSuccess();
              setTimeout(() => {
                this.commision = false;
                this.router.navigate(['account/commisions']);
              }, 1000)
            }
            else{
              this.showErrorPassword();
              this.commision = false;
            }
          })
        }
        else{
          this.showError();
          this.commision = false;
        }
      }
      else{
        this.showErrorAmountTotal();
        this.commision = false;
      }
    }
    else{
      this.showErrorAmountTotal();
      this.commision = false;
    }

  }

  showSuccess() {
    if(this.lang == 'en'){
      this.toastr.success('Successfully claimed commission');
    }
    else{
      this.toastr.success('Berhasil mengkalim komisi');
    }
  }

  showErrorPassword() {
    if(this.lang == 'en'){
      this.toastr.warning('Email does not match');
    }
    else{
      this.toastr.warning('Email tidak sesuai');
    }
  }

  showError() {
    if(this.lang == 'en'){
      this.toastr.warning('Sorry the excessive commission amount');
    }
    else{
      this.toastr.warning('Maaf jumlah komisi berlebihan');
    }
  }

  showErrorAmountTotal() {
    if(this.lang == 'en'){
      this.toastr.warning('Minimum commission Rp. 100.000');
    }
    else{
      this.toastr.warning('Minimal komisi Rp. 100.000');
    }
  }

}
