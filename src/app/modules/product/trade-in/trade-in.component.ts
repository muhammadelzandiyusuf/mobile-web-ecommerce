import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TradeIn } from '../../../service/tradein/tradein';
import { TradeinService } from '../../../service/tradein/tradein.service';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WarrantyService } from '../../../service/warranty/warranty.service';
import { BrandService } from '../../../service/brand/brand.service';
import { ToastrService } from 'ngx-toastr';
import { WarrantyProduct } from '../../../service/warranty/warranty-product';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-trade-in',
  templateUrl: './trade-in.component.html',
  styleUrls: ['./trade-in.component.css']
})
export class TradeInComponent implements OnInit {

  tradeinForm: FormGroup;
  isLoading = false;
  products: WarrantyProduct[] = [];
  productDisable: boolean = true;
  spinner: boolean = false
  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  token: string;
  showRequest: boolean = false;

  results: TradeIn[];
  metaTag: any;
  banners: any;
  domainImage: any;
  bannerPath: any;
  bannerImage: any;
  metaKeyword: any;
  metaDescription: any;
  bannerPathStep: any;
  bannerStep: any;
  lang: any = 'en';
  termEnglish: any;
  termIndonesia: any;
  brands: any;

  constructor(
    private router: Router,
    private tradeinService: TradeinService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService,
    private warrantyService : WarrantyService,
    private brandService: BrandService,
    private toastr: ToastrService
  ) { 
    this.createForm()
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
  }

  createForm() {
    this.tradeinForm = new FormGroup({
      brand_id: new FormControl ('', Validators.required),
      productInput: new FormControl('', Validators.required)
    })
  }

  getBrands(): void {
    let publish = 'T'
    this.brandService.getAllBrand(publish)
    .subscribe((brand: any) => {
      this.brands = brand['kitchenart']['results']
    })
  }

  getProductTradeinRequest(){
    let search = this.tradeinForm.value['productInput']
    let brand_id = this.tradeinForm.value['brand_id']
    this.tradeinService.getSearchAvailableProductRequest(search, brand_id)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results']
      this.productDisable = false
    })
  }

  displayFn(product: WarrantyProduct) {
    if (product) { return product.full_name; }
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    this.toastr.success('Request Product Success');
  }

  showError() {
    this.toastr.error('Complete data');
  }

  saveRequest() {
    this.spinner = true
    let product_id = this.tradeinForm.value['productInput']['id']

    this.tradeinService.tradeInRequestByCustomer(this.token, product_id)
    .subscribe((warranty: any) => {
        let statusRegis = warranty['kitchenart']['status']['code']
        if(statusRegis !== 200) {
          this.showError()
        }
        else{
          setTimeout(()=>{
              this.showSuccess()
              this.spinner = false
              this.reset();
              this.router.navigate(['/']);
          },1000);
        }
    })
  }

  showRequestProduct() {
    this.showRequest = true
  }

  closeRequestProduct() {
    this.showRequest = false
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

  ngOnInit() {
    this.lang = this.localSt.retrieve('lang');
    this.getProductTradein();
    this.getTradeinBanner();
    this.getBrands();

    this.tradeinForm
      .get('productInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap((value: any) => this.tradeinService.getSearchAvailableProductRequest(value, this.tradeinForm.value['brand_id'])
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe((product: any) => this.products = product['kitchenart']['results']);
  }

  getTradeinBanner() {
    this.tradeinService.getTradeInBanner()
    .subscribe((trade: any) => {
        this.banners = trade['kitchenart']['results']
        this.domainImage = this.banners['image_domain']
        this.bannerPath = this.banners['banner_path']
        this.bannerImage = this.banners['banner_image']
        this.bannerPathStep = this.banners['banner_path_step']
        this.bannerStep = this.banners['banner_step']
        this.termEnglish = this.banners['term_condition_english']
        this.termIndonesia = this.banners['term_condition_indonesia']

        let keyword = this.banners['meta_keyword']
        let description = this.banners['meta_description']
        this.getMeta(keyword, description)

        this.titleService.setTitle('KitchenArt - Tradein');
    })
  }

  getProductTradein(): void {
    this.tradeinService.getTradeInProducttList()
    .subscribe((product: any) => {
      this.results = product['kitchenart']['results'];
    });
  }  

  goProductDetail(id: any) {
    this.router.navigate(['base/', id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
    // location.reload();
  }

}
