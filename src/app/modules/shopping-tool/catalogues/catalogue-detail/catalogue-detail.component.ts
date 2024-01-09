import { Component, OnInit } from '@angular/core';
import { CatalogueService } from '../../../../service/catalogue/catalogue.service';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { DomSanitizer, Meta, Title } from '../../../../../../node_modules/@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';

@Component({
  selector: 'app-catalogue-detail',
  templateUrl: './catalogue-detail.component.html',
  styleUrls: ['./catalogue-detail.component.css']
})
export class CatalogueDetailComponent implements OnInit {
  videoUrl: any = null;
  brandName: any;
  title: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;

  constructor(
    private catalogueService: CatalogueService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getDetailCatalogue(params['url']);     
    })
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

  catalogueDetail: any;

  ngOnInit() {
  }

  getDetailCatalogue(url: any){
    this.catalogueService.getCatalogueDetail(url)
    .subscribe((detail: any) => {
      this.catalogueDetail = detail['kitchenart']['results'];
      this.brandName = this.catalogueDetail['brand_name'];
      this.title = this.catalogueDetail['title'];
      if(this.catalogueDetail['document_url']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.catalogueDetail['document_url']);
      }
      let keyword = this.catalogueDetail['meta_keyword']
      let description = this.catalogueDetail['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.title);
    });
  }

}
