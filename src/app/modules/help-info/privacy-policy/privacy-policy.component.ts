import { Component, OnInit } from '@angular/core';
import { InformationService } from '../../../service/information/information.service';
import { Title, Meta } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  informations: any;
  title: any;
  contentEnglish: any;
  contentIndonesia: any;
  lang: any;

  constructor(
    private informationService: InformationService,
    private meta : Meta,
    private titleService: Title,
    private termService : TermService,
    private localSt: LocalStorageService
  ) { }

  ngOnInit() {
    this.getDataInformation()
    this.lang = this.localSt.retrieve('lang');
  }

  getMeta(keyword: any, description: any) {
    this.termService.getTagMeta()
    .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];
        if(keyword == '' || keyword == null){
          this.metaKeyword = this.metaTag['meta_keyword']
        }
        else{
          this.metaKeyword = keyword
        }

        if(description == '' || description == null){
          this.metaDescription = this.metaTag['meta_description']
        }
        else{
          this.metaDescription = description
        }

        this.meta.updateTag(
          {name: 'description', content: this.metaDescription}
        );

        this.meta.updateTag(
          {name: 'keywords', content: this.metaKeyword}
        );

        this.meta.updateTag({
          name: 'author', content: 'kitchenart.id'
        })
        
    })
  }

  getDataInformation() {
    let id = 3;
    this.informationService.getInformation(id)
    .subscribe((information: any) => {
      this.informations = information['kitchenart']['results']
      this.title = this.informations['title']
      this.contentEnglish = this.informations['content_english']
      this.contentIndonesia = this.informations['content_indonesia']

      let keyword = this.informations['meta_keyword']
      let description = this.informations['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - Pripacy Policy');
    })
  }

}
