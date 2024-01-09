import { Component, OnInit, trigger, transition, style, animate, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ProjectReferenceService } from '../../../../service/project-reference/project-reference.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../service/cart/cart.service';
import { WishlistService } from '../../../../service/wishlist/wishlist.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-project-reference-detail',
  templateUrl: './project-reference-detail.component.html',
  styleUrls: ['./project-reference-detail.component.css'],
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
export class ProjectReferenceDetailComponent implements OnInit {
  @ViewChild('logo') logo: ElementRef
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  projects: any;
  title: any;
  subtitle: any;
  contentIndonesia: any;
  contentEnglish: any;
  imageDomain: any;
  galleryImagePath: any;
  url: any;
  locations: any;
  images: any;

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
  lang: any;
  projectProducts: any;
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
  architects: any;
  contractors: any;
  developers: any;
  kitchen_partners: any;
  link: string;
  bannerPath: any;
  bannerImage: any;
  media: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectReferenceService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService,
    private toastr: ToastrService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getDetailProject(params['url']);     
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

  getDetailProject(url: any) {
    this.projectService.getProjectReferenceDetail(url)
    .subscribe((project: any) => {
      this.projects = project['kitchenart']['results'];
      this.title = this.projects['title'];
      this.subtitle = this.projects['subtitle'];
      this.contentIndonesia = this.projects['content_indonesia'];
      this.contentEnglish = this.projects['content_english'];
      this.imageDomain = this.projects['image_domain'];
      this.bannerPath = this.projects['image_path']
      this.bannerImage = this.projects['image']
      this.galleryImagePath = this.projects['gallery_image_path'];
      this.url = this.projects['url'];
      this.locations = this.projects['locations'];
      this.images = this.projects['images'];
      this.projectProducts = this.projects['project_products'];

      this.architects = this.projects['architects'];
      this.contractors = this.projects['contractors'];
      this.developers = this.projects['developers'];
      this.kitchen_partners = this.projects['kitchen_partners'];

      this.link = this.projects['web_domain'] + '/project_references/' + url
      this.media = this.imageDomain + '/' + this.bannerPath + '/' + this.bannerImage;
      
      let keyword = this.projects['meta_keyword']
      let description = this.projects['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.title);
    });
  }

  getProduct(url: any) {
    this.router.navigate(['base/', url]);
    setTimeout(() => {
      location.reload();
    }, 3000);
    // location.reload();
  }

  goArchitect(url: any){
    this.router.navigate(['interior_designers_architect_partners/', url])
  }

  goContractor(url: any){
    this.router.navigate(['contractors_builders/', url])
  }

  goKitchen(url: any){
    this.router.navigate(['partner_kitchens/', url])
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
      for (let object of this.projectProducts) {
        this.pinTag.push(
          {
            'project_reference_image_id': object.project_reference_image_id,
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
      for (let object of this.projectProducts) {
        this.pinTag.push(
          {
            'project_reference_image_id': object.project_reference_image_id,
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
