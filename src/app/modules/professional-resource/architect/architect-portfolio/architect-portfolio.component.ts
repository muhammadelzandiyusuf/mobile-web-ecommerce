import { Component, OnInit, ElementRef, ViewChild, Input, trigger, transition, style, animate, Output, EventEmitter } from '@angular/core';
import { ArchitectService } from '../../../../service/architect/architect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CartService } from '../../../../service/cart/cart.service';
import { WishlistService } from '../../../../service/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-architect-portfolio',
  templateUrl: './architect-portfolio.component.html',
  styleUrls: ['./architect-portfolio.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.9, .9, .9)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})

export class ArchitectPortfolioComponent implements OnInit {
  @ViewChild('logo') logo: ElementRef
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  portfolios: any = []
  metaTag: any;
  metaKeyword: string;
  metaDescription: string;
  architectName: string
  title: string;
  contentEnglish: any;
  contentIndonesia: any;
  imageDomain: any;
  url: any;
  portfolioImages: any;
  portfolioProduct: any;
  thumbImage: any;
  thumbPath: any;

  config: any = {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      centeredSlides: true,
      autoplayDisableOnInteraction: false,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      spaceBetween: 30,

      mousewheelControl: true,
      keyboardControl: true,
      direction: 'horizontal',
      preloadImages: true,
      updateOnImagesReady: true
  };
  lang: any;
  leftPin: number;
  topPin: number;
  pinTag: any = [];
  product: any;

  id: any;
  statusWishlist: string;
  localCarts: any = [];
  idProductCart: any = null;
  carts: any = [];
  param: any;
  localWish: any = [];
  idProductWish: any = null;
  wishs: any = [];
  token: any;
  

  constructor(
    private arhitectService: ArchitectService,
    private route: ActivatedRoute,
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getPortfolioDetail(params['url']);     
    })
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.lang = this.localSt.retrieve('lang');
  }

  ngOnInit() {
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

  getPortfolioDetail(url: any) {
    this.arhitectService.getArchitectPortfolioDetail(url)
    .subscribe((portfolio: any) => {
      this.portfolios = portfolio['kitchenart']['results']
      this.architectName = this.portfolios['architect_name']
      this.title = this.portfolios['title']
      this.contentEnglish = this.portfolios['content_english']
      this.contentIndonesia = this.portfolios['content_indonesia']
      this.imageDomain = this.portfolios['image_domain']
      this.thumbPath = this.portfolios['thumb_path']
      this.thumbImage = this.portfolios['thumb_image']
      this.url = this.portfolios['url']
      this.portfolioImages = this.portfolios['portfolio_images']
      this.portfolioProduct = this.portfolios['portfolio_product']

      let keyword = this.portfolios['meta_keyword']
      let description = this.portfolios['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.title);
    })
  }

  getProduct(url: any) {
    this.router.navigate(['base/', url]);
    setTimeout(() => {
      location.reload();
    }, 3000);
    // location.reload();
  }

  showTag(){
    this.visible = true;
  }

  closeTag(){
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onLoad() {
    const originWidth = (this.logo.nativeElement as HTMLImageElement).naturalWidth;
    const originHeight = (this.logo.nativeElement as HTMLImageElement).naturalHeight;
    const width = (this.logo.nativeElement as HTMLImageElement).width;
    const heeight = (this.logo.nativeElement as HTMLImageElement).height;

    this.leftPin = (originWidth / width);
    this.topPin = (originHeight / heeight);

    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();

    if(isMobile){
      for (let object of this.portfolioProduct) {
        this.pinTag.push(
          {
            'architect_portfolio_image_id': object.architect_portfolio_image_id,
            'product_id': object.product_id,
            'brand_name': object.code,
            'name': object.name,
            'code': object.code,
            'price': object.price,
            'discount': object.discount,
            'discount_price': object.discount_price,
            'installment': object.installment,
            'image_domain': object.image_domain,
            'product_image_path': object.product_image_path,
            'product_image_name': object.product_image_name,
            'stock_status': object.stock_status,
            'url': object.url,
            'lat': (object.lat / this.leftPin) - 6,
            'long': (object.long / this.topPin) - 6,
            'stock_status_id': object.stock_status_id
          }
        )
      }
    }
    else if(isTablet){
      for (let object of this.portfolioProduct) {
        this.pinTag.push(
          {
            'architect_portfolio_image_id': object.architect_portfolio_image_id,
            'product_id': object.product_id,
            'brand_name': object.code,
            'name': object.name,
            'code': object.code,
            'price': object.price,
            'discount': object.discount,
            'discount_price': object.discount_price,
            'installment': object.installment,
            'image_domain': object.image_domain,
            'product_image_path': object.product_image_path,
            'product_image_name': object.product_image_name,
            'stock_status': object.stock_status,
            'url': object.url,
            'lat': (object.lat / this.leftPin) - 10,
            'long': (object.long / this.topPin) - 10,
            'stock_status_id': object.stock_status_id
          }
        )
      }
    }
  }

  getProductModal(i: any) {
    this.visible = true;
    this.product = this.pinTag[i]
  }

  addWishlist(product_id: any) {
      this.wishlistService.postAdd(product_id, this.token)
      .subscribe((wishlist: any) => {
        let status = wishlist['kitchenart']['results']['status']
        if(status == 'success') {
          this.showSuccessAddWishlist()
        }
        else{
          this.statusWishlist = wishlist['kitchenart']['results']['message']
          this.alertMessage()
        }
      })
  }

  addCart(product_id: any) {
    this.cartService.postAdd(product_id, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.showSuccessAddCart()
      }
      else{
        this.statusWishlist = cart['kitchenart']['results']['message']
        this.alertMessage()
      }
    })
  }

  addChartLocal(product_id: any, brand_name: any, discount_price: any, name_product: any, product_image_path: any, unit_image: any) {
    this.cartService.getValidationCart(product_id)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status'];
      this.statusWishlist = cart['kitchenart']['results']['message'];
      if(status == true){
        this.localCarts = this.localSt.retrieve('carts')
        if(this.localCarts != null) {
          for (let object of this.localCarts) {
            if(object.product_id == product_id){
              this.idProductCart = object.product_id 
            }
            else{
              this.carts.push(
                {
                  'product_id' : object.product_id,
                  'quantity' : object.quantity,
                  'brand' : object.brand_name,
                  'subtotal' : object.subtotal,
                  'price' : object.subtotal,
                  'name' : object.name,
                  'image_domain' : object.image_domain,
                  'product_image_path' : object.product_image_path,
                  'unit_image' : object.unit_image
                }
              )
            }
          }
        }
        if(this.idProductCart == null){
          this.carts.push(
            {
              'product_id' : product_id,
              'quantity' : 1,
              'brand' : brand_name,
              'subtotal' : discount_price,
              'price' : discount_price,
              'name' : name_product,
              'image_domain' : this.imageDomain,
              'product_image_path' : product_image_path,
              'unit_image' : unit_image
            }
          )
          this.localSt.store('carts', this.carts);
        }
        this.showSuccessAddCart()
        this.localCarts = this.localSt.retrieve('carts')
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
      else{
        this.alertCart()
      }
    })
  }

  addWishListLocal(product_id: any){
    this.localWish = this.localSt.retrieve('wishlist')
    if(this.localWish != null) {
      for (let object of this.localWish) {
        if(object.product_id == product_id){
          this.idProductWish = object.product_id 
        }
        else{
          this.wishs.push(
            {
              'product_id' : object.product_id
            }
          )
        }
      }
    }
    if(this.idProductWish == null){
      this.wishs.push(
        {
          'product_id' : product_id
        }
      )
      this.localSt.store('wishlist', this.wishs);
    }
    this.showSuccessAddWishlist()
    this.localWish = this.localSt.retrieve('wishlist')
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  showSuccessAddWishlist() {
    if(this.lang == 'en'){
      this.toastr.success('Successfully added to wishlist');
    }
    else{
      this.toastr.success('Tambah keinginan berhasil');
    }
  }

  alertMessage() {
    if(this.lang == 'en'){
      this.toastr.error('Products in the wish list');
    }
    else{
      this.toastr.error('Produk dalam daftar keinginan');
    }
  }

  showSuccessAddCart() {
    if(this.lang == 'en'){
      this.toastr.success('Success add to cart');
    }
    else{
      this.toastr.success('Berhasil menambahkan ke keranjang');
    }
  }

  alertCart() {
    this.toastr.error(this.statusWishlist);
  }

}
