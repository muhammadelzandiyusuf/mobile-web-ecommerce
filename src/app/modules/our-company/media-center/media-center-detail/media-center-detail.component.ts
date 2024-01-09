import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MediaCenterService } from '../../../../service/media-center/media-center.service';
import { DomSanitizer, Meta, Title } from '../../../../../../node_modules/@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-media-center-detail',
  templateUrl: './media-center-detail.component.html',
  styleUrls: ['./media-center-detail.component.css']
})
export class MediaCenterDetailComponent implements OnInit {
  videoUrl: any;
  banner_type: any;
  title: any;
  subtitle_english: any;
  content_english: any;
  lang: any;
  subtitle_indonesia: any;
  content_indonesia: any;
  imageDomain: any;
  bannerPath: any;
  bannerImage: any;
  link: string;
  mediaImage: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private mediaCenterService: MediaCenterService,
    private sanitizer: DomSanitizer,
    private meta : Meta,
    private titleService: Title,
    private localSt:LocalStorageService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getDetailMedia(params['url']);     
    })
    this.lang = this.localSt.retrieve('lang');
  }

  media: any = [];

  ngOnInit() {
    
  }

  getDetailMedia(url: any){
    this.mediaCenterService.getMediaDetail(url)
    .subscribe((detail: any) => {
      this.media = detail['kitchenart']['results'];
      this.imageDomain = this.media['image_domain']
      this.bannerPath = this.media['banner_path']
      this.bannerImage = this.media['banner_image']
      this.banner_type = this.media['banner_type']
      this.title = this.media['title']
      this.subtitle_english = this.media['subtitle_english']
      this.subtitle_indonesia = this.media['subtitle_indonesia']
      this.content_english = this.media['content_english']
      this.content_indonesia = this.media['content_indonesia']

      this.link = this.media['web_domain'] + '/media_center_detail/' + url
      this.mediaImage = this.imageDomain + '/' + this.bannerPath + '/' + this.bannerImage;

      this.titleService.setTitle('KitchenArt - ' + this.title);

      if(this.media['banner_video']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.media['banner_video']);
      }

      if(this.media['meta_description'] != '' || this.media['meta_description'] != null){
        this.meta.updateTag(
          {name: 'description', content: this.media['meta_description']}
        );
      }
      
      if(this.media['meta_keyword'] != '' || this.media['meta_keyword'] != null){
        this.meta.updateTag(
          {name: 'keywords', content: this.media['meta_keyword']}
        );
      }
    });
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('url');   
  }

  goBack(): void {
    this.location.back();
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
    window.open('https://pinterest.com/pin/create/button/?url=' + this.link + '&media=' + this.mediaImage + '&description=' + this.title, '_blank');
  }

}
