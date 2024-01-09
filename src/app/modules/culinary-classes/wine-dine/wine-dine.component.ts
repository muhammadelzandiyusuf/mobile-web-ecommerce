import { Component, OnInit, HostListener } from '@angular/core';
import { WineDineService } from '../../../service/wine-dine/wine-dine.service';
import { TermService } from '../../../service/term/term.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-wine-dine',
  templateUrl: './wine-dine.component.html',
  styleUrls: ['./wine-dine.component.css']
})
export class WineDineComponent implements OnInit {

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  arrayEvent: Array<any> = []
  exhibitionEvents: Array<any> = []
  term: any;
  assetDomain: any;
  bannerPath: any;
  bannerImage: any;

  selectedIndex: string = 'Live Event'
  events: any = [
    { id: 1, name: 'Live Event' },
    { id: 2, name: 'Upcoming Event' },
    { id: 3, name: 'Past Event' }
  ]
  metaTag: any;

  constructor(
    private wineDineService: WineDineService,
    private termService: TermService,
    private route: ActivatedRoute,
    private meta: Meta,
    private titleService: Title
  ) {
    this.route.params.subscribe((params: any) => {
      this.getBannerTerm()
    })
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Wine & food');
  }

  ngOnInit() {
    this.getLiveEvent()
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

  getBannerTerm() {
    let slug = 'wine_dine'
    this.termService.getBannerTerms(slug)
      .subscribe((term: any) => {
        this.term = term['kitchenart']['results']
        this.assetDomain = this.term['image_domain']
        this.bannerPath = this.term['banner_path']
        this.bannerImage = this.term['banner_image']
      })
  }

  getLiveEvent() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.wineDineService.getLiveEvent(sidx, sort, limit, start)
      .subscribe((exhibition: any) => {
        this.exhibitionEvents = exhibition['kitchenart']['results']
        this.arrayEvent = exhibition['kitchenart']['results']
      })
  }

  getUpcomingEvent() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.wineDineService.getUpcomingEvent(sidx, sort, limit, start)
      .subscribe((exhibition: any) => {
        this.exhibitionEvents = exhibition['kitchenart']['results']
        this.arrayEvent = exhibition['kitchenart']['results']
      })
  }

  getPastEvent() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.wineDineService.getPastEvent(sidx, sort, limit, start)
      .subscribe((exhibition: any) => {
        this.exhibitionEvents = exhibition['kitchenart']['results']
        this.arrayEvent = exhibition['kitchenart']['results']
      })
  }

  getExhibition(event: string) {
    this.selectedIndex = event
    if (event == 'Live Event') {
      this.getLiveEvent()
    }
    else if (event == 'Upcoming Event') {
      this.getUpcomingEvent()
    }
    else {
      this.getPastEvent()
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {

    if ((event.srcElement.scrollTop) >= (1623 * this.page)) {
      this.offset = this.offset + this.limit;
      const sidx = 'id';
      const sort = 'asc';
      const limit = this.limit;
      const offset = this.offset;

      if (this.selectedIndex == 'Live Event') {
        this.wineDineService.getLiveEvent(sidx, sort, limit, offset)
          .subscribe(exhibition => {
            this.arrayEvent = this.arrayEvent.concat(exhibition['kitchenart']['results'])
            this.exhibitionEvents = this.arrayEvent
          })
      }
      else if (this.selectedIndex == 'Upcoming Event') {
        this.wineDineService.getUpcomingEvent(sidx, sort, limit, offset)
          .subscribe(exhibition => {
            this.arrayEvent = this.arrayEvent.concat(exhibition['kitchenart']['results'])
            this.exhibitionEvents = this.arrayEvent
          })
      }
      else {
        this.wineDineService.getPastEvent(sidx, sort, limit, offset)
          .subscribe(exhibition => {
            this.arrayEvent = this.arrayEvent.concat(exhibition['kitchenart']['results'])
            this.exhibitionEvents = this.arrayEvent
          })
      }

      this.page++;
    }
  }

}
