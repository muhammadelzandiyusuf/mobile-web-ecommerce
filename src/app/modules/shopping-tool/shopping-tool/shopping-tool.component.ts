import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-shopping-tool',
  templateUrl: './shopping-tool.component.html',
  styleUrls: ['./shopping-tool.component.css']
})
export class ShoppingToolComponent implements OnInit {

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
    this.titleService.setTitle('KitchenArt - Shopping Tools');
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
    this.getTermChild();
  }

  getTermChild() {
    let parent = 48;
    this.termService.getChildTerm(parent)
    .subscribe((term: any) => {
        this.terms = term['kitchenart']['results'];
    })
  }

  goLink(link: any): void {
    this.router.navigate([link]);
  }

}
