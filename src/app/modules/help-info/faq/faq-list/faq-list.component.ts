import { Component, OnInit, HostListener } from '@angular/core';
import { FaqService } from '../../../../service/faq/faq.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css']
})
export class FaqListComponent implements OnInit {
  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  category: any;
  titleEnglish: any;
  titleIndonesia: any;
  arrayFaq: Array<any> = []
  faqs: any;
  category_id: any;
  url: any;
  term: any;
  termNameIndo: any;
  termNameEng: any;
  lang: any;

  constructor(
    private faqService: FaqService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private localSt: LocalStorageService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getTermFaq()
      this.getDetailCategoryFaq(params['url']);
    })
    this.lang = this.localSt.retrieve('lang');
  }

  ngOnInit() {
  }

  getMeta(keyword: any, description: any) {
    this.termService.getTagMeta()
    .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];
        if(keyword == '' || keyword == null){
          this.metaKeyword = this.metaTag['meta_keyword']
        }
        else{
          this.metaKeyword = keyword
        }

        if(description == '' || description == null){
          this.metaDescription = this.metaTag['meta_description']
        }
        else{
          this.metaDescription = description
        }

        this.meta.updateTag(
          {name: 'description', content: this.metaDescription}
        );

        this.meta.updateTag(
          {name: 'keywords', content: this.metaKeyword}
        );

        this.meta.updateTag({
          name: 'author', content: 'kitchenart.id'
        })
        
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

  getDetailCategoryFaq(url: any) {
    this.faqService.getCategoryFaqDetail(url)
    .subscribe((category: any) => {
      this.category = category['kitchenart']['results']
      this.category_id = this.category['id']
      this.titleEnglish = this.category['title_english']
      this.titleIndonesia = this.category['title_indonesia']
      this.url = this.category['url']

      let keyword = this.category['meta_keyword']
      let description = this.category['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - Frequently Asked Questions');

      this.getListFaq()
    })
  }

  getListFaq() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.faqService.getFaq(this.category_id, sidx, sort, limit, start)
    .subscribe((faqCategory: any) => {
      this.faqs = faqCategory['kitchenart']['results']
      this.arrayFaq = faqCategory['kitchenart']['results']
    });
  }

  getDetailFaq(url: any): void {
    this.router.navigate(['faq/' + this.url + '/', url]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
      if ((event.srcElement.scrollTop) >= (59 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'position';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.faqService.getFaq(this.category_id, sidx, sort, limit, offset)
          .subscribe((faqCategory: any) => {
              this.arrayFaq = this.arrayFaq.concat(faqCategory['kitchenart']['results'])
              this.faqs = this.arrayFaq
          });

          this.page++;
      }
  }

}
