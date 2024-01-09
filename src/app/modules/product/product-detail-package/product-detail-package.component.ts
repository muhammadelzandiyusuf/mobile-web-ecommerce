import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductService } from '../../../service/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { TermService } from '../../../service/term/term.service';
import { WishlistService } from '../../../service/wishlist/wishlist.service';
import { CartService } from '../../../service/cart/cart.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';
import { CityService } from '../../../service/city/city.service';
import { ProvinceService } from '../../../service/province/province.service';

@Component({
  selector: 'app-product-detail-package',
  templateUrl: './product-detail-package.component.html',
  styleUrls: ['./product-detail-package.component.css']
})
export class ProductDetailPackageComponent implements OnInit {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
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

  id: number;
  navigationSubscription: any;

  contactProduct: boolean = false;
  issueProduct: boolean = false;

  contactForm: FormGroup;
  issueForm: FormGroup;
  questionForm: FormGroup;
  questionChildForm: FormGroup;

  status: string;

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

  selectedIndex: any = null;
  selectedIndexAcc: any = null;
  selectedProduct: any = null;
  slide_active: number = 0;
  thumb_active: number = 0;

  product_detail: any = [];
  product_package: any = [];
  videoUrl: any;
  specification: any;

  product_package_id: any = null;
  access_id: any;

  product_package_accessories_available: any = [];
  product_package_item_available: any = [];
  selectComment: any = null;
  product_image: any;
  brand_name: any;
  name: any;
  price: any;
  product_additiona_warranties: any;
  pakage_item_chose: any;
  package_accessories: any;
  discount_price: any;
  installment_3: any;
  installment_6: any;
  installment_12: any;
  highlight_english: any;
  count_review: any;
  product_discussions_parent: any;
  product_packages: any;
  other_color: any;
  product_accessories: any;
  more_from: any;
  related_product: any;
  base_product_id: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;

  wishlistStatus: boolean = false;
  param: any;
  product_id: any;
  statusWishlist: any;

  carts: any = [];
  cartLocal: any;
  product_image_path: any;
  unit_image: any;
  localCarts: any;
  idProductCart: any = null;
  image_domain: any;

  textMessage = new FormControl('', Validators.required);
  commentPost: boolean = false

  closeImages: boolean = false
  quantity: any;
  stock_status_id: any;
  able_to_order: any;
  requestStock: boolean = false;
  email = new FormControl('', [Validators.required, Validators.email])
  base_product_url: any;
  lang: any;
  highlight_indonesia: any;
  heightVideo: string;
  code: any;
  brand_galeries: any;
  token: any;
  typeStatus: any;
  notLoad: boolean = false;

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
  provinceName: any = 'Banten';

  showCostShippingAddress: boolean = false;
  showMasterPostal: boolean = true;
  showDestination: boolean = false;
  postalCode = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]);
  shippingAddress: any = [];
  tariffCode: any;

  constructor(
    private localSt: LocalStorageService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastr: ToastrService,
    private termService: TermService,
    private meta: Meta,
    private titleService: Title,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private deviceService: DeviceDetectorService,
    private cityService: CityService,
    private provinceService: ProvinceService
  ) {
    this.route.params.subscribe((params: any) => {
      this.param = params['id']
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
    this.createForm();
    this.createIssueForm();
  }

  getMeta(keyword: any, description: any) {
    this.termService.getTagMeta()
      .subscribe(meta => {
        this.metaTag = meta['kitchenart']['results'];
        if (keyword == '' || keyword == null) {
          this.metaKeyword = this.metaTag['meta_keyword']
        }
        else {
          this.metaKeyword = keyword
        }

        if (description == '' || description == null) {
          this.metaDescription = this.metaTag['meta_description']
        }
        else {
          this.metaDescription = description
        }

        this.meta.updateTag(
          { name: 'description', content: this.metaDescription }
        );

        this.meta.updateTag(
          { name: 'keywords', content: this.metaKeyword }
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
    // this.showCostShipping = false;
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
    this.prov_name = name;
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
    this.subdist_name = name;
    this.cityService.getCourierCostByProduct(this.city_id, this.subdist_id, this.product_detail['id'])
    .subscribe((courier: any) => {
      const data = courier['kitchenart']['results'];
      this.weight = data['weight'];
      this.courier = data['courier'];
      this.freeShipping = data['free_shipping'];
      this.services = data['services'];
      if(this.services.length > 0) {
        this.priceCourier = this.services[0]['cost']
      }
      this.localSt.store('city_destiny', this.city_id);
      this.localSt.store('city_name', this.cityName);
      this.localSt.store('subdist_destiny', this.subdist_id);
      this.loading = false;
      this.showSubdistrict = false;
      this.showMaster = true;
    })
  }

  getCourierCostProduct(city_id: any, subdist_id: any, product_id: any) {
    this.cityService.getCourierCostByProduct(city_id, subdist_id, product_id)
    .subscribe((courier: any) => {
      const data = courier['kitchenart']['results'];
      this.weight = data['weight'];
      this.courier = data['courier'];
      this.freeShipping = data['free_shipping'];
      this.services = data['services'];
      if(this.services.length > 0) {
        this.priceCourier = this.services[0]['cost']
      }
      this.notLoad = true;
    })
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
    this.lang = this.localSt.retrieve('lang');
    this.cartLocal = this.localSt.retrieve('carts');
    this.getProductPackages(this.param, this.token);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  openShippingAddress() {
    this.showCostShippingAddress = true;
  }

  closeShippingAddress() {
    this.showCostShippingAddress = false;
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

  createForm() {
    this.contactForm = new FormGroup({
      product_id: new FormControl(),
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

  toggleValueItem(id: any) {
    this.selectedIndex = id;
    this.router.navigate(['package/', id]);
  }

  goProductBase(base_id: any) {
    this.router.navigate(['base/', base_id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  toggleValueAccess(id: any) {
    this.selectedIndex = id;
    this.router.navigate(['package/', id]);
  }

  getProductPackages(id: any, token: any): void {
    this.notLoad = false
    this.productService.getProducDetailPackage(id, token)
      .subscribe(product => {
        this.product_detail = product['kitchenart']['results'];
        this.product_id = this.product_detail['id'];
        this.quantity = this.product_detail['quantity'];
        this.able_to_order = this.product_detail['able_to_order'];
        this.stock_status_id = this.product_detail['stock_status_id'];
        this.starsCount = this.product_detail['avg_rating'];
        this.selectedIndex = this.product_detail['product_package_item_selected'];
        this.selectedIndexAcc = this.product_detail['product_package_accessories_selected'];
        this.product_package_accessories_available = this.product_detail['product_package_accessories_available'];
        this.product_package_item_available = this.product_detail['product_package_item_available'];
        this.product_image = this.product_detail['product_image'];
        this.brand_name = this.product_detail['brand_name'];
        this.name = this.product_detail['name'];
        this.code = this.product_detail['code'];
        this.price = this.product_detail['price'];
        this.discount_price = this.product_detail['discount_price'];
        this.pakage_item_chose = this.product_detail['package_item'];
        this.package_accessories = this.product_detail['package_accessories'];
        this.installment_3 = this.product_detail['installment_3'];
        this.installment_6 = this.product_detail['installment_6'];
        this.installment_12 = this.product_detail['installment_12'];
        this.highlight_english = this.product_detail['highlight_english'];
        this.highlight_indonesia = this.product_detail['highlight_indonesia'];
        this.count_review = this.product_detail['count_review'];
        this.product_discussions_parent = this.product_detail['product_discussions_parent'];
        this.product_packages = this.product_detail['product_package'];
        this.base_product_id = this.product_detail['base_product_id'];
        this.base_product_url = this.product_detail['base_product_url']
        this.wishlistStatus = this.product_detail['wishlist'];
        this.typeStatus = this.product_detail['type_status_id'];

        this.product_image_path = this.product_detail['product_image_path'];
        this.unit_image = this.product_detail['product_image'][0]['product_image'];
        this.image_domain = this.product_detail['image_domain'];

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

        let keyword = this.product_detail['meta_keyword']
        let description = this.product_detail['meta_description']
        this.getMeta(keyword, description)

        this.titleService.setTitle('KitchenArt - ' + this.name);
        this.notLoad = true
        
        if(this.token != null){
            this.wishlistService.postAddLastView(this.product_id, this.token)
            .subscribe((lastview: any) => {
                const statusLast = lastview['kitchenart']['results']['status'];
            })
        }

        this.notLoad = true;
        // this.getCourierCostProduct(this.city_id, this.subdist_id, this.product_detail['id']);
      });
  }

  addWishlist() {
    this.wishlistService.postAdd(this.product_id, this.token)
      .subscribe((wishlist: any) => {
        let status = wishlist['kitchenart']['results']['status']
        if (status == 'success') {
          this.showSuccessAddWishlist()
          this.getProductPackages(this.param, this.token)
        }
        else {
          this.statusWishlist = wishlist['kitchenart']['results']['message']
          this.alertWislist()
        }
      })
  }

  addCart() {
    this.cartService.postAdd(this.product_id, this.token)
      .subscribe((cart: any) => {
        let status = cart['kitchenart']['results']['status']
        if (status == 'success') {
          this.showSuccessAddCart()
          this.getProductPackages(this.param, this.token)
          setTimeout(() => {
            location.reload();
          }, 3000)
        }
        else {
          this.statusWishlist = cart['kitchenart']['results']['message']
          this.alertCart()
        }
      })
  }

  addWishlistLogin(){
    this.alertDiscussion()
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

  getProductDetailRelated(id: any, url: any): void {
    this.selectedProduct = id;
    this.videoUrl = null;
    this.productService.getProducDetail(url, this.token)
      .subscribe((product: any) => {
        this.product_package = product['kitchenart']['results'];
        this.specification = this.product_package['specification'];
        this.other_color = this.product_package['other_color'];
        this.product_accessories = this.product_package['product_accessories'];
        this.related_product = this.product_package['related_product'];
        this.more_from = this.product_package['more_from'];
        this.brand_galeries = this.product_package['brand_galeries'];
        if (this.product_package['video_url']) {
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.product_package['video_url']);
        }
      });
  }

  goProductDetail(id: any) {
    this.router.navigate(['base/', id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  saveProductContact() {
    const formModel = this.contactForm.value;
    const product_id = this.product_detail['id'];

    this.productService.postProductContact(formModel, product_id)
      .subscribe((contact: any) => {
        this.status = contact['kitchenart']['results']['status'];
        if (this.status === 'success') {
          this.showSuccess();
        }
        else {
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
        if (this.status === 'success') {
          this.showSuccessIssue();
        }
        else {
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
        if (status === 'success') {
          this.commentPost = false
          this.showSuccessDiscuss();
          this.textMessage = new FormControl('', Validators.required)
        }
        else {
          this.showErrorDisscuss();
        }
      });
  }

  postQuestionChild(id: any) {
    const parent = id;
    const formModel = this.questionChildForm.value;
    const product_id = this.product_detail['id'];
    const token = this.token;

    this.productService.postProductDiscuss(parent, product_id, token, formModel)
      .subscribe((discuss: any) => {
        let status = discuss['kitchenart']['results']['status'];
        if (status === 'success') {
          this.selectComment = null;
          this.showSuccessDiscuss();
          this.reset();
        }
        else {
          this.showErrorDisscuss();
        }
      });
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

  goProductDetailDiscuss() {
    this.router.navigate(['discussion/', this.param]);
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

}
