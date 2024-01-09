import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { ExhibitionService } from '../../../../service/exhibition/exhibition.service';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';

import { Lightbox } from 'ngx-lightbox';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-exhibition-detail',
  templateUrl: './exhibition-detail.component.html',
  styleUrls: ['./exhibition-detail.component.css']
})
export class ExhibitionDetailComponent implements OnInit {

  exhibitions: any;
  imageDomain: any;
  bannerPath: any;
  bannerImage: any;
  dateStart: any;
  dateEnd: any
  timeOpen: any
  timeClose: any
  title: any
  hosts: any  
  contentEnglish: any;
  location: any;
  lat: number;
  lng: number;
  videoUrl: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  photoPath: any;
  photoImage: any;
  album: any = [];

  configExhibition: any = {};
  lang: any;
  contentIndonesia: any;
  heightVideo: string;
  link: string;
  media: string;

  constructor(
    private exhibitionService: ExhibitionService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private lightbox: Lightbox,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService
  ) { 
    this.route.params.subscribe(params => {
      this.getDetailExhibition(params['url'])
    })
    this.lang = this.localSt.retrieve('lang');
  }

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.album, index);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
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

  ngOnInit() {
    this.epicFunction();
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

  getDetailExhibition(url: string) {
    this.exhibitionService.getExhibitionDetail(url)
    .subscribe(exhibition => {
      this.exhibitions = exhibition['kitchenart']['results']
      this.imageDomain = this.exhibitions['image_domain']
      this.bannerPath = this.exhibitions['banner_path']
      this.bannerImage = this.exhibitions['banner_image']
      this.dateStart = this.exhibitions['date_start']
      this.dateEnd = this.exhibitions['date_end']
      this.timeOpen = this.exhibitions['time_open']
      this.timeClose = this.exhibitions['time_close']
      this.title = this.exhibitions['title']
      this.hosts = this.exhibitions['hosts']
      this.contentEnglish = this.exhibitions['content_english']
      this.contentIndonesia = this.exhibitions['content_indonesia']
      this.location = this.exhibitions['location']
      this.lat = this.exhibitions['latitude'];
      this.lng = this.exhibitions['longitude'];
      this.photoPath = this.exhibitions['photo_path']
      this.photoImage = this.exhibitions['photo_images']

      this.link = this.exhibitions['web_domain'] + '/exhibitions/' + url
      this.media = this.imageDomain + '/' + this.bannerPath + '/' + this.bannerImage;

      let i = 1;
      for (let photo of this.photoImage) {
        const src = this.imageDomain + '/' + this.photoPath + '/' + photo['image'];
        const caption = this.title + ' ' + i;
        const thumb = this.imageDomain + '/' + this.photoPath + '/' + photo['image'];
        const album = {
           src: src,
           caption: caption,
           thumb: thumb
        };
  
        this.album.push(album);
        i++
      }

      if(this.exhibitions['video_url']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.exhibitions['video_url']);
      }

      let keyword = this.exhibitions['meta_keyword']
      let description = this.exhibitions['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.title);
    })
  }

  getDetailHost(url: string){
    this.router.navigate(['partner_chefs/', url]);
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
