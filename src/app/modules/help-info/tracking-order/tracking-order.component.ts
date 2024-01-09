import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HistoryOrderService } from '../../../service/history-order/history-order.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-tracking-order',
  templateUrl: './tracking-order.component.html',
  styleUrls: ['./tracking-order.component.css']
})
export class TrackingOrderComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  terms: any;

  trackNumber = new FormControl()
  tracks: any;
  status: boolean = false;
  summary: any;
  delivered: any;
  manifests: any;
  description: any;
  courierName: any;
  waybillNumber: any;
  serviceCode: any;
  waybillDate: any;
  shipperName: any;
  receiverName: any;
  origin: any;
  destination: any;
  token: any;

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private historyOrderService: HistoryOrderService,
    private toastr: ToastrService
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
    this.titleService.setTitle('KitchenArt - Track Order');
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

  backHistory(){
    this.router.navigate(['account/history_order']);
  }

  trackShipping(){
    let courier = 'jne'
    let trackNumber = this.trackNumber.value
    if(trackNumber == null){
      this.showError()
    }
    else{
      this.historyOrderService.postTrackShipping(courier, trackNumber)
      .subscribe((track: any) => {
          this.tracks = track['kitchenart']['results'];
          this.status = this.tracks['status']
          if(this.status == true){
            this.summary = this.tracks['summary']
            this.courierName = this.summary['courier_name']
            this.waybillNumber = this.summary['waybill_number']
            this.serviceCode = this.summary['service_code']
            this.waybillDate = this.summary['waybill_date']
            this.shipperName = this.summary['shipper_name']
            this.receiverName = this.summary['receiverName']
            this.origin = this.summary['origin']
            this.destination = this.summary['destination']
            this.status = this.summary['status']

            this.delivered = this.tracks['delivered']
            this.manifests = this.tracks['manifests']
            this.description = null
          }
          else{
            this.description = this.tracks['description']
          }
      })
    }
  }

  showError() {
    this.toastr.error('Please input track number');
  }

}
