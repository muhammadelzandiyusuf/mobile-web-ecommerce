import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuFooterComponent } from './modules/views/menu-footer/menu-footer.component';

import { Globals } from './service/global'
import { TermService } from "./service/term/term.service";
import { Ng2Webstorage } from 'ngx-webstorage';

import { FilterModule } from './filter/filter.module';
import { SafeModule } from './filter/safe.module';
import { ToastrModule } from '../../node_modules/ngx-toastr';

import { CartService } from './service/cart/cart.service';
import { CommonModule, DatePipe } from '@angular/common';
import { SwiperModule } from 'angular2-useful-swiper';
import { AccountRoutingModule } from './routes/account-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomFormsModule } from 'ng4-validators';
import { RatingModule } from 'ngx-rating';
import { NgxInputStarRatingModule } from 'ngx-input-star-rating';
import { ProfileComponent } from './modules/account/profile/profile/profile.component';
import { AccountComponent } from './modules/account/account/account.component';
import { ProfileEditComponent } from './modules/account/profile/profile-edit/profile-edit.component';
import { ProfilePasswordComponent } from './modules/account/profile/profile-password/profile-password.component';
import { AccountShippingAddressComponent } from './modules/account/shipping-address/account-shipping-address/account-shipping-address.component';
import { AccountShippingAddressAddComponent } from './modules/account/shipping-address/account-shipping-address-add/account-shipping-address-add.component';
import { AccountShippingAddressUpdateComponent } from './modules/account/shipping-address/account-shipping-address-update/account-shipping-address-update.component';
import { WishlistComponent } from './modules/account/wishlist/wishlist.component';
import { LastViewComponent } from './modules/account/last-view/last-view.component';
import { ReferralProgramComponent } from './modules/account/referral-program/referral-program.component';
import { ReferralProgramDetailComponent } from './modules/account/referral-program-detail/referral-program-detail.component';
import { HistoryOrderComponent } from './modules/account/history/history-order/history-order.component';
import { HistoryOrderDetailComponent } from './modules/account/history/history-order-detail/history-order-detail.component';
import { ProductReviewComponent } from './modules/account/history/product-review/product-review.component';
import { TrackShippingComponent } from './modules/account/history/track-shipping/track-shipping.component';
import { AccountTradeinComponent } from './modules/account/account-tradein/account-tradein.component';
import { AccountTradeinDetailComponent } from './modules/account/account-tradein-detail/account-tradein-detail.component';
import { BalanceComponent } from './modules/account/balance/balance.component';
import { ProductDiscussionComponent } from './modules/account/product-discussion/product-discussion.component';
import { ProductDiscussionDetailComponent } from './modules/account/product-discussion-detail/product-discussion-detail.component';
import { TechnicianReviewComponent } from './modules/account/technician-review/technician-review/technician-review.component';
import { TechnicianReviewFormComponent } from './modules/account/technician-review/technician-review-form/technician-review-form.component';
import { VoucherComponent } from './modules/account/voucher/voucher/voucher.component';
import { VoucherDetailComponent } from './modules/account/voucher/voucher-detail/voucher-detail.component';
import { WishlistService } from './service/wishlist/wishlist.service';
import { ShippingAddressService } from './service/shipping-address/shipping-address.service';
import { ProvinceService } from './service/province/province.service';
import { CityService } from './service/city/city.service';
import { AccountService } from './service/account/account.service';
import { ReferralProgramService } from './service/referral-program/referral-program.service';
import { HistoryOrderService } from './service/history-order/history-order.service';
import { ProductDiscussService } from './service/product-discuss/product-discuss.service';
import { ProductService } from './service/product/product.service';
import { TechnicianReviewService } from './service/technician-review/technician-review.service';
import { VoucherService } from './service/voucher/voucher.service';
import { CulinaryClassesRoutingModule } from './routes/culinary-classes-routing.module';
import { DateTimePickerModule } from 'ngx-datetime-picker';
import { AgmCoreModule } from '@agm/core';
import { LightboxModule } from 'ngx-lightbox';
import { CulinaryClassesComponent } from './modules/culinary-classes/culinary-classes/culinary-classes.component';
import { WineDineComponent } from './modules/culinary-classes/wine-dine/wine-dine.component';
import { WineDineDetailComponent } from './modules/culinary-classes/wine-dine-detail/wine-dine-detail.component';
import { CookingClasssComponent } from './modules/culinary-classes/cooking-class-demo/cooking-classs/cooking-classs.component';
import { CookingClassDetailComponent } from './modules/culinary-classes/cooking-class-demo/cooking-class-detail/cooking-class-detail.component';
import { CafeRestoComponent } from './modules/culinary-classes/cafe-resto/cafe-resto/cafe-resto.component';
import { CafeRestoDetailComponent } from './modules/culinary-classes/cafe-resto/cafe-resto-detail/cafe-resto-detail.component';
import { RecipeComponent } from './modules/culinary-classes/recipes/recipe/recipe.component';
import { RecipeDetailComponent } from './modules/culinary-classes/recipes/recipe-detail/recipe-detail.component';
import { WineDineService } from './service/wine-dine/wine-dine.service';
import { CookingClassDemoService } from './service/cooking-class-demo/cooking-class-demo.service';
import { RestaurantService } from './service/restaurant/restaurant.service';
import { RecipeService } from './service/recipe/recipe.service';
import { HelpInfoRoutingModule } from './routes/help-info-routing.module';
import { ShippingInfoComponent } from './modules/help-info/shipping-info/shipping-info.component';
import { TermConditionComponent } from './modules/help-info/term-condition/term-condition.component';
import { PrivacyPolicyComponent } from './modules/help-info/privacy-policy/privacy-policy.component';
import { LegalStatementComponent } from './modules/help-info/legal-statement/legal-statement.component';
import { ProductManualComponent } from './modules/help-info/product-manual/product-manual/product-manual.component';
import { ProductManualDetailComponent } from './modules/help-info/product-manual/product-manual-detail/product-manual-detail.component';
import { InstallationVideoComponent } from './modules/help-info/installation-videos/installation-video/installation-video.component';
import { InstallationVideoDetailComponent } from './modules/help-info/installation-videos/installation-video-detail/installation-video-detail.component';
import { CertifiedTechnicianComponent } from './modules/help-info/certified-technicians/certified-technician/certified-technician.component';
import { CertifiedTechnicianDetailComponent } from './modules/help-info/certified-technicians/certified-technician-detail/certified-technician-detail.component';
import { WarrantyComponent } from './modules/help-info/warranty/warranty.component';
import { FaqComponent } from './modules/help-info/faq/faq/faq.component';
import { FaqListComponent } from './modules/help-info/faq/faq-list/faq-list.component';
import { FaqDetailComponent } from './modules/help-info/faq/faq-detail/faq-detail.component';
import { ServiceInstallationComponent } from './modules/help-info/service-installation/service-installation/service-installation.component';
import { ServiceInstallationFormComponent } from './modules/help-info/service-installation/service-installation-form/service-installation-form.component';
import { TrackingOrderComponent } from './modules/help-info/tracking-order/tracking-order.component';
import { InformationService } from './service/information/information.service';
import { ProductManualService } from './service/product-manual/product-manual.service';
import { InstallationVideoService } from './service/installation-video/installation-video.service';
import { CertifiedTechnicianService } from './service/certified-technician/certified-technician.service';
import { WarrantyService } from './service/warranty/warranty.service';
import { BrandService } from './service/brand/brand.service';
import { FaqService } from './service/faq/faq.service';
import { ServiceInstallationService } from './service/service-installation/service-installation.service';
import { CategoryService } from './service/category/category.service';
import { TitleTagService } from './service/meta/titletag.service';

import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider } from "angular5-social-auth";
import { MemberRoutingModule } from './routes/member-routing.module';
import { BussinessPartnersRoutingModule } from './routes/bussiness-partners-routing.module';
import { BussinessPartnersComponent } from './modules/member/bussiness-partners/bussiness-partners.component';
import { LoginComponent } from './modules/member/login/login.component';
import { RegisterComponent } from './modules/member/register/register.component';
import { ForgotPasswordComponent } from './modules/member/forgot-password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/member/forgot-password/reset-password/reset-password.component';
import { BussinessService } from './service/bussiness/bussiness.service';
import { MessageService } from './service/message.service';
import { CustomerService } from './service/customer/customer.service';
import { ForgotPasswordService } from './service/forgot-password/forgot-password.service';
import { OrderRoutingModule } from './routes/order-routing.module';
import { CartComponent } from './modules/order/cart/cart.component';
import { CheckoutComponent } from './modules/order/checkout/checkout.component';
import { ShippingAddressAddComponent } from './modules/order/shipping-address/shipping-address-add/shipping-address-add.component';
import { ShippingAddressUpdateComponent } from './modules/order/shipping-address/shipping-address-update/shipping-address-update.component';
import { ShippingAddressListComponent } from './modules/order/shipping-address/shipping-address-list/shipping-address-list.component';
import { CheckoutPromoComponent } from './modules/order/checkout-promo/checkout-promo.component';
import { CheckoutService } from './service/checkout/checkout.service';
import { OurCompanyRoutingModule } from './routes/our-company-routing.module';
import { AboutUsComponent } from './modules/our-company/about-us/about-us.component';
import { CareersComponent } from './modules/our-company/careers/career/careers.component';
import { ContactComponent } from './modules/our-company/contact/contact.component';
import { MediaCenterComponent } from './modules/our-company/media-center/media-center/media-center.component';
import { MediaCenterDetailComponent } from './modules/our-company/media-center/media-center-detail/media-center-detail.component';
import { CareerFormComponent } from './modules/our-company/careers/career-form/career-form.component';
import { CareerService } from './service/career/career.service';
import { MediaCenterService } from './service/media-center/media-center.service';
import { AboutUsService } from './service/about-us/about-us.service';
import { ContactUsService } from './service/contact-us/contact-us.service';
import { NewsletterService } from './service/newsletter/newsletter.service';
import { ProductRoutingModule } from './routes/product-routing.module';
import { HomeRoutingModule } from './routes/home-routing.module';
import { OrderModule } from 'ngx-order-pipe';
import { OrderPipeModule } from './filter/order-pipe/order.module';
import { ProductComponent } from './modules/product/product/product.component';
import { ProductListBrandComponent } from './modules/product/product-list-brand/product-list-brand.component';
import { PackageDealComponent } from './modules/product/package-deal/package-deal.component';
import { ProductDetailComponent } from './modules/product/product-detail/product-detail.component';
import { ProductDetailPackageComponent } from './modules/product/product-detail-package/product-detail-package.component';
import { ProductPromoComponent } from './modules/product/product-promo/product-promo.component';
import { CountDown } from "./../../node_modules/angular2-simple-countdown/countdown";
import { ProductSearchComponent } from './modules/product/product-search/product-search.component';
import { ProductCompareComponent } from './modules/product/product-compare/product-compare.component';
import { TradeInComponent } from './modules/product/trade-in/trade-in.component';
import { TradeInFormComponent } from './modules/product/trade-in-form/trade-in-form.component';
import { HomeComponent } from './modules/home/home.component';
import { SearchComponent } from './modules/search/search.component';
import { TradeinService } from './service/tradein/tradein.service';
import { BannerService } from './service/banner/banner.service';
import { ProfesionalResourceModule } from './routes/profesional-resource.module';
import { ProfessionalResourceComponent } from './modules/professional-resource/professional-resource/professional-resource.component';
import { ArchitectComponent } from './modules/professional-resource/architect/architect/architect.component';
import { ArchitectDetailComponent } from './modules/professional-resource/architect/architect-detail/architect-detail.component';
import { ArchitectPortfolioComponent } from './modules/professional-resource/architect/architect-portfolio/architect-portfolio.component';
import { ContractorComponent } from './modules/professional-resource/contractor/contractor/contractor.component';
import { ContractorDetailComponent } from './modules/professional-resource/contractor/contractor-detail/contractor-detail.component';
import { ContractorPortfolioComponent } from './modules/professional-resource/contractor/contractor-portfolio/contractor-portfolio.component';
import { HostComponent } from './modules/professional-resource/host/host/host.component';
import { HostDetailComponent } from './modules/professional-resource/host/host-detail/host-detail.component';
import { VideoComponent } from './modules/professional-resource/video/video/video.component';
import { VideoListComponent } from './modules/professional-resource/video/video-list/video-list.component';
import { VideoDetailComponent } from './modules/professional-resource/video/video-detail/video-detail.component';
import { ProjectReferenceComponent } from './modules/professional-resource/project-reference/project-reference/project-reference.component';
import { ProjectReferenceDetailComponent } from './modules/professional-resource/project-reference/project-reference-detail/project-reference-detail.component';
import { ArchitectService } from './service/architect/architect.service';
import { ContractorService } from './service/contractor/contractor.service';
import { HostService } from './service/host/host.service';
import { ProjectReferenceService } from './service/project-reference/project-reference.service';
import { VideoService } from './service/video/video.service';
import { ShoppingToolRoutingModule } from './routes/shopping-tool-routing.module';
import { ShoppingToolComponent } from './modules/shopping-tool/shopping-tool/shopping-tool.component';
import { ShowroomComponent } from './modules/shopping-tool/showroom/showroom/showroom.component';
import { ShowroomDetailComponent } from './modules/shopping-tool/showroom/showroom-detail/showroom-detail.component';
import { KitchentPartnersComponent } from './modules/shopping-tool/kitchent-partners/kitchen-partner/kitchent-partners.component';
import { KitchenPartnerDetailComponent } from './modules/shopping-tool/kitchent-partners/kitchen-partner-detail/kitchen-partner-detail.component';
import { CatalogueComponent } from './modules/shopping-tool/catalogues/catalogue/catalogue.component';
import { CatalogueDetailComponent } from './modules/shopping-tool/catalogues/catalogue-detail/catalogue-detail.component';
import { InquiryComponent } from './modules/shopping-tool/inquiry/inquiry.component';
import { BrandGalleryComponent } from './modules/shopping-tool/brand-gallery/brand-gallery/brand-gallery.component';
import { BrandGalleryListComponent } from './modules/shopping-tool/brand-gallery/brand-gallery-list/brand-gallery-list.component';
import { BrandGalleryDetailComponent } from './modules/shopping-tool/brand-gallery/brand-gallery-detail/brand-gallery-detail.component';
import { FreeKitchenDesignComponent } from './modules/shopping-tool/free-kitchen-design/free-kitchen-design/free-kitchen-design.component';
import { FreeKitchenDesignDetailComponent } from './modules/shopping-tool/free-kitchen-design/free-kitchen-design-detail/free-kitchen-design-detail.component';
import { FreeKitchenDesignFormComponent } from './modules/shopping-tool/free-kitchen-design/free-kitchen-design-form/free-kitchen-design-form.component';
import { ExhibitionComponent } from './modules/shopping-tool/exhibition/exhibition/exhibition.component';
import { ExhibitionDetailComponent } from './modules/shopping-tool/exhibition/exhibition-detail/exhibition-detail.component';
import { ShowroomService } from './service/showroom/showroom.service';
import { KitchenPartneService } from './service/kithen-partner/kitchen-partne.service';
import { CatalogueService } from './service/catalogue/catalogue.service';
import { InquiryService } from './service/inquiry/inquiry.service';
import { BrandGalleryService } from './service/brand-gallery/brand-gallery.service';
import { FreeKitchenDesignService } from './service/free-kitchen-design/free-kitchen-design.service';
import { ExhibitionService } from './service/exhibition/exhibition.service';
import { ProductDetailDiscussComponent } from './modules/product/product-detail-discuss/product-detail-discuss.component';
import { CookingClassRegistrationComponent } from './modules/culinary-classes/cooking-class-demo/cooking-class-registration/cooking-class-registration.component';
import { CookingClassThanksComponent } from './modules/culinary-classes/cooking-class-demo/cooking-class-thanks/cooking-class-thanks.component';
import { NotFoundComponent } from './modules/views/not-found/not-found.component';
import { LandingComponent } from './modules/views/landing/landing.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CommisionComponent } from './modules/account/commision/commision.component';

// import ngx-translate and the http loader
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { CommisionDetailComponent } from './modules/account/commision-detail/commision-detail.component';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { NotificationComponent } from './modules/notification/notification.component';
import { ProductListCategoryComponent } from './modules/product/product-list-category/product-list-category.component';
import { NotificationService } from './service/notification/notification.service';
import { RegisterSuccessComponent } from './modules/views/register-success/register-success.component';
import { GiveAwayComponent } from './modules/product/give-away/give-away.component';
import { ProductEventComponent } from './modules/product/product-event/product-event.component';
import { ProductAccessoriesComponent } from './modules/product/product-accessories/product-accessories.component';
import { ProductCommercialComponent } from './modules/product/product-commercial/product-commercial.component';
 
export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.fromPromise(System.import(`../assets/i18n/${lang}.json`));
  }
}

// Configs 
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("1331625150285491")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("719721161176-v9ejrc6l879an677lf4h345et4ug7nt6.apps.googleusercontent.com")
        }
      ]
  );
  return config;
}

@NgModule({
  entryComponents: [
    MenuFooterComponent
  ],
  declarations: [
    AppComponent,
    MenuFooterComponent,
    ProfileComponent, 
    AccountComponent, 
    ProfileEditComponent, 
    ProfilePasswordComponent, 
    AccountShippingAddressComponent, 
    AccountShippingAddressAddComponent, 
    AccountShippingAddressUpdateComponent, 
    WishlistComponent, 
    LastViewComponent, 
    ReferralProgramComponent, 
    ReferralProgramDetailComponent, 
    HistoryOrderComponent, 
    HistoryOrderDetailComponent, 
    ProductReviewComponent, 
    TrackShippingComponent, 
    AccountTradeinComponent, 
    AccountTradeinDetailComponent, 
    BalanceComponent, 
    ProductDiscussionComponent, 
    ProductDiscussionDetailComponent, 
    TechnicianReviewComponent, 
    TechnicianReviewFormComponent, 
    VoucherComponent, 
    VoucherDetailComponent,
    CulinaryClassesComponent, 
    WineDineComponent, 
    WineDineDetailComponent, 
    CookingClasssComponent, 
    CookingClassDetailComponent, 
    CafeRestoComponent, 
    CafeRestoDetailComponent, 
    RecipeComponent, 
    RecipeDetailComponent,
    ShippingInfoComponent, 
    TermConditionComponent, 
    PrivacyPolicyComponent, 
    LegalStatementComponent, 
    ProductManualComponent, 
    ProductManualDetailComponent, 
    InstallationVideoComponent, 
    InstallationVideoDetailComponent, 
    CertifiedTechnicianComponent, 
    CertifiedTechnicianDetailComponent, 
    WarrantyComponent, 
    FaqComponent, 
    FaqListComponent, 
    FaqDetailComponent, 
    ServiceInstallationComponent, 
    ServiceInstallationFormComponent, 
    TrackingOrderComponent,
    BussinessPartnersComponent, 
    LoginComponent, 
    RegisterComponent, 
    ForgotPasswordComponent, 
    ResetPasswordComponent,
    CartComponent, 
    CheckoutComponent, 
    ShippingAddressAddComponent, 
    ShippingAddressUpdateComponent, 
    ShippingAddressListComponent, 
    CheckoutPromoComponent,
    AboutUsComponent, 
    CareersComponent,
    ContactComponent,
    MediaCenterComponent,
    MediaCenterDetailComponent,
    CareerFormComponent,
    ProductComponent,
    ProductListBrandComponent, 
    PackageDealComponent, 
    ProductDetailComponent, 
    ProductDetailPackageComponent, 
    ProductPromoComponent, 
    ProductDetailDiscussComponent,
    CountDown, 
    ProductSearchComponent, 
    ProductCompareComponent, 
    TradeInComponent, 
    TradeInFormComponent,
    HomeComponent,
    SearchComponent,
    ProfessionalResourceComponent, 
    ArchitectComponent, 
    ArchitectDetailComponent, 
    ArchitectPortfolioComponent, 
    ContractorComponent, 
    ContractorDetailComponent, 
    ContractorPortfolioComponent, 
    HostComponent, 
    HostDetailComponent, 
    VideoComponent, 
    VideoListComponent, 
    VideoDetailComponent, 
    ProjectReferenceComponent, 
    ProjectReferenceDetailComponent,
    ShoppingToolComponent, 
    ShowroomComponent, 
    ShowroomDetailComponent, 
    KitchentPartnersComponent, 
    KitchenPartnerDetailComponent, 
    CatalogueComponent, 
    CatalogueDetailComponent, 
    InquiryComponent, 
    BrandGalleryComponent, 
    BrandGalleryListComponent, 
    BrandGalleryDetailComponent, 
    FreeKitchenDesignComponent, 
    FreeKitchenDesignDetailComponent, 
    FreeKitchenDesignFormComponent, 
    ExhibitionComponent, 
    ExhibitionDetailComponent,
    CookingClassRegistrationComponent,
    CookingClassThanksComponent,
    NotFoundComponent,
    LandingComponent,
    CommisionComponent,
    CommisionDetailComponent,
    NotificationComponent,
    ProductListCategoryComponent,
    RegisterSuccessComponent,
    GiveAwayComponent,
    ProductEventComponent,
    ProductAccessoriesComponent,
    ProductCommercialComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    FilterModule,
    SafeModule,
    Ng2Webstorage,
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    }),
    CommonModule,
    SwiperModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    TextMaskModule,
    CustomFormsModule,
    RatingModule,
    NgxInputStarRatingModule,
    CulinaryClassesRoutingModule,
    DateTimePickerModule,
    LightboxModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAPyxUtxvUY9LlGovZxbk_x-ibEgaRG8jU',
      libraries: ["places"]
    }),
    HelpInfoRoutingModule,
    BussinessPartnersRoutingModule,
    MemberRoutingModule,
    SocialLoginModule,
    OrderRoutingModule,
    OurCompanyRoutingModule,
    ProductRoutingModule,
    HomeRoutingModule,
    OrderModule,
    OrderPipeModule,
    ProfesionalResourceModule,
    ShoppingToolRoutingModule,
    DeviceDetectorModule.forRoot(),
    NgxTypeaheadModule
  ],
  providers: [ 
    TermService, 
    Globals, 
    CartService,
    TermService,
    WishlistService,
    ShippingAddressService,
    ProvinceService,
    CityService,
    AccountService,
    ReferralProgramService,
    HistoryOrderService,
    DatePipe,
    ProductDiscussService,
    ProductService,
    TechnicianReviewService,
    VoucherService,
    WineDineService,
    CookingClassDemoService,
    RestaurantService,
    RecipeService,
    InformationService, 
    ProductManualService, 
    InstallationVideoService, 
    CertifiedTechnicianService, 
    WarrantyService, 
    BrandService, 
    FaqService, 
    ServiceInstallationService, 
    CategoryService, 
    BussinessService, 
    MessageService, 
    CustomerService, {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs,
    }, 
    ForgotPasswordService,
    CheckoutService,
    CareerService,
    MediaCenterService,
    AboutUsService,
    ContactUsService,
    NewsletterService,
    TradeinService, 
    BannerService,
    ArchitectService,
    ContractorService,
    HostService,
    ProjectReferenceService,
    VideoService,
    ShowroomService,  
    KitchenPartneService, 
    CatalogueService, 
    InquiryService, 
    BrandGalleryService,
    FreeKitchenDesignService,
    ExhibitionService,
    NotificationService,
    TitleTagService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }