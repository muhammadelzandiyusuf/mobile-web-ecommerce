import { Component, OnInit, HostListener } from '@angular/core';
import { ContractorService } from '../../../../service/contractor/contractor.service';
import { TermService } from '../../../../service/term/term.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.css']
})
export class ContractorComponent implements OnInit {

  metaTag: any;
  contractors: any = []

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  arrayContractor: Array<any> = []

  constructor(
    private contractorService: ContractorService,
    private termService: TermService,
    private router: Router,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Contractors & Builders');
  }

  ngOnInit() {
    this.getContractorsBuilders()
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

  getContractorsBuilders(){
    let sidx = 'id'
    let sort = 'asc'
    let limit = 10
    let start = 0

    this.contractorService.getContractor(sidx, sort, limit, start)
    .subscribe((contractor: any) => {
      this.contractors = contractor['kitchenart']['results']
      this.arrayContractor = contractor['kitchenart']['results'];
    })
  }

  getDetailContractor(url: any){
    this.router.navigate(['contractors_builders/', url]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {

      if ((event.srcElement.scrollTop) >= (1248 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.contractorService.getContractor(sidx, sort, limit, offset)
          .subscribe((contractor: any) => {
              this.arrayContractor = this.arrayContractor.concat(contractor['kitchenart']['results'])
              this.contractors = this.arrayContractor
          });

          this.page++;
      }
  }

}
