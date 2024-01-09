import { Component, OnInit, HostListener } from '@angular/core';
import { KitchenPartneService } from '../../../../service/kithen-partner/kitchen-partne.service';
import { TermService } from '../../../../service/term/term.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-kitchent-partners',
  templateUrl: './kitchent-partners.component.html',
  styleUrls: ['./kitchent-partners.component.css']
})
export class KitchentPartnersComponent implements OnInit {
  metaTag: any;

  constructor(
    private kitchenPartnerService: KitchenPartneService,
    private termService: TermService,
    private router: Router,
    private meta : Meta,
    private titleService: Title,
    private deviceService: DeviceDetectorService
  ) { 
    this.titleService.setTitle('KitchenArt - Kitchen Partners');
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

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  arrayKitchen: Array<any> = []
  kitchenPartner: Array<any> = []
  terms: any;

  ngOnInit() {
    this.getKitchenList();
  }

  getKitchenList() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let offset = 0;

    this.kitchenPartnerService.getKitchenPartners(sidx, sort, limit, offset)
    .subscribe((kitchen: any) => {
      this.arrayKitchen = this.arrayKitchen.concat(kitchen['kitchenart']['results'])
      this.kitchenPartner = this.arrayKitchen
    })
  }

  goKitchenDetail(url: any) {
    this.router.navigate(['partner_kitchens/', url]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      if(isMobile){
        if ((event.srcElement.scrollTop) >= (1647 * this.page)) {
            this.offset = this.offset + this.limit;
            const sidx = 'id';
            const sort = 'asc';
            const limit = this.limit;
            const offset = this.offset;

            this.kitchenPartnerService.getKitchenPartners(sidx, sort, limit, offset)
            .subscribe((kitchen: any) => {
              this.arrayKitchen = this.arrayKitchen.concat(kitchen['kitchenart']['results'])
              this.kitchenPartner = this.arrayKitchen
            })
          
            this.page++;
        }
      }
      else if(isTablet){
        if ((event.srcElement.scrollTop) >= (106 * this.page)) {
            this.offset = this.offset + this.limit;
            const sidx = 'id';
            const sort = 'asc';
            const limit = this.limit;
            const offset = this.offset;

            this.kitchenPartnerService.getKitchenPartners(sidx, sort, limit, offset)
            .subscribe((kitchen: any) => {
              this.arrayKitchen = this.arrayKitchen.concat(kitchen['kitchenart']['results'])
              this.kitchenPartner = this.arrayKitchen
            })
          
            this.page++;
        }
      }
  }

}
