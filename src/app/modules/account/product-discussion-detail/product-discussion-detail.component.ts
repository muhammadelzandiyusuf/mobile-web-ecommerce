import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ProductDiscussService } from '../../../service/product-discuss/product-discuss.service';
import { ProductService } from '../../../service/product/product.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-product-discussion-detail',
  templateUrl: './product-discussion-detail.component.html',
  styleUrls: ['./product-discussion-detail.component.css']
})
export class ProductDiscussionDetailComponent implements OnInit, OnDestroy {

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
  firstName: any;
  lastName: any;
  createdAt: any;
  discussText: any;
  productDiscussionsChild: any;
  countChild: any;
  createDate: any;

  message = new FormControl()
  discussionId: any;
  commentPost: boolean = false
  commetDelete: boolean = false
  commetPrimaryDelete: boolean = false
  childDiscussId: any;
  productUrl: any;
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
    this.route.params.subscribe((params:any) => { 
      this.paramId = params['id']
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

  getDetailDiscussions(discussId:any) {
    this.productDiscussService.getDetailDiscussion(this.token, discussId)
    .subscribe(discuss => {
      this.discussion = discuss['kitchenart']['results'];
      this.discussionId = this.discussion['id']
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
      this.firstName = this.discussion['first_name']
      this.lastName = this.discussion['last_name']
      this.createdAt = this.discussion['created_at']
      this.createDate = this.createdAt['date']
      this.discussText = this.discussion['discuss_text']
      this.productDiscussionsChild = this.discussion['product_discussions_child']
      this.countChild = this.productDiscussionsChild.length
      this.productUrl = this.discussion['product_url']
    })
  }

  getDetailProduct(url:string, type:number) {
    if(type == 1){
      this.router.navigate(['base/', url]);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
    else{
      this.router.navigate(['package/', url]);
    }
    // location.reload();
  }

  backToDiscuss(){
    this.router.navigate(['account/product_discussion']);
  }

  postComment() {
    this.commentPost = true
    if(this.message.value != null){
        this.productService.postProductDiscuss(this.discussionId, this.productId, this.token, this.message.value)
        .subscribe((discuss:any) => {
          let status = discuss['kitchenart']['results']['status']
          if(status == 'success'){
            this.showSuccess();
            setTimeout(() => {
              this.commentPost = false
              this.getDetailDiscussions(this.paramId)
              this.message = new FormControl('');
            }, 1000)
          }
          else{
            this.showError()
          }
        })
    }
    else{
      this.commentPost = false
      this.showError()
    }
  }

  deletePrimaryDiscuss() {
      this.closeDelete()
      this.commentPost = true
      this.productDiscussService.postDiscussDelete(this.discussionId, this.token)
      .subscribe((discuss:any) => {
        let status = discuss['kitchenart']['results']['status']
        let message = discuss['kitchenart']['results']['message']
        if(status == 'success'){
          this.showSuccessDelete(message)
          setTimeout(() => {
            this.commentPost = false
            this.router.navigate(['account/product_discussion']);
          }, 1000)
        }
        else{
          this.commentPost = false
          this.showErrorDelete(message)
        }
      })
  }

  deleteDiscuss() {
    this.closeDelete()
      this.commentPost = true
      this.productDiscussService.postDiscussDelete(this.childDiscussId, this.token)
      .subscribe((discuss:any) => {
        let status = discuss['kitchenart']['results']['status']
        let message = discuss['kitchenart']['results']['message']
        if(status == 'success'){
          this.showSuccessDelete(message)
          setTimeout(() => {
            this.commentPost = false
            this.getDetailDiscussions(this.paramId)
          }, 1000)
        }
        else{
          this.commentPost = false
          this.showErrorDelete(message)
        }
      })
  }

  menuPrimaryDelete(){
    this.commetPrimaryDelete = true
    this.commetDelete = false
  }

  menuDelete(id:any){
    this.childDiscussId = id
    this.commetDelete = true
    this.commetPrimaryDelete = false
  }

  closeDelete(){
    this.commetDelete = false
    this.commetPrimaryDelete = false
  }

  showSuccess() {
    this.toastr.success('Is comment send');
  }

  showError() {
    this.toastr.error('Is comment not send');
  }

  showSuccessDelete(message:string) {
    this.toastr.success(message);
  }

  showErrorDelete(message:string) {
    this.toastr.error(message);
  }

}
