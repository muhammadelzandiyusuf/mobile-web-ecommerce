import { Component, OnInit, HostListener } from '@angular/core';
import { ArchitectService } from '../../../../service/architect/architect.service';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-architect',
  templateUrl: './architect.component.html',
  styleUrls: ['./architect.component.css']
})
export class ArchitectComponent implements OnInit {

  selectedIndex: number = 1;
  id: number = 1;
  categories: any;
  architects: any = [];
  name: string;
  imageDomain: string
  thumbPath: string
  thumbImage: string
  url: string
  metaTag: any;

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  arrayArchitect: Array<any> = []
  lang: any;

  constructor(
    private architectService: ArchitectService,
    private termService: TermService,
    private router: Router,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Interior Designers & Architect Partners');
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

  ngOnInit() {
    this.getArchitectCategories()
    this.getArchitectByCategory(this.id)
    this.lang = this.localSt.retrieve('lang');
  }

  getArchitectCategories() {
    this.architectService.getArchitectCategory()
    .subscribe(category => {
      this.categories = category['kitchenart']['results']
    });
  }

  getArchitect(index: any, id: any){
    this.selectedIndex = index
    this.getArchitectByCategory(id)
  }

  getArchitectByCategory(id: any) {
    let sidx = 'id'
    let sort = 'asc'
    let limit = 10
    let start = 0

    this.architectService.getArchitectByCategory(id, sidx, sort, limit, start)
    .subscribe((architect: any) => {
      this.architects = architect['kitchenart']['results']
      this.arrayArchitect = architect['kitchenart']['results'];
    })
  }

  getDetailArchitect(url: any){
    this.router.navigate(['interior_designers_architect_partners/', url]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {

      if ((event.srcElement.scrollTop) >= (1227 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.architectService.getArchitectByCategory(this.id, sidx, sort, limit, offset)
          .subscribe((architect: any) => {
              this.arrayArchitect = this.arrayArchitect.concat(architect['kitchenart']['results'])
              this.architects = this.arrayArchitect
          });

          this.page++;
      }
  }

}
