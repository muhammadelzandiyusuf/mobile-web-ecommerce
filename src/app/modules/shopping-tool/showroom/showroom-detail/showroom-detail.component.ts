import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ShowroomService } from '../../../../service/showroom/showroom.service';
import { DomSanitizer, Meta, Title } from '../../../../../../node_modules/@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '../../../../../../node_modules/@angular/forms';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { DatePipe } from '../../../../../../node_modules/@angular/common';
import { TermService } from '../../../../service/term/term.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-showroom-detail',
  templateUrl: './showroom-detail.component.html',
  styleUrls: ['./showroom-detail.component.css']
})
export class ShowroomDetailComponent implements OnInit {

  showrooms: any = [];
  videoUrl: any;
  lat: number;
  lng: number;

  dateTimeExample: any;

  contactProduct: boolean = false;
  scheduleForm: FormGroup;
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

  configExhibition: any = {
    slidesPerView: 2,
    spaceBetween: 5,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  images: any;
  name: any;
  address: any;
  phone: any;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  status: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  cookingClass: any;
  imageDomain: any;
  heightVideo: string;

  constructor(
    private route: ActivatedRoute,
    private showroomService: ShowroomService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {
    this.createForm();
    this.route.params.subscribe((params: any) => {
      this.getDetailShowroom(params['url']);     
    })
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
  }

  epicFunction() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if(isMobile){
      this.heightVideo = "250px"
    }
    else if(isTablet){
      this.heightVideo = "500px"
    }
  }

  createForm() {
    this.scheduleForm = new FormGroup({
      full_name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      visit_date: new FormControl('', Validators.required)
    });
  }

  saveShowroomSchedule() {
    const formModel = this.scheduleForm.value;
    const showroom_id = this.showrooms['id'];
    const dateVisit = this.pipe.transform(formModel['visit_date'], 'yyyy-MM-dd HH:mm:ss');

    this.showroomService.postShowroomSchedule(formModel, dateVisit, showroom_id)
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

  getDetailShowroom(url: any) {
    this.showroomService.getShowroomDetails(url)
    .subscribe((showroom: any) => {
      this.showrooms = showroom['kitchenart']['results'];
      this.lat = this.showrooms['latitude'];
      this.lng = this.showrooms['longitude'];
      this.images = this.showrooms['images'];
      this.name = this.showrooms['name'];
      this.address = this.showrooms['address'];
      this.phone = this.showrooms['phone'];
      this.cookingClass = this.showrooms['events']
      this.imageDomain = this.showrooms['image_domain']
      if(this.showrooms['video_url']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.showrooms['video_url']);
      }

      let keyword = this.showrooms['meta_keyword']
      let description = this.showrooms['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.name);
    });
  }

  popupContact() {
    this.contactProduct = true;
  }

  closePopupContact() {
    this.contactProduct = false;
  }

  showSuccess() {
    this.toastr.success('Message Send');
    this.createForm();
    this.contactProduct = false;
  }

  showError() {
    this.toastr.error('Message Can Not Send');
  }

  getCookingClass(link: any){
    this.router.navigate(['cooking_class_demo/', link]);
  }

}
