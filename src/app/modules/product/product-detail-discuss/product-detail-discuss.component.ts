import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { ProductDiscussService } from '../../../service/product-discuss/product-discuss.service';
import { ProductService } from '../../../service/product/product.service';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-product-detail-discuss',
  templateUrl: './product-detail-discuss.component.html',
  styleUrls: ['./product-detail-discuss.component.css']
})
export class ProductDetailDiscussComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  discussion: any;
  assetDomain: any;
  imagePath: any;
  productImage: any;
  productId: any;
  productType: any;
  brandName: any;
  productName: any;
  productCode: any;
  paramId: any;
  avatarPath: any;
  avatarImage: any;

  message = new FormControl()
  commentPost: boolean = false
  commetDelete: boolean = false
  commetPrimaryDelete: boolean = false
  childDiscussId: any;
  contents: any;
  productUrl: any;
  lang: any;
  token: any;

  constructor(
    private productDiscussService: ProductDiscussService,
    private productService: ProductService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { 
    this.route.params.subscribe((params: any) => { 
      this.paramId = params['url']
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.getDetailDiscussions(this.paramId) 
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Product Discuss');
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

  getDetailDiscussions(productId: any) {
    this.productDiscussService.getProductDetailDiscussion(this.token, productId)
    .subscribe((discuss: any) => {
      this.discussion = discuss['kitchenart']['results'];
      this.assetDomain = this.discussion['asset_domain']
      this.imagePath = this.discussion['image_path']
      this.productImage = this.discussion['product_image']
      this.productId = this.discussion['product_id']
      this.productType = this.discussion['product_type']
      this.brandName = this.discussion['brand_name']
      this.productName = this.discussion['product_name']
      this.productCode = this.discussion['product_code']
      this.avatarPath = this.discussion['avatar_path']
      this.avatarImage = this.discussion['avatar_image']
      this.contents = this.discussion['content']
      this.productUrl = this.discussion['product_url']
    })
  }

  backToDiscuss() {
    if(this.productType == 2){
      this.router.navigate(['package/', this.productUrl]);
    }
    else{
      this.router.navigate(['base/', this.productUrl]);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  }

  postComment() {
    let parent = "";
    if(this.contents.length > 0){
      parent = this.contents['0']['id'];
    }
    else{
      parent = "";
    }
    this.commentPost = true
    const formModel = this.message.value;
    const product_id = this.productId;
    const token = this.token;

    this.productService.postProductDiscuss(parent, product_id, token, formModel)
      .subscribe((discuss: any) => {
        let status = discuss['kitchenart']['results']['status'];
        if(status === 'success'){
            this.commentPost = false
            this.message = new FormControl('', Validators.required)
            this.getDetailDiscussions(this.paramId) 
        }
        else{
            this.showErrorDisscuss();
        }
      });
  }

  showErrorDisscuss() {
    if(this.lang == 'en'){
      this.toastr.error('Message not sent');
    }
    else{
      this.toastr.error('Pesan tidak terkirim');
    }
  }

  alertDiscussion() {
    if(this.lang == 'en'){
      this.toastr.warning('Please Login');
    }
    else{
      this.toastr.warning('Silahkan Login');
    }
  }

}
