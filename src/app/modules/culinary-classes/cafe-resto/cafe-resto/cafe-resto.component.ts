import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../../../../service/restaurant/restaurant.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cafe-resto',
  templateUrl: './cafe-resto.component.html',
  styleUrls: ['./cafe-resto.component.css']
})
export class CafeRestoComponent implements OnInit {

  public formModalSortby: boolean = false;
  filterSortbys: string = '6';

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  provinceId: number;
  arrayRestaurant: Array<any> = []
  provinces: any = [];
  restaurants: Array<any> = [];
  metaTag: any;

  constructor(
    private router: Router,
    private restaurantService: RestaurantService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Cafe & Resto');
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
    this.getProvinceRestaurant();
    this.getRestaurantByProvinces();
  }

  getProvinceRestaurant() {
    this.restaurantService.getProvince()
    .subscribe((restaurant: any) => {
        this.provinces = restaurant['kitchenart']['results'];
    })
  }

  getRestaurantByProvinces() {
    let province_id = this.filterSortbys;
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.restaurantService.getByProvinces(province_id, sidx, sort, limit, start)
    .subscribe((restaurant: any) => {
        this.restaurants = restaurant['kitchenart']['results'];
        this.arrayRestaurant = restaurant['kitchenart']['results'];
    });
  }

  getRestaurantProvince(province: any) {
    this.provinceId = province
    let province_id = province;
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.restaurantService.getByProvinces(province_id, sidx, sort, limit, start)
    .subscribe((restaurant: any) => {
        this.restaurants = restaurant['kitchenart']['results'];
        this.arrayRestaurant = restaurant['kitchenart']['results'];
    });
  }

  getFilterSortby(): void {
    this.formModalSortby = true;
  }

  closeModal(): void{
    this.getRestaurantProvince(this.filterSortbys);
    this.formModalSortby = false;
  }

  goLink(link: any): void {
    this.router.navigate(['cafe_resto/', link]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {

      if ((event.srcElement.scrollTop) >= (1058 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.restaurantService.getByProvinces(this.provinceId, sidx, sort, limit, offset)
          .subscribe((restaurant: any) => {
              this.arrayRestaurant = this.arrayRestaurant.concat(restaurant['kitchenart']['results'])
              this.restaurants = this.arrayRestaurant
          });

          this.page++;
      }
  }

}
