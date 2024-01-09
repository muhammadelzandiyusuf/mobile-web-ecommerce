import { Component, OnInit } from '@angular/core';
import { ArchitectService } from '../../../../service/architect/architect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Lightbox } from 'ngx-lightbox';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-architect-detail',
  templateUrl: './architect-detail.component.html',
  styleUrls: ['./architect-detail.component.css']
})
export class ArchitectDetailComponent implements OnInit {

  contactProduct: boolean = false;
  contactForm: FormGroup;

  architect: any = [];
  name: string
  nameIndonesia: string
  nameEnglish: string
  subtitleEnglish: string
  subtitleIndonesia: string
  contentEnglish: string
  contentIndonesia: string
  imageDomain: string
  photoPath: string
  photoImage: string
  metaDescription: string
  metaKeyword: string
  url: string
  architectPortfolio: any = [];
  architectAward: any = []
  metaTag: any;
  album: any = [];

  config: any = {};
  configPortfolio: any = {};
  
  status: any;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  lang: any;
  projectPreference: any;

  constructor(
    private arhitectService: ArchitectService,
    private route: ActivatedRoute,
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private toastr: ToastrService,
    private lightbox: Lightbox,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService
  ) { 
    this.createForm();
    this.lang = this.localSt.retrieve('lang');
    this.route.params.subscribe((params: any) => {
      this.getArchitectDetail(params['url']);     
    })
  }

  ngOnInit() {
    this.epicFunction()
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
    
      this.configPortfolio = {
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
    
      this.configPortfolio = {
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
    const architect_id = this.architect['id'];

    this.arhitectService.createArchitectContact(architect_id, formModel)
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

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.album, index);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  getArchitectDetail(url: any) {
    this.arhitectService.getArchitectDetail(url)
    .subscribe((detail: any) => {
      this.architect = detail['kitchenart']['results']
      this.name = this.architect['name']
      this.nameIndonesia = this.architect['category_name_indonesia']
      this.nameEnglish = this.architect['category_name_english']
      this.subtitleEnglish = this.architect['subtitle_english']
      this.subtitleIndonesia = this.architect['subtitle_indonesia']
      this.contentEnglish = this.architect['content_english']
      this.contentIndonesia = this.architect['content_indonesia']
      this.imageDomain = this.architect['image_domain']
      this.photoPath = this.architect['photo_path']
      this.photoImage = this.architect['photo_image']
      this.url = this.architect['url']
      this.architectPortfolio = this.architect['architect_portfolio']
      this.architectAward = this.architect['architect_award']
      this.projectPreference = this.architect['project_preference']

      let i = 1;
      if(this.architectAward.length > 0){
        for (let photo of this.architectAward) {
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

      let keyword = this.architect['meta_keyword']
      let description = this.architect['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.name);
    });
  }

  getPortfolioDetail(url: any) {
    this.router.navigate(['interior_designers_architect_partners/portfolio/', url]);
  }

  goProject(url: any){
    this.router.navigate(['project_references/', url]);
  }

}
