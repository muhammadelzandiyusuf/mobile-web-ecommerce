import { Component, OnInit, HostListener } from '@angular/core';
import { VideoService } from '../../../../service/video/video.service';
import { TermService } from '../../../../service/term/term.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Video } from '../../../../service/video/video';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  videos: any;
  title: any;
  titleEnglish: any;
  titleIndonesia: any;
  url: any;
  listVideo: any;

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  arrayVideo: Array<any> = []
  paramUrl: string
  lang: any;

  constructor(
    private videoService: VideoService,
    private route: ActivatedRoute,
    private termService: TermService,
    private router: Router,
    private meta: Meta,
    private titleService: Title,
    private localSt: LocalStorageService  ) {
    this.route.params.subscribe(params => {
      this.paramUrl = params['url']
      this.getVideoList(params['url']);
      this.lang = this.localSt.retrieve('lang');
    })
  }

  ngOnInit() {
  }

  getMeta(keyword: any, description: any) {
    this.termService.getTagMeta()
      .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];
        if (keyword == '' || keyword == null) {
          this.metaKeyword = this.metaTag['meta_keyword']
        }
        else {
          this.metaKeyword = keyword
        }

        if (description == '' || description == null) {
          this.metaDescription = this.metaTag['meta_description']
        }
        else {
          this.metaDescription = description
        }

        this.meta.updateTag(
          { name: 'description', content: this.metaDescription }
        );

        this.meta.updateTag(
          { name: 'keywords', content: this.metaKeyword }
        );

        this.meta.updateTag({
          name: 'author', content: 'kitchenart.id'
        })

      })
  }

  embedVideo: Video[] = [];

  getVideoList(url: any) {
    this.videoService.getVideoByPlaylist(url)
      .subscribe((detail: any) => {
        this.videos = detail['kitchenart']['results']
        this.titleEnglish = this.videos['title_english']
        this.titleIndonesia = this.videos['title_indonesia']
        this.url = this.videos['url']
        this.listVideo = this.videos['videos']

        for (let object of this.listVideo) {
          this.embedVideo.push(
            {
              'id': object.id,
              'playlist_id': object.playlist_id,
              'title': object.title,
              'embed_url': object.video_url.replace('https://www.youtube.com/embed/', ''),
              'description_english': object.description_english,
              'description_indonesia': object.description_indonesia
            }
          )
        }

        let keyword = this.videos['meta_keyword']
        let description = this.videos['meta_description']
        this.getMeta(keyword, description)

        this.titleService.setTitle('KitchenArt - ' + this.titleEnglish);
      });
  }

  getDetailVideo(id: any) {
    this.router.navigate(['videos/detail/', id]);
  }

  // @HostListener('scroll', ['$event'])
  // onScroll(event: any): void {
  //   if ((event.srcElement.scrollTop) >= (1010 * this.page)) {
  //     this.offset = this.offset + this.limit;
  //     const sidx = 'id';
  //     const sort = 'asc';
  //     const limit = this.limit;
  //     const offset = this.offset;

  //     this.videoService.getVideoPlaylistScrool(this.paramUrl, sidx, sort, limit, offset)
  //       .subscribe((detail: any) => {
  //         this.videos = detail['kitchenart']['results']
  //         this.titleEnglish = this.videos['title_english']
  //         this.titleIndonesia = this.videos['title_indonesia']
  //         this.url = this.videos['url']
  //         this.listVideo = this.videos['videos']

  //         for (let object of this.listVideo) {
  //           this.embedVideo.push(
  //             {
  //               'id': object.id,
  //               'playlist_id': object.playlist_id,
  //               'title': object.title,
  //               'embed_url': object.video_url.replace('https://www.youtube.com/embed/', ''),
  //               'description_english': object.description_english,
  //               'description_indonesia': object.description_indonesia
  //             }
  //           )
  //         }
  //       });

  //     this.page++;
  //   }
  // }

}
