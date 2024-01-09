import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { TradeinService } from '../../../service/tradein/tradein.service';
import { CategoryService } from '../../../service/category/category.service';

import { LocalStorageService } from 'ngx-webstorage';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-trade-in-form',
  templateUrl: './trade-in-form.component.html',
  styleUrls: ['./trade-in-form.component.css']
})
export class TradeInFormComponent implements OnInit {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  url: any;
  tradeinForm: FormGroup;
  fileToUpload1: File  = null;
  tradein: string;
  categories: object = [];
  category: object = [];
  requset: object = [];

  navigationSubscription: any;
  customer_id: number;


  @ViewChild('fileInput1') fileInput1: ElementRef;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  banners: any;
  domainImage: any;
  bannerPath: any;
  bannerImage: any;
  termConditionEnglish: any;
  termConditionIndonesia: any;
  cekTrade: boolean = false
  lang: any;
  token: any;
  param: any;

  produkCondition: any = [
    {name: 'Demo'},
    {name: 'Excellent'},
    {name: 'Good'},
    {name: 'Not Working'},
    {name: 'Not Complete'}
  ]
  sizeImage: any;

  constructor(
    private localSt:LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private tradeinService: TradeinService,
    private categoryService: CategoryService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
  ) { 
    this.route.params.subscribe((params: any) => {
      this.param = params['url'];    
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
    this.createForm()
  }

  getMeta(keyword: any, description: any) {
    this.termService.getTagMeta()
    .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];
        if(keyword == '' || keyword == null){
          this.metaKeyword = this.metaTag['meta_keyword']
        }
        else{
          this.metaKeyword = keyword
        }

        if(description == '' || description == null){
          this.metaDescription = this.metaTag['meta_description']
        }
        else{
          this.metaDescription = description
        }

        this.meta.updateTag(
          {name: 'description', content: this.metaDescription}
        );

        this.meta.updateTag(
          {name: 'keywords', content: this.metaKeyword}
        );

        this.meta.updateTag({
          name: 'author', content: 'kitchenart.id'
        })
        
    })
  }

  getTradeinBanner() {
    this.tradeinService.getTradeInBanner()
    .subscribe(trade => {
        this.banners = trade['kitchenart']['results']
        this.domainImage = this.banners['image_domain']
        this.bannerPath = this.banners['banner_path']
        this.bannerImage = this.banners['banner_image']
        this.termConditionEnglish = this.banners['term_condition_english']
        this.termConditionIndonesia = this.banners['term_condition_indonesia']
        this.bannerImage = this.banners['banner_image']

        let keyword = this.banners['meta_keyword']
        let description = this.banners['meta_description']
        this.getMeta(keyword, description)

        this.titleService.setTitle('KitchenArt - Tradein');
    })
  }

  ngOnInit() {
    this.getCategoryParent();
    this.getCategory();
    this.getTradeinBanner();
  }

  initialiseInvites() { 
    this.lang = this.localSt.retrieve('lang');
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.getProductTradeRquest(this.param);
  }

  createForm() {
    this.tradeinForm = new FormGroup({
      brand: new FormControl('', Validators.required),
      // category: new FormControl('', Validators.required),
      product_file: new FormControl (null, Validators.required),
      produck_condition: new FormControl('', Validators.required),
      description: new FormControl ('', Validators.required)
    });
  }

  onFileChange(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.tradeinForm.get('product_file').setValue(file);
      this.fileToUpload1 = file;
      this.sizeImage = file['size'];
    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getCategoryParent(): void {
    const parent = '';
    const publish = 'T';
    const sidx = 'parent';
    const sort = 'desc';

    this.categoryService.getCategoryByParent(parent, publish, sidx, sort)
    .subscribe((category: any) => {
      this.categories = category['kitchenart']['results'];
    });
  }

  getCategory(): void {
    const publish = 'T';
    const sidx = 'position';
    const sort = 'asc';

    this.categoryService.getCategories(publish, sidx, sort)
    .subscribe((category: any) => {
      this.category = category['kitchenart']['results'];
    });
  }

  getProductTradeRquest(url: any) {
    this.tradeinService.getTradeInProductRequest(url, this.token)
    .subscribe(request => {
      this.requset = request['kitchenart']['results'];
    });
  }

  tradeInRequest(){
    this.cekTrade = true
    const formModel = this.tradeinForm.value;
    const token = this.token;
    const product_id = this.requset['id'];

    if (this.fileToUpload1 === null) {
      this.toastr.warning('Image Is Empty');
      this.cekTrade = false
    } 
    else if(this.fileToUpload1 !== null && this.sizeImage > 1000000) {
      this.toastr.warning('size image too large');
      this.cekTrade = false
    }  
    else {
      this.tradeinService.tradeInRequest(formModel, token, product_id)
      .subscribe((tradein: any) => {
        this.tradein = tradein['kitchenart']['results']['status'];
          if (this.tradein === 'error' ) {
            this.showError();
            this.cekTrade = false
          } else {
            setTimeout(()=>{
                this.tradeinService.tradeInUploadImage(this.fileToUpload1, this.token)
                .subscribe((images: any) => {
                  if (this.tradein === 'error' ) {
                    this.showError();
                    this.cekTrade = false
                  } else {
                    this.showSuccess();
                    setTimeout(()=>{
                      this.cekTrade = false
                      this.reset();
                      this.router.navigate(['/']);
                    },500);
                  }
                });
            },500);
          }     
      });
    }
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    this.toastr.success('Request Send');
  }

  showError() {
    this.toastr.error('Field Is Empty');
  }

}
