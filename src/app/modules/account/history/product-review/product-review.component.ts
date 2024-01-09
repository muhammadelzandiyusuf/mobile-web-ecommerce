import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { HistoryOrderService } from '../../../../service/history-order/history-order.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.css']
})
export class ProductReviewComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  terms: any;

  code: any;
  orderProductId: any;
  reviews: any;
  transactionNo: any;
  transactionCode: any;
  finishedAt: any;
  productBrand: any;
  productName: any;
  productCode: any;
  productUrl: any;
  domainAsset: any;
  imagePath: any;
  productImage: any;

  reviewForm: FormGroup
  productId: any;
  cekProfile: boolean = false
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
    this.route.params.subscribe(params => {
      this.code = params['code'] 
      this.orderProductId = params['id']    
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
           this.getDetailReviewProduct()
        }
      }
    });
    this.createForm()
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Review Product');
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

  createForm() {
    this.reviewForm = new FormGroup({
      rating: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    });
  }

  getDetailReviewProduct() {
    this.historyOrderService.getReviewProductDetail(this.token, this.orderProductId, this.code)
    .subscribe((review:any) => {
      this.reviews = review['kitchenart']['results'];
      this.transactionNo = this.reviews['transaction_no']
      this.transactionCode = this.reviews['transaction_code']
      this.finishedAt = this.reviews['finished_at']
      this.productBrand = this.reviews['product_brand']
      this.productName = this.reviews['product_name']
      this.productCode = this.reviews['product_code']
      this.productUrl = this.reviews['product_url']
      this.domainAsset = this.reviews['domain_asset']
      this.imagePath = this.reviews['image_path']
      this.productImage = this.reviews['product_image']
      this.productId = this.reviews['product_id']
    })
  }

  backHistory() {
    this.location.back();
    // this.router.navigate(['account/history_order']);
  }

  sendReview(){
    this.cekProfile = true
    let data = this.reviewForm.value
    this.historyOrderService.postReviewProduct(data, this.orderProductId, this.productId, this.token)
    .subscribe((review:any) => {
        let status = review['kitchenart']['results']['status']
        if(status == 'success'){
          this.showSuccess();
          setTimeout(()=>{
            this.cekProfile = false
            this.router.navigate(['account/history_order']);
          },1000);
        }
        else{
          this.showError();
        }
    })
  }

  showSuccess() {
    if(this.lang == 'en'){
      this.toastr.success('Success, Thank You');
    }
    else{
      this.toastr.success('Berhasil, Terima Kasih');
    }
  }

  showError() {
    if(this.lang == 'en'){
      this.toastr.error('Please complete data');
    }else{
      this.toastr.error('Lengkapi data');
    }
  }

}
