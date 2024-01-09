import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, OnChanges, EventEmitter, 
  trigger, state, style, animate, transition, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { BrandGalleryService } from '../../../../service/brand-gallery/brand-gallery.service';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CartService } from '../../../../service/cart/cart.service';
import { WishlistService } from '../../../../service/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-brand-gallery-detail',
  templateUrl: './brand-gallery-detail.component.html',
  styleUrls: ['./brand-gallery-detail.component.css'],
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
export class BrandGalleryDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('pin') pin: ElementRef;
  @ViewChild('logo') logo: ElementRef
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  brandGallery: any = [];
  image_domain: string;
  banner_image: string;
  title: any;
  content_english: any;
  banner_path: any;
  brand_products: any = [];

  config: any = {};
  dataPin: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  tagCount: any;
  tagProduct: boolean = false
  lang: any;
  content_indonesia: any;

  width: number = 0;
  height: number = 0;
  leftPin: number;
  topPin: number;

  pinTag: any = [];
  product: any;
  pinEnable: boolean = false
  id: any;
  statusWishlist: string;
  localCarts: any = [];
  idProductCart: any = null;
  carts: any = [];
  param: any;
  localWish: any = [];
  idProductWish: any = null;
  wishs: any = [];
  nextGallery: any;
  prevGallery: any;
  thumbBrand: any;
  brandUrl: any;
  brandImage: any;
  brandPath: any;
  token: any;
  paramBrand: any;
  link: string;
  media: string;

  constructor(
    private brandGalleryService: BrandGalleryService,
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
      this.param = params['url'];
      this.paramBrand = params['brand'];
      this.getDetailGalleryBrand(params['url']);     
    })
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.lang = this.localSt.retrieve('lang');
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

  ngAfterViewInit() {
  
  }

  ngOnInit() {
    this.epicFunction();
  }

  epicFunction() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if(isMobile){
      this.config = {
        slidesPerView: 3,
        spaceBetween: 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      };
    }
    else if(isTablet){
      this.config = {
        slidesPerView: 3,
        spaceBetween: 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      };
    }
  }

  getDetailGalleryBrand(url: any) {
    this.brandGalleryService.getBrandGalleryDetail(url)
    .subscribe((gallery: any) => {
      this.brandGallery = gallery['kitchenart']['results'];
      this.image_domain = this.brandGallery['image_domain']
      this.banner_path = this.brandGallery['banner_path']
      this.banner_image = this.brandGallery['banner_image']
      this.title = this.brandGallery['title']
      this.content_english = this.brandGallery['content_english']
      this.content_indonesia = this.brandGallery['content_indonesia']
      this.dataPin = this.brandGallery['data_pin']
      this.tagCount = this.dataPin.length

      this.thumbBrand = this.brandGallery['thumb_brand']
      this.brandPath = this.thumbBrand['logo_path']
      this.brandImage = this.thumbBrand['logo_image']
      this.brandUrl = this.thumbBrand['url']
      this.nextGallery = this.brandGallery['next_brands']
      this.prevGallery = this.brandGallery['prev_brands']

      this.link = this.brandGallery['web_domain'] + '/brand_galleries/' + this.paramBrand + '/' + url
      this.media = this.image_domain + '/' + this.banner_path + '/' + this.banner_image;

      let keyword = this.brandGallery['meta_keyword']
      let description = this.brandGallery['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.title);
    });
  }

  goToProductDetail(url: any){
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
      for (let object of this.dataPin) {
        this.pinTag.push(
          {
            'id': object.id,
            'brand_name': object.brand_name,
            'name': object.name,
            'code': object.code,
            'price': object.price,
            'discount': object.discount,
            'weight': object.weight,
            'quantity': object.quantity,
            'new_collection': object.new_collection,
            'image_domain': object.image_domain,
            'product_image_path': object.product_image_path,
            'product_image_name': object.product_image_name,
            'video_url': object.video_url,
            'type_status_id': object.type_status_id,
            'availability_status_id': object.availability_status_id,
            'availability_status': object.availability_status,
            'stock_status_id': object.stock_status_id,
            'stock_status': object.stock_status,
            'date_start_periode': object.date_start_periode,
            'date_end_periode': object.date_end_periode,
            'url': object.url,
            'category_id': object.category_id,
            'discount_price': object.discount_price,
            'installment': object.installment,
            'lat': (object.lat / this.leftPin) - 6,
            'long': (object.long / this.topPin) - 6
          }
        )
      }
    }
    else if(isTablet){
      for (let object of this.dataPin) {
        this.pinTag.push(
          {
            'id': object.id,
            'brand_name': object.brand_name,
            'name': object.name,
            'code': object.code,
            'price': object.price,
            'discount': object.discount,
            'weight': object.weight,
            'quantity': object.quantity,
            'new_collection': object.new_collection,
            'image_domain': object.image_domain,
            'product_image_path': object.product_image_path,
            'product_image_name': object.product_image_name,
            'video_url': object.video_url,
            'type_status_id': object.type_status_id,
            'availability_status_id': object.availability_status_id,
            'availability_status': object.availability_status,
            'stock_status_id': object.stock_status_id,
            'stock_status': object.stock_status,
            'date_start_periode': object.date_start_periode,
            'date_end_periode': object.date_end_periode,
            'url': object.url,
            'category_id': object.category_id,
            'discount_price': object.discount_price,
            'installment': object.installment,
            'lat': (object.lat / this.leftPin) - 10,
            'long': (object.long / this.topPin) - 10
          }
        )
      }
    }
  }

  getProduct(i: any) {
    this.visible = true;
    this.pinEnable = true
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
              'image_domain' : this.image_domain,
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

  getBrand(url:any){
    this.router.navigate(['brand_galleries/', url]);
  }

  getBrandGalleryDetail(url: any){
    this.router.navigate(['brand_galleries/' + this.brandUrl + '/', url]);
  }
  
  shareButtonFB() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + this.link, '_blank');
  }

  shareButtonWA() {
    window.open('whatsapp://send?text=' + this.link, '_blank');
  }

  shareButtonTW() {
    window.open('https://twitter.com/share?url='+ this.link + '&text=' + this.title + '&via=kitchenart_id', '_blank');
  }

  shareButtonPinterest() {
    window.open('https://pinterest.com/pin/create/button/?url=' + this.link + '&media=' + this.media + '&description=' + this.title, '_blank');
  }

}
