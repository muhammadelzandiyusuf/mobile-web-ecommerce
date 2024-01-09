import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../../../service/video/video.service';
import { TermService } from '../../../../service/term/term.service';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit {
  videos: any;
  title: any;
  videoUrl: any;
  descriptionIndonesia: any;
  descriptionEnglish: any;
  metaTag: any;
  lang: any;
  heightVideo: string;

  constructor(
    private videoService: VideoService,
    private termService: TermService,
    private route: ActivatedRoute,
    private meta: Meta,
    private titleService: Title,
    private sanitizer: DomSanitizer,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService
  ) {
    this.route.params.subscribe((params: any) => {
      this.getMeta()
      this.getVideoDetail(params['id']);     
    })
    this.lang = this.localSt.retrieve('lang');
  }

  ngOnInit() {
    this.epicFunction()
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

  getMeta() {
    this.termService.getTagMeta()
      .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];

        this.meta.addTags([
          { name: 'description', content: this.metaTag['meta_description'] },
          { name: 'author', content: 'kitchenart.id' },
          { name: 'keywords', content: this.metaTag['meta_keyword'] }
        ]);
      })
  }

  getVideoDetail(id: any) {
    this.videoService.getVideoDetail(id)
    .subscribe((detail: any) => {
      this.videos = detail['kitchenart']['results']
      this.title = this.videos['title']
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videos['video_url'])
      this.descriptionIndonesia = this.videos['description_indonesia']
      this.descriptionEnglish = this.videos['description_english']

      this.titleService.setTitle('KitchenArt - ' + this.title);
    });
  }

}
