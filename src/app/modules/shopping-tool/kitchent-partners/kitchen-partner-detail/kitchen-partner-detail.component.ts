import { Component, OnInit } from '@angular/core';
import { KitchenPartneService } from '../../../../service/kithen-partner/kitchen-partne.service';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { DomSanitizer, Meta, Title } from '../../../../../../node_modules/@angular/platform-browser';
import { trigger, transition, animate, style } from '@angular/animations'
import { FreeKitchenDesignService } from '../../../../service/free-kitchen-design/free-kitchen-design.service';
import { BrandGalleryService } from '../../../../service/brand-gallery/brand-gallery.service';
import { TermService } from '../../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-kitchen-partner-detail',
  templateUrl: './kitchen-partner-detail.component.html',
  styleUrls: ['./kitchen-partner-detail.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class KitchenPartnerDetailComponent implements OnInit {
  banner_type: any;
  videoUrl: any;
  content_english: any;
  visible: boolean = false;
  more: boolean = true;
  
  freeKitchen: any = [];
  brandGalleries: any = [];

  config: any = {};

  params: string;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  lang: any;
  content_indonesia: any;
  deviceInfo: any;
  heightVideo: string;
  imageDomain: any;
  thumbProject: any;
  projectPreferences: any;

  constructor(
    private kitchenService: KitchenPartneService,
    private brandGalleryService: BrandGalleryService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private freeKitchenService: FreeKitchenDesignService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.params = params['url']
      this.lang = this.localSt.retrieve('lang');
      this.getDetailKitchen(params['url']); 
    })
  }

  getMeta(keyword: any, description: any) {
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

  kitchenDetail: any;

  ngOnInit() {
    this.epicFunction();
  }

  epicFunction() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if(isMobile){
      this.heightVideo = "250px"
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
      this.heightVideo = "500px"
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

  getDetailKitchen(url: any){
    this.kitchenService.getKitchenPartnerDetails(url)
    .subscribe(detail => {
      this.kitchenDetail = detail['kitchenart']['results'];
      this.banner_type = this.kitchenDetail['banner_type'];
      this.content_english = this.kitchenDetail['content_english'];
      this.content_indonesia = this.kitchenDetail['content_indonesia'];

      if(this.kitchenDetail['banner_video']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.kitchenDetail['banner_video']);
      }

      this.imageDomain = this.kitchenDetail['image_domain'];
      this.thumbProject = this.kitchenDetail['thumb_project'];
      this.projectPreferences = this.kitchenDetail['project_preferences'];

      let keyword = this.kitchenDetail['meta_keyword']
      let description = this.kitchenDetail['meta_description']
      this.getMeta(keyword, description)

      this.getKitchenDesign();
      this.titleService.setTitle('KitchenArt - ' + this.kitchenDetail['name']);
    });
  }

  readMore() {
    this.visible = true;
    this.more = false;
  }

  // Free Kitchen Design
  getKitchenDesign(){
    const kitchen_id = this.kitchenDetail['id'];
    const sidx = 'id'
    const sort = 'desc'
    const limit = 10
    const offset = 0

    this.freeKitchenService.getKitchenDesigns(kitchen_id, sidx, sort, limit, offset)
    .subscribe(freeKitchen => {
      this.freeKitchen = freeKitchen['kitchenart']['results'];

      this.getBrandGalleries();
    })
  }

  goKitchenDesign(){
    this.router.navigate(['free_kitchen_designs/', this.kitchenDetail['id']]);
  }

  goProjectPreference(url: any) {
    this.router.navigate(['project_references/', url]);
  }

  goKitchenDesignDetail(url: any){
    this.router.navigate(['free_kitchen_designs/' + this.kitchenDetail['id'] + '/', url]);
  }

  // Brand Gallery
  getBrandGalleries() {
    const kitchen_id = this.kitchenDetail['id'];
    const sidx = 'id'
    const sort = 'desc'
    const limit = 10
    const offset = 0

    this.brandGalleryService.getBrandGalleryByKitchenPartner(kitchen_id, sidx, sort, limit, offset)
    .subscribe(brandGallery => {
      this.brandGalleries = brandGallery['kitchenart']['results'];
    })
  }

  goBrandGalleryDetail(brand_url: any, url: any) {
    this.router.navigate(['brand_galleries/' + brand_url + '/', url]);
  }

  goBrandGallery(){
    this.router.navigate(['brand_galleries/']);
  }

  goFreeKitchenForm() {
    this.router.navigate(['form/free_kitchen_designs/', this.kitchenDetail['id']]);
  }

}
