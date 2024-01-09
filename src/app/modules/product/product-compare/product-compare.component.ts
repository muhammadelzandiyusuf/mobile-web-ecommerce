import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../../service/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';

@Component({
  selector: 'app-product-compare',
  templateUrl: './product-compare.component.html',
  styleUrls: ['./product-compare.component.css']
})
export class ProductCompareComponent implements OnInit {

  product_detail: object = [];
  specification: object = [];
  product_detail_2: object = [];
  specification_2: object = [];

  first_id: number;
  second_id: number;
  category: string;

  product_able: object = [];
  specifications: any;
  specifications_2: any;
  metaTag: any;

  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) {
    this.route.params.subscribe((params: any) => {
      this.category = params['url'];
      this.getProductAbleCompare(params['url']);    
    })

    this.getMeta()
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
    this.titleService.setTitle('KitchenArt - Product Compare');
  }

  getDetailProduct(id: any): void {
    this.productService.getProductCompare(id)
    .subscribe((product: any) => {
      this.product_detail = product['kitchenart']['results'];
      this.specification = this.product_detail['specification'];
      this.specifications = this.product_detail['specification'];
    });
  }

  getProductAbleCompare(category: any): void {
    this.productService.getProductAbleToCompare(category, this.first_id, this.second_id)
    .subscribe((product: any) => {
      this.product_able = product['kitchenart']['results'];
    });
  }

  getFirstProduct(product_id: any): void{
    this.productService.getProductCompare(product_id)
    .subscribe((product: any) => {
      this.product_detail = product['kitchenart']['results'];
      this.specification = this.product_detail['specification'];
      this.specifications = this.product_detail['specification'];
    });
  }

  getSecondProduct(product_id: any): void{
    this.productService.getProductCompare(product_id)
    .subscribe((product: any) => {
      this.product_detail_2 = product['kitchenart']['results'];
      this.specification_2 = this.product_detail_2['specification'];
      this.specifications_2 = this.product_detail_2['specification'];
    });
  }

}
