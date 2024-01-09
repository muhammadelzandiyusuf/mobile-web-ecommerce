import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TechnicianReviewService } from '../../../../service/technician-review/technician-review.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-technician-review',
  templateUrl: './technician-review.component.html',
  styleUrls: ['./technician-review.component.css']
})
export class TechnicianReviewComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;

  reviews: any;
  countReview: any;
  statusActive: number = 1
  lang: any;
  token: any;

  constructor(
    private technicianReviewService: TechnicianReviewService,
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
          this.getOnProgressTechnician(this.statusActive)
        }
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Technician Review');
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

  getOnProgressTechnician(id: any) {
    this.statusActive = id
    let limit = 10;
    let start = 0

    this.technicianReviewService.getTechnicianReviewProgress(this.token, limit, start)
    .subscribe((technician: any) => {
      this.reviews = technician['kitchenart']['results']
      this.countReview = this.reviews.length
    })
  }

  getFinishTechnician(id: any) {
    this.statusActive = id
    let limit = 10;
    let start = 0

    this.technicianReviewService.getTechnicianReviewFinish(this.token, limit, start)
    .subscribe((technician: any) => {
      this.reviews = technician['kitchenart']['results']
      this.countReview = this.reviews.length
    })
  }

  detailTechnician(id: any) {
    this.router.navigate(['account/technician_review/review/', id]);
  }

}
