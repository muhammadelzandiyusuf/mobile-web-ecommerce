import { Component, OnInit, trigger, transition, style, animate, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { HostService } from '../../../../service/host/host.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Lightbox } from 'ngx-lightbox';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WishlistService } from '../../../../service/wishlist/wishlist.service';
import { CartService } from '../../../../service/cart/cart.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-host-detail',
  templateUrl: './host-detail.component.html',
  styleUrls: ['./host-detail.component.css'],
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
export class HostDetailComponent implements OnInit {
  @ViewChild('logo') logo: ElementRef
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  contactProduct: boolean = false;
  contactForm: FormGroup;

  rchitect: any = [];
  name: string
  contentEnglish: string
  contentIndonesia: string
  imageDomain: string
  photoPath: string
  photoImage: string
  metaDescription: string
  metaKeyword: string
  url: string
  awards: any = [];
  galleryImages: any = []
  galleryProducts: any = []
  metaTag: any;
  exhibitions: any = []
  cookingClass: any = []

  config: any = {};

  configGallery: any = {
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

  configExhibition: any = {};

  status: any;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  hosts: any;
  album: any = [];
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
  recipePath: any;
  winePath: any;
  recipes: any;
  wineDines: any;

  constructor(
    private hostService: HostService,
    private route: ActivatedRoute,
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private toastr: ToastrService,
    private lightbox: Lightbox,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {
    this.createForm();
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    this.lang = this.localSt.retrieve('lang');
    this.route.params.subscribe((params: any) => {
      this.getHostDetail(params['url']);     
    })
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
      this.config = {
        slidesPerView: 4,
        spaceBetween: 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      };
    
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

  createForm() {
    this.contactForm = new FormGroup({
      full_name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required)
    });
  }

  popupContact() {
    this.contactProduct = true;
  }

  closePopupContact() {
    this.contactProduct = false;
  }

  showSuccess() {
    this.toastr.success('Message Send', 'Success');
    this.createForm();
    this.contactProduct = false;
  }

  showError() {
    this.toastr.error('Message Can Not Send', 'Oops!');
  }

  saveContact() {
    const formModel = this.contactForm.value;
    const host_id = this.hosts['id'];

    this.hostService.createHostContact(host_id, formModel)
      .subscribe((schedule: any) => {
        this.status = schedule['kitchenart']['results']['status'];
        if(this.status === 'success'){
            this.showSuccess();
        }
        else{
            this.showError();
        }
      });
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

  getHostDetail(url: any) {
    this.hostService.getHostDetail(url)
    .subscribe((detail: any) => {
      this.hosts = detail['kitchenart']['results']
      this.name = this.hosts['name']
      this.contentEnglish = this.hosts['content_english']
      this.contentIndonesia = this.hosts['content_indonesia']
      this.imageDomain = this.hosts['image_domain']
      this.photoPath = this.hosts['photo_path']
      this.photoImage = this.hosts['photo_image']
      this.url = this.hosts['url']
      this.awards = this.hosts['awards']
      this.galleryImages = this.hosts['gallery_images']
      this.galleryProducts = this.hosts['gallery_products']
      this.exhibitions = this.hosts['exhibitions']
      this.cookingClass = this.hosts['cooking_host']
      this.recipePath = this.hosts['recipe_path']
      this.winePath = this.hosts['wine_path']
      this.recipes = this.hosts['recipes']
      this.wineDines = this.hosts['wine_dines']

      let i = 1;
      if(this.awards.length > 0){
        for (let photo of this.awards) {
          const src = this.imageDomain + '/' + photo['image_path'] + '/' + photo['award_image'];
          const caption = 'Award ' + i;
          const thumb = this.imageDomain + '/' + photo['image_path'] + '/' + photo['award_image'];
          const album = {
             src: src,
             caption: caption,
             thumb: thumb
          };
    
          this.album.push(album);
          i++
        }  
      }

      let keyword = this.hosts['meta_keyword']
      let description = this.hosts['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.name);
    });
  }

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.album, index);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  getProduct(url: any) {
    this.router.navigate(['base/', url]);
    setTimeout(() => {
      location.reload();
    }, 3000);
    // location.reload();
  }

  getCookingClass(url: any) {
    this.router.navigate(['cooking_class_demos/', url]);
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
      for (let object of this.galleryProducts) {
        this.pinTag.push(
          {
            'host_image_id': object.host_image_id,
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
      for (let object of this.galleryProducts) {
        this.pinTag.push(
          {
            'host_image_id': object.host_image_id,
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
