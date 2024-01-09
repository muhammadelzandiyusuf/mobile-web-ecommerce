import { Component, OnInit, HostListener } from '@angular/core';
import { FaqService } from '../../../../service/faq/faq.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  metaTag: any;
  term: any;
  termNameIndo: any;
  termNameEng: any;
  faqs: any;
  arrayFaq: Array<any> = []
  lang: any;

  constructor(
    private faqService: FaqService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private localSt: LocalStorageService
  ) { 
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - Frequently Asked Questions');
  }

  ngOnInit() {
    this.getTermFaq()
    this.getFaqCategories()
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

  getTermFaq() {
    let slug = 'faq'
    this.termService.getBannerTerms(slug)
    .subscribe((term: any) => {
        this.term = term['kitchenart']['results']
        this.termNameIndo = this.term['name_indonesia']
        this.termNameEng = this.term['name_english']
    })  
  }

  getFaqCategories() {
    let sidx = 'position';
    let sort = 'asc';
    let limit = 30;
    let start = 0;

    this.faqService.getCategoryFaq(sidx, sort, limit, start)
    .subscribe((faqCategory: any) => {
      this.faqs = faqCategory['kitchenart']['results']
      this.arrayFaq = faqCategory['kitchenart']['results']
    });
  }

  getDetailCategory(url: any): void {
    this.router.navigate(['faq/', url]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
      if ((event.srcElement.scrollTop) >= (71 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'position';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.faqService.getCategoryFaq(sidx, sort, limit, offset)
          .subscribe((faqCategory: any) => {
              this.arrayFaq = this.arrayFaq.concat(faqCategory['kitchenart']['results'])
              this.faqs = this.arrayFaq
          });

          this.page++;
      }
  }

}
