import { Component, OnInit } from '@angular/core';
import { ProductManualService } from '../../../../service/product-manual/product-manual.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';

@Component({
  selector: 'app-product-manual-detail',
  templateUrl: './product-manual-detail.component.html',
  styleUrls: ['./product-manual-detail.component.css']
})
export class ProductManualDetailComponent implements OnInit {

  videoUrl: any = null;
  categoryName: any;
  title: any;
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  productManualDetail: any;

  constructor(
    private productManualService: ProductManualService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getDetailProductManual(params['url']);  
      this.getMeta()
      this.titleService.setTitle('KitchenArt - Product Manual');
    })
  }

  ngOnInit() {
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

  getDetailProductManual(url: any){
    this.productManualService.getProductManualDetail(url)
    .subscribe((detail: any) => {
      this.productManualDetail = detail['kitchenart']['results'];
      this.categoryName = this.productManualDetail['category_title'];
      this.title = this.productManualDetail['title'];
      if(this.productManualDetail['document_url']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.productManualDetail['document_url']);
      }
    });
  }

}
