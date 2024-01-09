import { Component, OnInit } from '@angular/core';
import { MediaCenterService } from '../../../../service/media-center/media-center.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';

@Component({
  selector: 'app-media-center',
  templateUrl: './media-center.component.html',
  styleUrls: ['./media-center.component.css']
})
export class MediaCenterComponent implements OnInit {
  metaTag: any;

  constructor(
    private router: Router,
    private mediaCenterService: MediaCenterService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Media Center');
  }

  years: any = [];
  medias: any = [];
  selectedIndex: number = 2018;

  ngOnInit() {
    this.getYearMedia();
    this.getListMediaCenter();
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

  getYearMedia() {
    this.mediaCenterService.getYearMediaCenter()
    .subscribe((year: any) => {
      this.years = year['kitchenart']['results'];
    });
  }

  getListMediaCenter() {
    let year = '2018';
    let sidx = 'id';
    let sort = 'desc';
    let limit = 10;
    let start = 0;

    this.mediaCenterService.getMediaList(year, sidx, sort, limit, start)
    .subscribe((media: any) => {
      this.medias = media['kitchenart']['results'];
    })
  }

  getMedia(year: any){
    this.selectedIndex = year;
    let sidx = 'id';
    let sort = 'desc';
    let limit = 10;
    let start = 0;

    this.mediaCenterService.getMediaList(year, sidx, sort, limit, start)
    .subscribe((media: any) => {
      this.medias = media['kitchenart']['results'];
    })
  }

  getDetail(url: any) {
    this.router.navigate(['media_center/', url]);
  }

}
