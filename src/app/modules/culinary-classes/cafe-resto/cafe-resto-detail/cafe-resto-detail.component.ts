import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, OnChanges, EventEmitter, 
  trigger, state, style, animate, transition, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../../../service/restaurant/restaurant.service';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Lightbox } from 'ngx-lightbox';
import { CartService } from '../../../../service/cart/cart.service';
import { WishlistService } from '../../../../service/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-cafe-resto-detail',
  templateUrl: './cafe-resto-detail.component.html',
  styleUrls: ['./cafe-resto-detail.component.css'],
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
export class CafeRestoDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('pin') pin: ElementRef;
  @ViewChild('logo') logo: ElementRef
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  restaurants: any = [];
  videoUrl: any;
  lat: number;
  lng: number;

  dateTimeExample: any;

  contactProduct: boolean = false;
  pipe = new DatePipe('en-US');

  config: any = {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    centeredSlides: true,
    autoplayDisableOnInteraction: false,

    mousewheelControl: true,
    keyboardControl: true,
    direction: 'horizontal',
    preloadImages: true,
    updateOnImagesReady: true 
  };

  configExhibition: any = {};

  images: any;
  name: any;
  address: any;
  phone: any;
  status: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  cookingClass: any;
  imageDomain: any;
  wineDine: any;
  bannerPath: any;
  heightVideo: string;
  nextRestaurants: any = [];
  prevRestaurants: any = [];
  bannerImage: any;
  album: any = [];
  dataPin: any = [];
  tagCount: number = 0;

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
  lang: any;
  bannerTagPath: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private sanitizer: DomSanitizer,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService,
    private lightbox: Lightbox
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getDetailRestaurant(params['url']);     
    })
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.lang = this.localSt.retrieve('lang');
  }

  getMeta(keyword: string, description: string) {
    this.termService.getTagMeta()
    .subscribe(meta => {
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

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.album, index);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  ngOnInit() {
    this.epicFunction()
  }

  ngAfterViewInit() {
  
  }

  epicFunction() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if(isMobile){
      this.heightVideo = "250px"
      this.configExhibition = {
        slidesPerView: 2,
        spaceBetween: 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      };
    }
    else if(isTablet){
      this.heightVideo = "500px"
      this.configExhibition = {
        slidesPerView: 3,
        spaceBetween: 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      };
    }
  }

  getDetailRestaurant(url: any) {
    this.restaurantService.getDetails(url)
    .subscribe((restaurant: any) => {
      this.restaurants = restaurant['kitchenart']['results'];
      this.lat = this.restaurants['latitude'];
      this.lng = this.restaurants['longitude'];
      this.images = this.restaurants['images'];
      this.name = this.restaurants['name'];
      this.address = this.restaurants['address'];
      this.phone = this.restaurants['phone'];
      this.wineDine = this.restaurants['events']
      this.bannerPath = this.restaurants['banner_image_path']
      this.bannerTagPath = this.restaurants['banner_tag_image_path']
      this.imageDomain = this.restaurants['image_domain']
      this.bannerImage = this.restaurants['banner_image']
      this.dataPin = this.restaurants['data_pin']
      this.tagCount = this.dataPin.length

      if(this.restaurants['video_url']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.restaurants['video_url']);
      }

      let i = 1;
      for (let photo of this.images) {
        const src = this.imageDomain + '/' + this.bannerPath + '/' + photo['image'];
        const caption = this.name + ' ' + i;
        const thumb = this.imageDomain + '/' + this.bannerPath + '/' + photo['image'];
        const album = {
           src: src,
           caption: caption,
           thumb: thumb
        };
  
        this.album.push(album);
        i++
      }

      this.nextRestaurants = this.restaurants['next_restaurants'];
      this.prevRestaurants = this.restaurants['prev_restaurants'];

      let keyword = this.restaurants['meta_keyword']
      let description = this.restaurants['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.name);
    });
  }

  goWineDine(link: any): void {
    this.router.navigate(['wine_dine/', link]);
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
