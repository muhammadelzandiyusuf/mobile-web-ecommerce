import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { WineDineService } from '../../../service/wine-dine/wine-dine.service';
import { Lightbox } from 'ngx-lightbox';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-wine-dine-detail',
  templateUrl: './wine-dine-detail.component.html',
  styleUrls: ['./wine-dine-detail.component.css']
})
export class WineDineDetailComponent implements OnInit {

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
  videoUrl: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  photoPath: any;
  photoImage: any;

  configExhibition: any = {};
  location: any;
  cost: any;
  album: any = [];
  locationUrl: any;
  heightVideo: string;
  link: string;
  media: string;

  constructor(
    private wineDineService: WineDineService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private lightbox: Lightbox,
    private deviceService: DeviceDetectorService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getDetailWineDine(params['url'])
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
    this.epicFunction()
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

  getDetailWineDine(url: any) {
    this.wineDineService.getDetail(url)
    .subscribe((exhibition: any) => {
      this.exhibitions = exhibition['kitchenart']['results']
      this.imageDomain = this.exhibitions['image_domain']
      this.bannerPath = this.exhibitions['banner_path']
      this.bannerImage = this.exhibitions['banner_image']
      this.dateStart = this.exhibitions['date_start']
      this.dateEnd = this.exhibitions['date_end']
      this.timeOpen = this.exhibitions['time_open']
      this.timeClose = this.exhibitions['time_close']
      this.title = this.exhibitions['title']
      this.location = this.exhibitions['restaurant_name']
      this.locationUrl = this.exhibitions['restaurant_url']
      this.hosts = this.exhibitions['hosts']
      this.cost = this.exhibitions['cost']
      this.contentEnglish = this.exhibitions['content_english']
      this.photoPath = this.exhibitions['photo_path']
      this.photoImage = this.exhibitions['images']

      this.link = this.exhibitions['web_domain'] + '/recipes/' + url
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

  getDetailHost(url: any){
    this.router.navigate(['partner_chefs/', url]);
  }
  goLink(link: any): void {
    this.router.navigate(['cafe_resto/', link]);
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
