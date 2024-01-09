import { Component, OnInit, HostListener } from '@angular/core';
import { ExhibitionService } from '../../../../service/exhibition/exhibition.service';
import { TermService } from '../../../../service/term/term.service';
import { Router, ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-exhibition',
  templateUrl: './exhibition.component.html',
  styleUrls: ['./exhibition.component.css']
})
export class ExhibitionComponent implements OnInit {

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
  events = [
    {id:1, name:'Live Event'},
    {id:2, name:'Upcoming Event'},
    {id:3, name:'Past Event'}
  ]
  metaTag: any;

  constructor(
    private exhibitionService: ExhibitionService,
    private termService: TermService,
    private route: ActivatedRoute,
    private router: Router,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.route.params.subscribe(params => {
        this.getBannerTerm()
    })
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Exhibitions');
  }

  getMeta() {
    this.termService.getTagMeta()
    .subscribe(meta => {
        this.metaTag = meta['kitchenart']['results'];

        this.meta.addTags([
            {name: 'description', content: this.metaTag['meta_description']},
            {name: 'author', content: 'kitchenart.id'},
            {name: 'keywords', content: this.metaTag['meta_keyword']}
          ]);
    })
  }

  ngOnInit() {
    this.getLiveEvent()
  }

  getBannerTerm() {
    let slug = 'exhibitions'
    this.termService.getBannerTerms(slug)
    .subscribe(term => {
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

    this.exhibitionService.getExhibitionLiveEvent(sidx, sort, limit, start)
    .subscribe(exhibition => {
      this.exhibitionEvents = exhibition['kitchenart']['results']
      this.arrayEvent = exhibition['kitchenart']['results']
    })
  }

  getUpcomingEvent() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.exhibitionService.getExhibitionUpcomingEvent(sidx, sort, limit, start)
    .subscribe(exhibition => {
      this.exhibitionEvents = exhibition['kitchenart']['results']
      this.arrayEvent = exhibition['kitchenart']['results']
    })
  }

  getPastEvent() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.exhibitionService.getExhibitionPastEvent(sidx, sort, limit, start)
    .subscribe(exhibition => {
      this.exhibitionEvents = exhibition['kitchenart']['results']
      this.arrayEvent = exhibition['kitchenart']['results']
    })
  }

  getExhibition(event: string){
    this.selectedIndex = event
    if(event == 'Live Event'){
      this.getLiveEvent()
    }
    else if(event == 'Upcoming Event'){
      this.getUpcomingEvent()
    }
    else{
      this.getPastEvent()
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event:any): void {

      if ((event.srcElement.scrollTop) >= (1703 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          if(this.selectedIndex == 'Live Event'){
            this.exhibitionService.getExhibitionLiveEvent(sidx, sort, limit, offset)
            .subscribe(exhibition => {
              this.arrayEvent = this.arrayEvent.concat(exhibition['kitchenart']['results'])
              this.exhibitionEvents = this.arrayEvent
            })
          }
          else if(this.selectedIndex == 'Upcoming Event'){
            this.exhibitionService.getExhibitionUpcomingEvent(sidx, sort, limit, offset)
            .subscribe(exhibition => {
              this.arrayEvent = this.arrayEvent.concat(exhibition['kitchenart']['results'])
              this.exhibitionEvents = this.arrayEvent
            })
          }
          else{
            this.exhibitionService.getExhibitionPastEvent(sidx, sort, limit, offset)
            .subscribe(exhibition => {
              this.arrayEvent = this.arrayEvent.concat(exhibition['kitchenart']['results'])
              this.exhibitionEvents = this.arrayEvent
            })
          }
        
          this.page++;
      }
  }

}
