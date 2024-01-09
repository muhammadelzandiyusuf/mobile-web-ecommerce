import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-culinary-classes',
  templateUrl: './culinary-classes.component.html',
  styleUrls: ['./culinary-classes.component.css']
})
export class CulinaryClassesComponent implements OnInit {

  terms: any = [];
  metaTag: any;
  lang: any;

  constructor(
    private router: Router,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) { 
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - Culinary Classes');
  }

  ngOnInit() {
    this.getTermChild();
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

  getTermChild() {
    let parent = 4;
    this.termService.getChildTerm(parent)
    .subscribe((term: any) => {
        this.terms = term['kitchenart']['results'];
    })
  }

  goLink(link: any): void {
    this.router.navigate([link]);
  }

}
