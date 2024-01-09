import { Component, OnInit, HostListener } from '@angular/core';
import { BrandGalleryService } from '../../../../service/brand-gallery/brand-gallery.service';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-brand-gallery-list',
  templateUrl: './brand-gallery-list.component.html',
  styleUrls: ['./brand-gallery-list.component.css']
})
export class BrandGalleryListComponent implements OnInit {

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  arrayGallery: Array<any> = []
  brandGallery: Array<any> = []
  params: string;
  metaTag: any;

  constructor(
    private brandGalleryService: BrandGalleryService,
    private route: ActivatedRoute,
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private deviceService: DeviceDetectorService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.params = params['brand'];
      this.getListGalleryBrand(params['brand']);    
      this.titleService.setTitle('KitchenArt - Brand Gallery ' + this.params); 
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
  }

  getListGalleryBrand(url: any) {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let offset = 0;

    this.brandGalleryService.getListBrandGallery(url, sidx, sort, limit, offset)
    .subscribe(gallery => {
      this.arrayGallery = gallery['kitchenart']['results'];
      this.brandGallery = this.arrayGallery
    });
  }

  goToDetailGallery(url: any){
    this.router.navigate(['brand_galleries/', url]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      
      if(isMobile){
        if ((event.srcElement.scrollTop) >= (1617 * this.page)) {
            this.offset = this.offset + this.limit;
            const sidx = 'id';
            const sort = 'asc';
            const limit = this.limit;
            const offset = this.offset;

            this.brandGalleryService.getListBrandGallery(this.params, sidx, sort, limit, offset)
            .subscribe((gallery: any) => {
              this.arrayGallery = this.arrayGallery.concat(gallery['kitchenart']['results'])
              this.brandGallery = this.arrayGallery
            });
          
            this.page++;
        }
      }
      else if(isTablet){
          if ((event.srcElement.scrollTop) >= (218 * this.page)) {
              this.offset = this.offset + this.limit;
              const sidx = 'id';
              const sort = 'asc';
              const limit = this.limit;
              const offset = this.offset;

              this.brandGalleryService.getListBrandGallery(this.params, sidx, sort, limit, offset)
              .subscribe((gallery: any) => {
                this.arrayGallery = this.arrayGallery.concat(gallery['kitchenart']['results'])
                this.brandGallery = this.arrayGallery
              });
            
              this.page++;
          }
      }
  }

}
