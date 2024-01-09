import { Component, OnInit } from '@angular/core';
import { FreeKitchenDesignService } from '../../../../service/free-kitchen-design/free-kitchen-design.service';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';

@Component({
  selector: 'app-free-kitchen-design',
  templateUrl: './free-kitchen-design.component.html',
  styleUrls: ['./free-kitchen-design.component.css']
})
export class FreeKitchenDesignComponent implements OnInit {

  params: string;
  freeKitchen: any = []
  metaTag: any;

  constructor(
    private kitchenDesignService: FreeKitchenDesignService,
    private route: ActivatedRoute,
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.route.params.subscribe(params => {
      this.params = params['id'];
      this.getFreeKitchenDesign(params['id']);     
    })

    this.getMeta()
    this.titleService.setTitle('KitchenArt - Free Kitchen Design');
  }

  getMeta() {
    this.termService.getTagMeta()
    .subscribe(meta => {
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

  getFreeKitchenDesign(id:number){
    const kitchen_id = id;
    const sidx = 'id'
    const sort = 'desc'
    const limit = 10
    const offset = 0

    this.kitchenDesignService.getKitchenDesigns(kitchen_id, sidx, sort, limit, offset)
    .subscribe(freeKitchen => {
      this.freeKitchen = freeKitchen['kitchenart']['results'];
    })
  }

  goKitchenDesignDetail(url:string){
    this.router.navigate(['free_kitchen_designs/' + this.params + '/', url]);
  }

}
