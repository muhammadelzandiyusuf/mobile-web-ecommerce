import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../service/product/product.service';
import { ProductContact } from '../../../service/product/product-contact';
import { LocalStorageService } from 'ngx-webstorage';
import { TradeinService } from '../../../service/tradein/tradein.service';
import { TermService } from '../../../service/term/term.service';
import { CartService } from '../../../service/cart/cart.service';
import { WishlistService } from '../../../service/wishlist/wishlist.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';
import { CityService } from '../../../service/city/city.service';
import { ProvinceService } from '../../../service/province/province.service';
import { INVALID } from '@angular/forms/src/model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  statusTrade: any;
  count_rate_5: number;
  count_rate_4: number;
  count_rate_3: number;
  count_rate_2: number;
  count_rate_1: number;
  rate_5: number;
  rate_4: number;
  rate_3: number;
  rate_2: number;
  rate_1: number;
  starsCount: number;
  warrantyProduct: string;

  color:string = 'primary';
  mode: string = 'determinate';
  value: number = 50;
  bufferValue: number = 100;

  text:any = {
    Year: 'Y',
    Month: 'M',
    Weeks: "W",
    Days: ":",
    Hours: ":",
    Minutes: ":",
    Seconds: "",
    MilliSeconds: "MS"
  };

  id: number;
  navigationSubscription: any;
  status: string;
  contactProduct: boolean = false;
  issueProduct: boolean = false;

  configSlide: any = {
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

config: any = {};

configImage: any = {
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

  contactForm: FormGroup;
  issueForm: FormGroup;
  questionForm: FormGroup;
  questionChildForm: FormGroup;

  selectedIndex: any = null;
  selectedIndexAcc: any = null;
  pakage_item: any;
  package_acess: any;

  product_detail: any = [];
  videoUrl: any;
  specification: any;

  slide_active: number = 0;
  thumb_active: number = 0;

  today = Date.now();
  model = new ProductContact();

  tradein: object = [];
  selectComment: any = null;
  new_colletion: string;
  product_image: any;
  product_promo: string;
  brand_name: string;
  name: string;
  price: number;
  product_additiona_warranties: any;
  package_accessories: any;
  pakage_item_chose: any;
  highlight_english: any;
  image_domain: any;
  banner_image_path: any;
  cutsize_image_path: any;
  description_english: any;
  product_excellence: any;
  banner_image_name: any;
  cutsize_image_name: any;
  count_review: any;
  product_discussions_parent: any;
  other_color: any;
  product_accessories: any;
  related_product: any;
  more_from: any;
  metaTag: any;
  metaKeyword: string
  metaDescription: string
  wishlistStatus: boolean = false;
  param: any;
  product_id: any;
  statusWishlist: any;

  carts: any = [];
  cartLocal: any;
  discount_price: any;
  product_image_path: any;
  unit_image: any;
  localCarts: any;
  idProductCart: any = null;

  textMessage = new FormControl('', Validators.required);
  commentPost: boolean = false
  countPakageItem: any;
  countPackageAccessories: any;

  closeImages: boolean = false
  fileUrl: any;
  
  requestStock: boolean = false
  email = new FormControl('', [Validators.required, Validators.email])
  lang: any;
  highlight_indonesia: any;
  description_indonesia: any;
  heightVideo: string;
  code: any;
  project_references: any;
  proejct_reference_path: any;
  brand_galeries: any;
  galery_image_path: any;
  brand_url: any;
  detailQuickCompare: any;
  currentProduct: any;
  spesificationCurrentProduct: any;
  currentReview: any;
  similiarPrice: any;
  similiarSpesification: any;
  similiarReview: any;
  customerRating: any;
  customerRatingSpesification: any;
  customerRatingReview: any;
  currentRating: any;
  similiarRating: any;
  customerRatingStar: any;
  quickCompare: boolean = true;
  imagePath: any;
  imageDomain: any;
  currentPrice: any;
  currentDiscountPrice: any;
  similiarDiscountPrice: any;
  similiarProductPrice: any;
  ratingDiscountPrice: any;
  ratingPrice: any;
  currentImage: any;
  currentName: any;
  currentCode: any;
  currentBrand: any;
  currentUrl: any;
  similiarImage: any;
  similiarBrand: any;
  similiarName: any;
  similiarCode: any;
  similiarUrl: any;
  ratingImage: any;
  ratingBrand: any;
  ratingName: any;
  ratingCode: any;
  ratingUrl: any;
  token: any = null;
  similiar: any = [];
  customerReview: any = [];
  product_series: any = [];
  product_variants: any = [];
  series: any = [];
  products_similars: any = [];
  date_dealzone_end: any;
  notLoad: boolean = false
  statusTradein: any = false;
  date_start_periode: any;
  date_end_periode: any;
  discount_product: any;
  restaurant_path: any;
  restaurants: any;
  recipe_path: any;
  recipes: any;
  quantity: any;
  freeCities: any = [];
  pathShipping: any;
  imgFreeShipping: any;
  imgShipping: any;
  showFreeShipping: boolean = false;

  showCostShipping: boolean = false;
  cityName: any = 'Serang';
  headerCourier: any = 'Reguler';
  courier: any = 'JNE';
  priceCourier: any = 168000;
  weight: any = 0;

  showMaster: boolean = true;
  showProvince: boolean = false;
  showCity: boolean = false;
  showSubdistrict: boolean = false;
  provinces: any = [];
  prov_id: any;
  prov_name: any;
  cities: any = [];
  loading: boolean = false;
  city_id: any = 402;
  subdistricts: any = [];
  subdist_id: any = 5540;
  subdist_name: any;
  freeShipping: any;
  services: any = [];
  expected_availability: any;
  subdistName: any = 'Serang';
  provinceName: any = 'Banten';

  showCostShippingAddress: boolean = false;
  showMasterPostal: boolean = true;
  showDestination: boolean = false;
  postalCode = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]);
  shippingAddress: any = [];
  tariffCode: any;

  constructor(
    private localSt:LocalStorageService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private productService: ProductService,
    private tradeinService: TradeinService,
    private toastr: ToastrService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private deviceService: DeviceDetectorService,
    private cityService: CityService,
    private provinceService: ProvinceService
  ) {
      this.route.params.subscribe((params: any) => {
        this.param = params['id']    
      })
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });
      this.pakage_item = [{label:'Base', selected:true}]
      this.package_acess = [{label:'Without Accessories', selected:true}];
      this.createForm();
      this.createIssueForm();
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
    this.epicFunction();
    this.getFreeCity();
    this.getProvince();
  }

  getFreeCity () {
    this.cityService.getFreeCities()
    .subscribe((cities: any) => {
      const data = cities['kitchenart']['results'];
      this.freeCities = data['cities'];
      this.pathShipping = data['images']['path'];
      this.imgFreeShipping = data['images']['free_shipping'];
      this.imgShipping = data['images']['shipping'];
    })
  }

  getProvince(): void {
    this.provinceService.getProvinces()
    .subscribe((provinces: any) => {
      this.provinces = provinces['kitchenart']['results'];
    });
  }

  closeFreeshipping() {
    this.showFreeShipping = false;
  }

  openFreeshipping() {
    this.showFreeShipping = true;
  }

  closehipping() {
    // this.showMasterPostal = false;
    this.showCostShippingAddress = false;
  }

  openhipping() {
    this.showCostShipping = true;
  }

  openMasterLayout() {
    // this.showProvince = false;
    // this.showMaster = true;
    this.showDestination = false;
    this.showMasterPostal = true;
  }

  openProvince() {
    if(this.subdistricts.length > 0) {
      this.showMaster = false;
      this.showSubdistrict = true;
    }
    else{
      this.showMaster = false;
      this.showProvince = true;
    }
  }

  selectProv(id: any, name: any) {
    this.loading = true;
    this.prov_id = id;
    this.provinceName = name;
    this.cityService.getCities(id)
    .subscribe((cities: any) => {
      this.cities = cities['kitchenart']['results'];
      this.loading = false;
      this.showProvince = false;
      this.showCity = true;
    });
  }

  selectCity(id: any, name: any) {
    this.loading = true;
    this.city_id = id;
    this.cityName = name;
    this.cityService.getSubdistricts(id)
    .subscribe((subdistrict: any) => {
      this.subdistricts = subdistrict['kitchenart']['results'];
      this.loading = false;
      this.showCity = false;
      this.showSubdistrict = true;
    });
  }

  selectSubdist(id: any, name: any) {
    this.loading = true;
    this.subdist_id = id;
    this.subdistName = name;
    this.cityService.getCourierCostByProductJNE(this.provinceName, this.cityName, this.subdistName, this.product_detail['id'], this.postalCode)
    .subscribe((courier: any) => {
      const data = courier['kitchenart']['results'];
      this.weight = data['weight'];
      this.courier = data['courier'];
      this.freeShipping = data['free_shipping'];
      this.services = data['services'];
      if(this.services.length > 0) {
        this.priceCourier = this.services[0]['price']
      }
      this.localSt.store('city_destiny', this.city_id);
      this.localSt.store('city_name', this.cityName);
      this.localSt.store('subdist_destiny', this.subdist_id);
      this.localSt.store('subdist_name', this.subdistName);
      this.localSt.store('province_name', this.provinceName);
      this.loading = false;
      this.showSubdistrict = false;
      this.showMaster = true;
    })
  }

  // getCourierCostProduct(city_id: any, subdist_id: any, product_id: any) {
  //   this.cityService.getCourierCostByProduct(city_id, subdist_id, product_id)
  //   .subscribe((courier: any) => {
  //     const data = courier['kitchenart']['results'];
  //     this.weight = data['weight'];
  //     this.courier = data['courier'];
  //     this.freeShipping = data['free_shipping'];
  //     this.services = data['services'];
  //     if(this.services.length > 0) {
  //       this.priceCourier = this.services[0]['cost']
  //     }
  //     this.notLoad = true;
  //   })
  // }

  getCourierCostProductJNE(province_name: any, city_name: any, subdist_name: any, product_id: any, postal_code: any) {
    this.cityService.getCourierCostByProductJNE(province_name, city_name, subdist_name, product_id, postal_code)
    .subscribe((courier: any) => {
      const data = courier['kitchenart']['results'];
      this.weight = data['weight'];
      this.courier = data['courier'];
      this.freeShipping = data['free_shipping'];
      this.services = data['services'];
      if(this.services.length > 0) {
        this.priceCourier = this.services[0]['price']
      }
      this.notLoad = true;
      this.loading = false;
    })
  }

  checkPostalCode() {
    if (this.postalCode.status == 'INVALID') {
      if(this.lang == 'en'){
        this.toastr.warning('Check Your Postal Code');
      }
      else{
        this.toastr.warning('Periksa Kode Pos');
      }
    }
    else{
      this.loading = true;
      this.cityService.getShippingAddressByPostalCode(this.postalCode.value, null)
      .subscribe((address: any) => {
        this.loading = false;
        const data = address['kitchenart']['results']
        if (data.length > 0) {
          this.showMasterPostal = false;
          this.shippingAddress = data;
          this.showDestination = true;
        }
        else{
          if(this.lang == 'en'){
            this.toastr.warning('Postal Code Not Found');
          }
          else{
            this.toastr.warning('Kode Pos Tidak Ditemukan');
          }
        }
      });
    }
  }

  openShippingAddress() {
    this.showCostShippingAddress = true;
  }

  closeShippingAddress() {
    this.showCostShippingAddress = false;
  }

  choseAddress(address: any) {
      this.provinceName = address['province_name'];
      this.tariffCode = address['tariff_code'];
      this.loading = true;
      this.showDestination = false;
      this.showMasterPostal = true;
      this.cityService.getTariffByPostalCode(this.tariffCode, this.product_detail['id'])
      .subscribe((cost: any) => {
        const data = cost['kitchenart']['results'];
        this.weight = data['weight'];
        this.courier = data['courier'];
        this.freeShipping = data['free_shipping'];
        this.services = data['services'];
        this.loading = false;
      });
  }

  backProvince() {
    this.showCity = false;
    this.showProvince = true;
  }

  backCity() {
    this.showSubdistrict = false;
    this.showCity = true;
  }

  epicFunction() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if(isMobile){
      this.heightVideo = "250px";
      this.config = {
        slidesPerView: 2,
        spaceBetween: 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      };
    }
    else if(isTablet){
      this.heightVideo = "500px";
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

  addDiscuss(id: any) {
    this.selectComment = id;
  }

  initialiseInvites() {
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
    let city = this.localSt.retrieve('city_destiny');
    if(city) {
      this.city_id = city;
    }
    let city_name = this.localSt.retrieve('city_name');
    if(city_name) {
      this.cityName = city_name;
    }
    let subdist = this.localSt.retrieve('subdist_destiny');
    if(subdist) {
      this.subdist_id = subdist;
    }
    let subdist_name = this.localSt.retrieve('subdist_name');
    if(subdist_name) {
      this.subdistName = subdist_name;
    }
    let province_name = this.localSt.retrieve('province_name');
    if(province_name) {
      this.provinceName = province_name;
    }
    this.lang = this.localSt.retrieve('lang');   
    this.cartLocal = this.localSt.retrieve('carts');  
    this.getDetailProduct(this.param, this.token); 
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  createForm() {
    this.contactForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required)
    });

    this.questionChildForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
  }

  createIssueForm() {
    this.issueForm = new FormGroup({
      comment: new FormControl('', Validators.required)
    });
  }

  slideImage(i: any) {
    this.slide_active = i;
    this.thumb_active = i;
  }

  toggleValueItem(value: any, id: any){
    if(this.selectedIndex === 'null'){
      this.selectedIndex = value;
    }
    else if(this.selectedIndex === value){
      this.selectedIndex = null;
    }
    else {
      this.selectedIndex = value;
    }

    this.router.navigate(['package/', id]);

  }

  toggleValueAccess(value: any, id: any){
    if(this.selectedIndexAcc === 'null'){
      this.selectedIndexAcc = value;
    }
    else if(this.selectedIndexAcc === value){
      this.selectedIndexAcc = null;
    }
    else {
      this.selectedIndexAcc = value;
    }

    this.router.navigate(['package/', id]);
  }

  getDetailProduct(id: any, token: any): void {
    this.notLoad = false
    this.productService.getProducDetail(id, token)
    .subscribe((product: any) => {
      this.product_detail = product['kitchenart']['results'];
      this.date_start_periode = this.product_detail['date_start_periode'];
      this.date_end_periode = this.product_detail['date_end_periode'];
      this.new_colletion = this.product_detail['new_collection'];
      this.starsCount = this.product_detail['avg_rating'];
      this.specification = this.product_detail['specification'];
      this.product_image = this.product_detail['product_image'];
      this.unit_image = this.product_detail['product_image'][0]['product_image'];
      this.product_image_path = this.product_detail['product_image_path'];
      this.product_promo = this.product_detail['product_promo'];
      this.brand_name = this.product_detail['brand_name'];
      this.brand_url = this.product_detail['brand_url'];
      this.name = this.product_detail['name'];
      this.code = this.product_detail['code'];
      this.product_id = this.product_detail['id'];
      this.price = this.product_detail['price'];
      this.discount_product = this.product_detail['discount'];
      this.discount_price = this.product_detail['discount_price'];
      this.product_additiona_warranties = this.product_detail['product_additiona_warranties'];
      this.pakage_item_chose = this.product_detail['package_item'];
      this.countPakageItem = this.pakage_item_chose.length
      this.package_accessories = this.product_detail['package_accessories'];
      this.countPackageAccessories = this.package_accessories.length
      this.highlight_english = this.product_detail['highlight_english'];
      this.highlight_indonesia = this.product_detail['highlight_indonesia'];
      this.image_domain = this.product_detail['image_domain'];
      this.galery_image_path = this.product_detail['galery_image_path'];
      this.banner_image_path = this.product_detail['banner_image_path'];
      this.banner_image_name = this.product_detail['banner_image_name'];
      this.cutsize_image_path = this.product_detail['cutsize_image_path'];
      this.cutsize_image_name = this.product_detail['cutsize_image_name'];
      this.proejct_reference_path = this.product_detail['proejct_reference_path'];
      this.restaurant_path = this.product_detail['restaurant_path'];
      this.recipe_path = this.product_detail['recipe_path'];
      this.description_english = this.product_detail['description_english'];
      this.description_indonesia = this.product_detail['description_indonesia'];
      this.project_references = this.product_detail['project_references'];
      this.restaurants = this.product_detail['restaurants'];
      this.recipes = this.product_detail['recipes'];
      this.product_excellence = this.product_detail['product_excellence'];
      this.count_review = this.product_detail['count_review'];
      this.product_discussions_parent = this.product_detail['product_discussions_parent'];
      this.other_color = this.product_detail['other_color'];
      this.product_accessories = this.product_detail['product_accessories'];
      this.related_product = this.product_detail['related_product'];
      this.more_from = this.product_detail['more_from'];
      this.brand_galeries = this.product_detail['brand_galeries'];
      this.series = this.product_detail['series'];
      this.product_series = this.product_detail['product_series'];
      this.product_variants = this.product_detail['product_variants'];
      this.products_similars = this.product_detail['products_similars'];
      this.date_dealzone_end = this.product_detail['date_deal_zone'];
      this.quantity = this.product_detail['quantity'];
      this.expected_availability = this.product_detail['expected_availability'];

      this.rate_1 = this.product_detail['progress_rating']['1'];
      this.rate_2 = this.product_detail['progress_rating']['2'];
      this.rate_3 = this.product_detail['progress_rating']['3'];
      this.rate_4 = this.product_detail['progress_rating']['4'];
      this.rate_5 = this.product_detail['progress_rating']['5'];

      this.count_rate_1 = this.product_detail['count_start_review']['1'];
      this.count_rate_2 = this.product_detail['count_start_review']['2'];
      this.count_rate_3 = this.product_detail['count_start_review']['3'];
      this.count_rate_4 = this.product_detail['count_start_review']['4'];
      this.count_rate_5 = this.product_detail['count_start_review']['5'];

      this.wishlistStatus = this.product_detail['wishlist'];

      let keyword = this.product_detail['meta_keyword']
      let description = this.product_detail['meta_description']

      if(this.product_detail['video_url']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.product_detail['video_url']);
      }

      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.name);

      const id = this.product_detail['id'];
      const token = this.token;
      var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          this.tradeinService.getTradeInProductAvailable(id, token)
          .subscribe((tradein: any) => {
            this.statusTrade = tradein['kitchenart']['status']['code'];
            if(this.statusTrade != 404){
              this.tradein = tradein['kitchenart']['results'];
              this.statusTradein = this.tradein['status'];
            }

            if(this.token != null || this.token != "null" || this.token != ""){
                this.wishlistService.postAddLastView(id, this.token)
                .subscribe((lastview: any) => {
                    // const statusLast = lastview['kitchenart']['results']['status'];
                })
            }

            this.productService.getProductQuickCompares(id, this.token)
            .subscribe((quickcompare: any) => {
                this.detailQuickCompare = quickcompare['kitchenart']['results'];
                this.currentProduct = this.detailQuickCompare['current_product'];
                this.spesificationCurrentProduct = this.currentProduct['spesification']
                this.currentRating = this.currentProduct['rating']
                this.currentReview = this.currentProduct['total_rating'].length
                this.currentPrice = this.currentProduct['price']
                this.currentDiscountPrice = this.currentProduct['discount_price']
                this.currentImage = this.currentProduct['image']
                this.currentBrand = this.currentProduct['brand_name']
                this.currentName = this.currentProduct['name']
                this.currentCode = this.currentProduct['code']
                this.currentUrl = this.currentProduct['url']
                
                this.similiar = this.detailQuickCompare['products_similiar_price']
                if(this.similiar.length > 0){
                  this.similiarPrice = this.detailQuickCompare['products_similiar_price'][0];
                  this.similiarSpesification = this.similiarPrice['spesification']
                  this.similiarRating = this.similiarPrice['rating']
                  this.similiarReview = this.similiarPrice['total_rating'].length
                  this.similiarProductPrice = this.similiarPrice['price']
                  this.similiarDiscountPrice = this.similiarPrice['discount_price']
                  this.similiarImage = this.similiarPrice['image']
                  this.similiarBrand = this.similiarPrice['brand_name']
                  this.similiarName = this.similiarPrice['name']
                  this.similiarCode = this.similiarPrice['code']
                  this.similiarUrl = this.similiarPrice['url']
                }

                this.customerReview = this.detailQuickCompare['products_customer_rating']
                if(this.customerReview.length > 0){
                  this.customerRating = this.detailQuickCompare['products_customer_rating'][0];
                  this.customerRatingSpesification = this.customerRating['spesification']
                  this.customerRatingStar = this.customerRating['rating']
                  this.customerRatingReview = this.customerRating['total_rating'].length
                  this.ratingPrice = this.customerRating['price']
                  this.ratingDiscountPrice = this.customerRating['discount_price']
                  this.ratingImage = this.customerRating['image']
                  this.ratingBrand = this.customerRating['brand_name']
                  this.ratingName = this.customerRating['name']
                  this.ratingCode = this.customerRating['code']
                  this.ratingUrl = this.customerRating['url']
                }

                this.imageDomain = this.detailQuickCompare['asset_domain']
                this.imagePath = this.detailQuickCompare['image_path']

                // this.getCourierCostProductJNE(this.provinceName, this.cityName, this.subdistName, this.product_detail['id'], this.postalCode);
                this.notLoad = true;
            })
          });
          resolve();
        }, 3000);
      });

    });
  }

  addWishlist() {
      this.wishlistService.postAdd(this.product_id, this.token)
      .subscribe((wishlist: any) => {
        let status = wishlist['kitchenart']['results']['status']
        if(status == 'success') {
          this.showSuccessAddWishlist()
          this.getDetailProduct(this.param, this.token)
        }
        else{
          this.statusWishlist = wishlist['kitchenart']['results']['message']
          this.alertWislist()
        }
      })
  }

  addCart() {
    this.cartService.postAdd(this.product_id, this.token)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status']
      if(status == 'success') {
        this.showSuccessAddCart()
        setTimeout(() => {
          // this.getDetailProduct(this.param, this.token)
          location.reload();
        }, 4000);
      }
      else{
        this.statusWishlist = cart['kitchenart']['results']['message']
        this.alertCart()
      }
    })
  }

  addChartLocal() {
    this.cartService.getValidationCart(this.product_id)
    .subscribe((cart: any) => {
      let status = cart['kitchenart']['results']['status'];
      this.statusWishlist = cart['kitchenart']['results']['message'];
      if(status == true){
        this.localCarts = this.localSt.retrieve('carts')
        if(this.localCarts != null) {
          for (let object of this.localCarts) {
            if(object.product_id == this.product_id){
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
              'product_id' : this.product_id,
              'quantity' : 1,
              'brand' : this.brand_name,
              'subtotal' : this.discount_price,
              'price' : this.discount_price,
              'name' : this.name,
              'image_domain' : this.image_domain,
              'product_image_path' : this.product_image_path,
              'unit_image' : this.unit_image
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

  saveProductContact() {
    const formModel = this.contactForm.value;
    const product_id = this.product_detail['id'];

    this.productService.postProductContact(formModel, product_id)
      .subscribe((contact: any) => {
        this.status = contact['kitchenart']['results']['status'];
        if(this.status === 'success'){
            this.showSuccess();
        }
        else{
            this.showError();
        }
      });
  }

  saveProductIssue() {
    const formModel = this.issueForm.value;
    const product_id = this.product_detail['id'];
    const token = this.token;

    this.productService.postProductIssue(token, product_id, formModel)
      .subscribe((issue: any) => {
        this.status = issue['kitchenart']['results']['status'];
        if(this.status === 'success'){
            this.showSuccessIssue();
        }
        else{
            this.showErrorIssue();
        }
      });
  }

  postQuestion() {
    this.commentPost = true
    const parent = "";
    const formModel = this.textMessage.value;
    const product_id = this.product_detail['id'];
    const token = this.token;

    this.productService.postProductDiscuss(parent, product_id, token, formModel)
      .subscribe((discuss: any) => {
        let status = discuss['kitchenart']['results']['status'];
        if(status === 'success'){
            this.commentPost = false
            this.showSuccessDiscuss();
            this.textMessage = new FormControl('', Validators.required)
        }
        else{
            this.showErrorDisscuss();
        }
      });
  }

  postQuestionChild(id: any) {
    this.commentPost = true
    const parent = id;
    const formModel = this.questionChildForm.value['text'];
    const product_id = this.product_detail['id'];
    const token = this.token;

    this.productService.postProductDiscuss(parent, product_id, token, formModel)
      .subscribe((discuss: any) => {
        let status = discuss['kitchenart']['results']['status'];
        if(status === 'success'){
            this.commentPost = false
            this.selectComment = null;
            this.showSuccessDiscuss();
            this.reset();
        }
        else{
            this.showErrorDisscuss();
        }
      });
  }

  saveRequestStock() {
    this.commentPost = true
    const product_id = this.product_detail['id'];
    const email = this.email.value

    this.productService.postProductRequest(email, product_id)
      .subscribe((request: any) => {
        let status = request['kitchenart']['results']['status'];
        if(status === 'success'){
            this.commentPost = false
            this.requestStock = false
            this.showSuccessDiscuss();
            this.email = new FormControl('', [Validators.required, Validators.email])
        }
        else{
            this.showErrorDisscuss();
        }
      });
  }

  closeRequestStock() {
    this.requestStock = false
  }

  openRequestStock() {
    this.requestStock = true
  }

  popupContact() {
    this.contactProduct = true;
  }

  closePopupContact() {
    this.contactProduct = false;
  }

  popupIssue() {
    this.issueProduct = true;
  }

  closePopupIssue() {
    this.issueProduct = false;
  }

  goProductDetail(id: any) {
    this.router.navigate(['base/', id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  goQuickProductDetail(id: any) {
    this.router.navigate(['base/', id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  detailGalery(url: any){
    this.router.navigate(['brand_galleries/' + this.brand_url + '/', url]);
  }

  goProductDetailDiscuss() {
    this.router.navigate(['discussion/', this.param]);
  }

  goProductTrade(url: any) {
    this.router.navigate(['trade_in/', url]);
  }

  addWishlistLogin(){
    this.alertDiscussion()
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    if(this.lang == 'en'){
      this.toastr.success('Message sent successfully');
    }
    else{
      this.toastr.success('Pesan berhasil terkirim');
    }
    this.closePopupContact();
    this.createForm();
  }

  showError() {
    if(this.lang == 'en'){
      this.toastr.error('Message not sent');
    }
    else{
      this.toastr.error('Pesan tidak terkirim');
    }
    this.closePopupContact();
  }

  showSuccessIssue() {
    if(this.lang == 'en'){
      this.toastr.success('Message sent successfully');
    }
    else{
      this.toastr.success('Pesan berhasil terkirim');
    }
    this.closePopupIssue();
    this.createIssueForm();
  }

  showErrorIssue() {
    if(this.lang == 'en'){
      this.toastr.error('Message not sent');
    }
    else{
      this.toastr.error('Pesan tidak terkirim');
    }
    this.closePopupIssue();
  }

  showSuccessDiscuss() {
    if(this.lang == 'en'){
      this.toastr.success('Message sent successfully');
    }
    else{
      this.toastr.success('Pesan berhasil terkirim');
    }
  }

  showErrorDisscuss() {
    if(this.lang == 'en'){
      this.toastr.error('Message not sent');
    }
    else{
      this.toastr.error('Pesan tidak terkirim');
    }
  }

  alertDiscussion() {
    if(this.lang == 'en'){
      this.toastr.warning('Please Login');
    }
    else{
      this.toastr.warning('Silahkan Login');
    }
  }

  showSuccessAddWishlist() {
    if(this.lang == 'en'){
      this.toastr.success('Successfully added to wishlist');
    }
    else{
      this.toastr.success('Tambah keinginan berhasil');
    }
  }

  alertWislist() {
    this.toastr.error(this.statusWishlist);
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

  alertProduct() {
    if(this.lang == 'en'){
      this.toastr.error('Product exist');
    }
    else{
      this.toastr.error('Produk sudah ada');
    }
  }

  closeImage(){
    this.closeImages = false
  }

  openImage() {
    this.closeImages = true
  }

  getSimiliar(){
    this.quickCompare = true
  }

  getRating(){
    this.quickCompare = false
  }

  goAcessories() {
    this.router.navigate(['accessories/', this.param]);
  }

}
