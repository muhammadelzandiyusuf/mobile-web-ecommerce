import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ProductDiscussService } from '../../../service/product-discuss/product-discuss.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-product-discussion',
  templateUrl: './product-discussion.component.html',
  styleUrls: ['./product-discussion.component.css']
})
export class ProductDiscussionComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  discussion: any;

  statusActive: number = 1
  commentPost: boolean = false
  commetDelete: boolean = false
  commetPrimaryDelete: boolean = false
  childDiscussId: any;
  countDiscuss: any;
  token: any;

  constructor(
    private productDiscussService: ProductDiscussService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
          this.getAllDiscussion(this.statusActive)
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
  

  getAllDiscussion(id:any) {
    this.statusActive = id
    let limit = 10;
    let start = 0
    this.productDiscussService.getAllDiscussion(this.token, limit, start)
    .subscribe(discuss => {
      this.discussion = discuss['kitchenart']['results'];
      this.countDiscuss = this.discussion.length
    })
  }

  getUnreadDiscussion(id:any) {
    this.statusActive = id
    let limit = 10;
    let start = 0
    this.productDiscussService.getUnreadDiscussion(this.token, limit, start)
    .subscribe(discuss => {
      this.discussion = discuss['kitchenart']['results'];
      this.countDiscuss = this.discussion.length
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
  }

  deletePrimaryDiscuss() {
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
          if(this.statusActive == 1){
            this.getAllDiscussion(this.statusActive)
          }
          else{
            this.getUnreadDiscussion(this.statusActive)
          }
        }, 1000)
      }
      else{
        this.commentPost = false
        this.showErrorDelete(message)
      }
    })
  }

  menuPrimaryDelete(id:number){
    this.childDiscussId = id
    this.commetPrimaryDelete = true
  }

  closeDelete(){
    this.commetPrimaryDelete = false
  }

  showSuccessDelete(message:string) {
    this.toastr.success(message);
  }

  showErrorDelete(message:string) {
    this.toastr.error(message);
  }

  getDetailDiscuss(url:string) {
    this.router.navigate(['account/product_discussion/', url]);
  }

}
