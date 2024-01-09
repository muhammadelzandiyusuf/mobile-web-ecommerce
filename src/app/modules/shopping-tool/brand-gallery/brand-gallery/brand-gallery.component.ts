import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../../service/brand/brand.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';


@Component({
  selector: 'app-brand-gallery',
  templateUrl: './brand-gallery.component.html',
  styleUrls: ['./brand-gallery.component.css']
})
export class BrandGalleryComponent implements OnInit {

  brands: any = [];
  metaTag: any;

  constructor(
    private brandService: BrandService,
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Brand Gallery');
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
    this.getBrandGallery();
  }

  getBrandGallery() {
    let publish = 'T';
    let navbaronly = 'F';
    let sidx = 'id';
    let sort = 'asc';

    this.brandService.getBrands(publish, navbaronly, sidx, sort)
    .subscribe((brand: any) => {
      this.brands = brand['kitchenart']['results'];
    });
  }

  goDetail(url: any) {
    this.router.navigate(['brand_galleries/', url]);
  }

}
