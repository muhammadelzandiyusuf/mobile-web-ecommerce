import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../../../service/video/video.service';
import { TermService } from '../../../../service/term/term.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  metaTag: any;
  videos: any;
  lang: any;

  constructor(
    private videoService: VideoService,
    private termService: TermService,
    private router: Router,
    private meta: Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) {
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - Videos');
  }

  ngOnInit() {
    this.getVideos()
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

  getVideos() {
    let sidx = 'id'
    let sort = 'asc'
    let limit = 10
    let start = 0

    this.videoService.getVideoPlaylist(sidx, sort, limit, start)
      .subscribe((videos: any) => {
        this.videos = videos['kitchenart']['results']
      })
  }

  getListVideo(url: any) {
    this.router.navigate(['videos/list/', url]);
  }

}
