import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../../../service/faq/faq.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-faq-detail',
  templateUrl: './faq-detail.component.html',
  styleUrls: ['./faq-detail.component.css']
})
export class FaqDetailComponent implements OnInit {
  term: any;
  termNameIndo: any;
  termNameEng: any;
  faq: any;
  titleEnglish: any;
  titleIndonesia: any;
  contentEnglish: any;
  contentIndonesia: any;
  url: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  category: any;
  titleCategoryEnglish: any;
  titleCategoryIndonesia: any;
  relateds: any;
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
      this.getTermFaq();
      this.getDetailFaq(params['url']);
      this.getDetailCategoryFaq(params['category']);
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
      this.titleCategoryEnglish = this.category['title_english']
      this.titleCategoryIndonesia = this.category['title_indonesia']
      this.url = this.category['url']
    })
  }

  getDetailFaq(url: any) {
    this.faqService.getFaqDetail(url)
    .subscribe((faq: any) => {
      this.faq = faq['kitchenart']['results']
      this.titleEnglish = this.faq['title_english']
      this.titleIndonesia = this.faq['title_indonesia']
      this.contentEnglish = this.faq['content_english']
      this.contentIndonesia = this.faq['content_indonesia']
      this.url = this.faq['url']
      this.relateds = this.faq['related_questions']

      let keyword = this.faq['meta_keyword']
      let description = this.faq['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - Frequently Asked Questions');
    })
  }

  getDetailFaqRelated(url: any) {
    this.router.navigate(['faq/' + this.url + '/', url]);
  }

}
