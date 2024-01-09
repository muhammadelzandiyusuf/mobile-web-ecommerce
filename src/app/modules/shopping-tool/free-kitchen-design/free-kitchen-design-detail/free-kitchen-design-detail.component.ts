import { Component, OnInit } from '@angular/core';
import { FreeKitchenDesignService } from '../../../../service/free-kitchen-design/free-kitchen-design.service';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-free-kitchen-design-detail',
  templateUrl: './free-kitchen-design-detail.component.html',
  styleUrls: ['./free-kitchen-design-detail.component.css']
})
export class FreeKitchenDesignDetailComponent implements OnInit {
  freeKitchen: any = [];

  image_domain: string;
  banner_image: string;
  title: any;
  content_english: any;
  banner_path: any;
  kitchen_products: any = [];

  config: any = {
    slidesPerView: 3,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  lang: any;
  content_indonesia: any;

  constructor(
    private kitchenDesignService: FreeKitchenDesignService,
    private route: ActivatedRoute,
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) { 
    this.route.params.subscribe(params => {
      this.getFreeKitchenDesignDetail(params['url']);     
    })
    this.lang = this.localSt.retrieve('lang');
  }

  getMeta(keyword:string, description:string) {
    this.termService.getTagMeta()
    .subscribe(meta => {
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

  ngOnInit() {
  }

  getFreeKitchenDesignDetail(url:string) {
    this.kitchenDesignService.getKitchenDesignDetail(url)
    .subscribe(freeKitchen => {
      this.freeKitchen = freeKitchen['kitchenart']['results'];
      this.image_domain = this.freeKitchen['image_domain']
      this.banner_path = this.freeKitchen['banner_path']
      this.banner_image = this.freeKitchen['banner_image']
      this.title = this.freeKitchen['title']
      this.content_english = this.freeKitchen['content_english']
      this.content_indonesia = this.freeKitchen['content_indonesia']
      this.kitchen_products = this.freeKitchen['kitchen_products']
      
      let keyword = this.freeKitchen['meta_keyword']
      let description = this.freeKitchen['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.title);
    })
  }

  goProductDetail(url:string){
    this.router.navigate(['base/', url]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

}
