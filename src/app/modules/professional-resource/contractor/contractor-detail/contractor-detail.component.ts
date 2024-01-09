import { Component, OnInit } from '@angular/core';
import { ContractorService } from '../../../../service/contractor/contractor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Lightbox } from 'ngx-lightbox';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-contractor-detail',
  templateUrl: './contractor-detail.component.html',
  styleUrls: ['./contractor-detail.component.css']
})
export class ContractorDetailComponent implements OnInit {

  contactProduct: boolean = false;
  contactForm: FormGroup;

  rchitect: any = [];
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
  contractorPortfolio: any = [];
  contractorAward: any = []
  metaTag: any;
  album: any = [];

  config: any = {};
  configPortfolio: any = {};
  contractor: any;

  status: any;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  lang: any;
  projectDeveloper: any;
  projectContractor: any;

  constructor(
    private contractorService: ContractorService,
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
      this.getContractorDetail(params['url']);     
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

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.album, index);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
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
    const contractor_id = this.contractor['id'];

    this.contractorService.createContractorContact(contractor_id, formModel)
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

  getContractorDetail(url: any) {
    this.contractorService.getContractorDetail(url)
    .subscribe((detail: any) => {
      this.contractor = detail['kitchenart']['results']
      this.name = this.contractor['name']
      this.subtitleEnglish = this.contractor['subtitle_english']
      this.subtitleIndonesia = this.contractor['subtitle_indonesia']
      this.contentEnglish = this.contractor['content_english']
      this.contentIndonesia = this.contractor['content_indonesia']
      this.imageDomain = this.contractor['image_domain']
      this.photoPath = this.contractor['photo_path']
      this.photoImage = this.contractor['photo_image']
      this.url = this.contractor['url']
      this.contractorPortfolio = this.contractor['contractor_portfolio']
      this.contractorAward = this.contractor['contractor_award']
      this.projectContractor = this.contractor['project_contractor']
      this.projectDeveloper = this.contractor['project_developer']

      let i = 1;
      if(this.contractorAward.length > 0){
        for (let photo of this.contractorAward) {
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

      let keyword = this.contractor['meta_keyword']
      let description = this.contractor['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.name);
    });
  }

  getPortfolioDetail(url: any) {
    this.router.navigate(['contractors_builders/portfolio/', url]);
  }

  goProject(url: any){
    this.router.navigate(['project_references/', url]);
  }

}
