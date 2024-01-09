import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {ProductService} from '../../../service/product/product.service';
import {Brand} from '../../../service/brand/brand';
import {BrandService} from '../../../service/brand/brand.service';

import {Meta, Title} from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';

@Component(
    {selector: 'app-package-deal', templateUrl: './package-deal.component.html', styleUrls: ['./package-deal.component.css']}
)
export class PackageDealComponent implements OnInit {
    public formModalBrand = false;
    public formModalSortby = false;

    products: Array<any> = []
    brands: Brand[];

    name: string;
    filterBrandArr: any = [];

    reverse: boolean = false;
    filterSortby: string;
    filterSortbys: string = 'id';
    dataSortbys: any[] = [
        {
            name: 'Newest',
            value: 'id'
        }, {
            name: 'Highest Price',
            value: 'discount_price'
        }
    ]
    dataSortby: any[] = [
        {
            name: 'Lowest Price',
            value: 'discount_price'
        }, {
            name: 'Alphabet',
            value: 'name'
        }, {
            name: 'Brand',
            value: 'brand_name'
        }
    ]

    limit: number = 10;
    offset: number = 0;
    metaTag: any;
    count: number = 0

    constructor(
        private router : Router,
        private route : ActivatedRoute,
        private productService : ProductService,
        private brandService : BrandService,
        private termService : TermService,
        private meta : Meta,
        private titleService: Title
    ) { 
        this.getMeta()
    }

    ngOnInit() {
        this.getBrand();
        this.getProductPackage();
        this.titleService.setTitle('KitchenArt - Product Package Deal');
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

    cekStatus(value : string) {
        if (value == 'first_sort') {
            this.filterSortby = '';
            this.reverse = true;
        } else {
            this.filterSortbys = '';
            this.reverse = false;
        }
    }

    closeModal(): void {
        this.formModalBrand = false;
        this.formModalSortby = false;
    }

    getFilterBrand(): void {
        this.formModalBrand = true;
    }

    getFilterSortby(): void {
        this.formModalSortby = true;
    }

    getProductPackage(): void {
        const publish = 'T';
        const sidx = '';
        const sort = '';
        const limit = 0;
        const offset = 0;

        this
            .productService
            .getProductPackageDeal(publish, sidx, sort, limit, offset)
            .subscribe((products: any) => {
                this.products = products['kitchenart']['results']
                this.count = this.products.length
            });
    }

    getBrand(): void {
        const publish = 'T';
        const navbaronly = 'F';
        const sidx = 'position';
        const sort = 'asc';

        this
            .brandService
            .getBrands(publish, navbaronly, sidx, sort)
            .subscribe((brand: any) => {
                this.brands = brand['kitchenart']['results'];
            });
    }

    goProductDetail(id: any) {
        this
            .router
            .navigate(['package/', id]);
            // location.reload();
    }

}
