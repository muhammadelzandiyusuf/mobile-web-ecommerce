import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { HistoryOrderService } from '../../../../service/history-order/history-order.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-track-shipping',
  templateUrl: './track-shipping.component.html',
  styleUrls: ['./track-shipping.component.css']
})
export class TrackShippingComponent implements OnInit, OnDestroy {

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
  statusShipping: any;
  courier: any;
  number: any;
  countManifests: any;
  lang: any;
  token: any;

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private route: ActivatedRoute,
    private historyOrderService: HistoryOrderService,
    private toastr: ToastrService,
    private location: Location,
  ) { 
    this.route.params.subscribe((params:any) => {
      this.courier = params['courier']   
      this.number = params['number']    
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.trackShipping()
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Track Order');
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

  backHistory(){
    this.location.back();
    // this.router.navigate(['account/history_order']);
  }

  trackShipping(){
      this.historyOrderService.postTrackShipping(this.courier, this.number)
      .subscribe((track:any) => {
          this.tracks = track['kitchenart']['results'];
          this.status = this.tracks['status']
          if(this.status == true){
            this.summary = this.tracks['summary']
            this.courierName = this.summary['courier_name']
            this.waybillNumber = this.summary['waybill_number']
            this.serviceCode = this.summary['service_code']
            this.waybillDate = this.summary['waybill_date']
            this.shipperName = this.summary['shipper_name']
            this.receiverName = this.summary['receiver_name']
            this.origin = this.summary['origin']
            this.destination = this.summary['destination']
            this.statusShipping = this.summary['status']

            this.delivered = this.tracks['delivered']
            this.manifests = this.tracks['manifests']
            this.countManifests = this.manifests.length
            this.description = null
          }
          else{
            this.description = this.tracks['description']
          }
      })
  }

  showError() {
    if(this.lang == 'en'){
      this.toastr.error('Please input track number');
    }
    else{
      this.toastr.error('Silakan masukkan nomor trek');
    }
  }

}
