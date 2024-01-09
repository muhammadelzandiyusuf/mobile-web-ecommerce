import { Component, OnInit, OnDestroy } from '@angular/core';
import { TechnicianReviewService } from '../../../../service/technician-review/technician-review.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-technician-review-form',
  templateUrl: './technician-review-form.component.html',
  styleUrls: ['./technician-review-form.component.css']
})
export class TechnicianReviewFormComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any
  metaTag: any;
  terms: any;

  reviewForm: FormGroup
  code: any;
  technician: any;
  assetDomain: any;
  photoPath: any;
  photoImage: any;
  serviceId: any;
  technicianId: any;
  registrationNo: any;
  finishedAt: any;
  staffId: any;
  fullName: any;
  cekProfile: boolean = false
  token: any;

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService,
    private route: ActivatedRoute,
    private technicianReviewService: TechnicianReviewService,
    private toastr: ToastrService
  ) { 
    this.route.params.subscribe(params => {
      this.code = params['id']    
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
        else{
           this.getDetailReviewTechnician()
        }
      }
    });
    this.createForm()
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Review Product');
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

  createForm() {
    this.reviewForm = new FormGroup({
      rating: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    });
  }

  getDetailReviewTechnician(){
    this.technicianReviewService.getTechnicianReviewDetail(this.token, this.code)
    .subscribe((technician: any) => {
      this.technician = technician['kitchenart']['results']
      this.assetDomain = this.technician['asset_domain']
      this.photoPath = this.technician['photo_path']
      this.photoImage = this.technician['photo_image']
      this.serviceId = this.technician['id']
      this.technicianId = this.technician['technician_id']
      this.registrationNo = this.technician['registration_no']
      this.finishedAt = this.technician['finished_at']
      this.staffId = this.technician['staff_id']
      this.fullName = this.technician['full_name']
    })
  }

  sendReview(){
    this.cekProfile = true
    let data = this.reviewForm.value
    this.technicianReviewService.postTechnicianReview(data, this.token, this.serviceId, this.technicianId)
    .subscribe((review: any) => {
        let status = review['kitchenart']['results']['status']
        if(status == 'success'){
          this.showSuccess();
          setTimeout(()=>{
            this.cekProfile = false
            this.router.navigate(['account/technician_review']);
          },1000);
        }
        else{
          this.showError();
        }
    })
  }

  back() {
    this.router.navigate(['account/technician_review']);
  }

  showSuccess() {
    this.toastr.success('Success, Thank You');
  }

  showError() {
    this.toastr.error('Please complete data');
  }

}
