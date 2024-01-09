import { Component, OnInit, HostListener } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { Router } from '@angular/router';
import { InstallationVideoService } from '../../../../service/installation-video/installation-video.service';
import { Videos } from '../../../../service/installation-video/videos';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-installation-video',
  templateUrl: './installation-video.component.html',
  styleUrls: ['./installation-video.component.css']
})
export class InstallationVideoComponent implements OnInit {

  filterCategoryArr: any = [];
  public formModalCategory = false;

  metaTag: any;
  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  installationVideos: Array<any> = []
  arrayInstallationVideo: Array<any> = []
  categories: any;
  embedVideo: Videos[] = [];
  videoList: Videos[];
  lang: any;

  constructor(
    private router: Router,
    private installationVideoService: InstallationVideoService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) { 
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - Installation & Videos');
  }

  ngOnInit() {
    this.getInstallationVideoCategory()
    this.getInstallationVideo()
  }

  getMeta() {
    this.termService.getTagMeta()
    .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];

        this.meta.addTags([
            {name: 'description', content: this.metaTag['meta_description']},
            {name: 'author', content: 'kitchenart.id'},
            {name: 'keywords', content: this.metaTag['meta_keyword']}
          ]);
    })
  }

  getInstallationVideoCategory() {
    this.installationVideoService.getInstallationVideoCategory()
    .subscribe((installationVideo: any) => {
        this.categories = installationVideo['kitchenart']['results'];
    })
  }

  getFilterCategory(): void {
    this.formModalCategory = true;
  }

  closeModal(): void{
    this.getInstallationVideo()
    this.formModalCategory = false;
    this.page = 1
    this.offset = 0
  }

  getInstallationVideo() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.installationVideoService.getInstallationVideo(sidx, sort, limit, start, this.filterCategoryArr)
    .subscribe((installationVideo: any) => {
      this.installationVideos = installationVideo['kitchenart']['results'];
      this.embedVideo = []
      for (let object of this.installationVideos) {
        this.embedVideo.push(
          {
            'id': object.id,
            'title': object.title,
            'embed_url': object.embed_url.replace('https://www.youtube.com/embed/', '')
          }
        )
      }

      this.videoList = this.embedVideo

    });
  }

  getDetailVideo(id: any) {
    this.router.navigate(['installation_video/', id]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
      if ((event.srcElement.scrollTop) >= (133 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.installationVideoService.getInstallationVideo(sidx, sort, limit, offset, this.filterCategoryArr)
          .subscribe((installationVideo: any) => {
              this.installationVideos = installationVideo['kitchenart']['results']

              for (let object of this.installationVideos) {
                this.embedVideo.push(
                  {
                    'id': object.id,
                    'title': object.title,
                    'embed_url': object.video_url.replace('https://www.youtube.com/embed/', '')
                  }
                )
              }

              this.videoList = this.embedVideo
          });

          this.page++;
      }
  }

}
