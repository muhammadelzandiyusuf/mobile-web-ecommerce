import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { HistoryOrderService } from '../../../../service/history-order/history-order.service';
import * as CryptoJS from 'crypto-js';
import { NotificationService } from '../../../../service/notification/notification.service';

@Component({
  selector: 'app-history-order-detail',
  templateUrl: './history-order-detail.component.html',
  styleUrls: ['./history-order-detail.component.css']
})
export class HistoryOrderDetailComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id:number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  terms: any;
  param: any;
  orders: any;
  transactionNo: any;
  shippingName: any;
  shippingProvinceName: any;
  shippingCityName: any;
  shippingSubdistrictName: any;
  shippingAddress: any;
  shippingZip: any;
  historyOrder: any;
  historyOrderDate: any;
  messageIndonesia: any;
  messageEnglish: any;
  paymentOrder: any;
  methodName: any;
  channelName: any;
  paymentAt: any;
  totalOrder: any;
  grandTotal: any;
  productOrder: any;
  productOrderHistory: any;
  shipmentOrder: any;
  finishedAt: any;
  shippingPhone: any;
  productReview: any;
  paymentCode: any;
  paymentTenor: any;
  paymentMessage: any;
  paymentSuccess: any;
  paymentMethodId: any;
  subtotal: any;
  shippingPrice: any;
  discountPromo: any;
  balanceUsed: any;
  countShipmentOrder: any;
  transactionCode: any;
  printInvoice: boolean = false
  lang: any;
  token: any;
  orderId: any;
  count: number = 0;
  orderStatusId: any;
  readNotif: any;
  trackShow: boolean = false;
  cnoteTrack: any;
  detailTrack: any = [];
  historyTrack: any = [];

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private route: ActivatedRoute,
    private historyOrderService: HistoryOrderService,
    private location: Location,
    private notificationService: NotificationService
  ) { 
    this.route.params.subscribe(params => {
      this.param = params['code']    
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.getDetailHistoryOrder()
          setTimeout(() => {
            if(this.orderStatusId === 7 && this.readNotif === 'F'){
              this.getCancelOrder();
            }
          }, 4000)
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - History Order');
  }

  getCancelOrder() {
    this.count = 1;
    this.notificationService.postUpdateReadNotif(this.orderId, this.token)
    .subscribe((notif: any) => {
          location.reload();
    })
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

  backToList() {
    // this.location.back();
    this.router.navigate(['account/history_order']);
    
  }
  
  getDetailHistoryOrder(){
    this.historyOrderService.getHistoryOrderDetail(this.param, this.token)
    .subscribe((order: any) => {
      this.orders = order['kitchenart']['results']
      this.orderId = this.orders['id']
      this.orderStatusId = this.orders['order_status_id'];
      this.readNotif = this.orders['read_notif'];

      this.transactionNo = this.orders['transaction_no']
      this.transactionCode = this.orders['transaction_code']
      this.shippingName = this.orders['shipping_name']
      this.shippingPhone = this.orders['shipping_phone']
      this.shippingProvinceName = this.orders['shipping_province_name']
      this.shippingCityName = this.orders['shipping_city_name']
      this.shippingSubdistrictName = this.orders['shipping_subdistrict_name']
      this.shippingAddress = this.orders['shipping_address']
      this.shippingZip = this.orders['shipping_zip']

      this.totalOrder = this.orders['total_order']
      this.grandTotal = this.totalOrder['grand_total']
      this.balanceUsed = this.totalOrder['balance_used']
      this.discountPromo = this.totalOrder['discount_promo']
      this.shippingPrice = this.totalOrder['shipping_price']
      this.subtotal = this.totalOrder['subtotal']

      this.historyOrder = this.orders['history_order']
      this.historyOrderDate = this.historyOrder['history_order_date']
      this.messageIndonesia = this.historyOrder['message_indonesia']
      this.messageEnglish = this.historyOrder['message_english']

      this.paymentOrder = this.orders['payment_order']
      this.methodName = this.paymentOrder['method_name']
      this.paymentCode = this.paymentOrder['code']
      this.paymentTenor = this.paymentOrder['tenor']
      this.paymentMessage = this.paymentOrder['message']
      this.paymentSuccess = this.paymentOrder['success']
      this.paymentMethodId = this.paymentOrder['payment_method_id']
      this.channelName = this.paymentOrder['channel_name']
      this.paymentAt = this.paymentOrder['payment_at']

      this.productOrder = this.orders['product_order']
      this.productOrderHistory = this.orders['product_order_history']
      this.shipmentOrder = this.orders['shipment_order']
      this.countShipmentOrder = this.shipmentOrder.length
      this.finishedAt = this.orders['finished_at']

      this.productReview = this.orders['product_review']
    })
  }

  getTrackShipping (cnote: any) {
      this.printInvoice = true;
      this.historyOrderService.getTrackShipping(this.token, cnote)
      .subscribe((note: any) => {
        const data = note['kitchenart']['results'];
        this.cnoteTrack = data['cnote']; 
        this.detailTrack = data['detail']; 
        this.historyTrack = data['history']; 
        this.printInvoice = false;
        this.trackShow = true;
      });
  }

  closeTrack () {
    this.trackShow = false;
  }

  printPDF() {
    this.printInvoice = true
    this.historyOrderService.postPrintInvoice(this.transactionCode)
    .subscribe((print: any) => {
      setTimeout(() => {
        this.printInvoice = false
      }, 1000)
    })
  }

  productDetail(url:string) {
    this.router.navigate(['base/', url]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  trackShipping(courier:string, number:number) {
    this.router.navigate(['account/track_shipping/' + courier + '/', number]);
  }

}
