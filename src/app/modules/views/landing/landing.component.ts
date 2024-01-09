import { Component, OnInit } from '@angular/core';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { ContactUsService } from '../../../service/contact-us/contact-us.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  metaTag: any;
  terms: any;
  contacts: any;
  whatsappHelp: string
  phoneHelp: string
  faxHelp: string
  emailHelp: string
  whatsappService: string
  phoneService: string
  emailService: string
  youtube: string
  instagram: string
  facebook: string
  pinterest: string
  twitter: any;

  constructor(
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private contactService: ContactUsService
  ) { 
    this.getMeta()
    this.titleService.setTitle('Coming Soon kitchenArt');
  }

  getMeta() {
    this.termService.getTagMeta()
    .subscribe((meta:any) => {
        this.metaTag = meta['kitchenart']['results'];

        this.meta.addTags([
            {name: 'description', content: this.metaTag['meta_description']},
            {name: 'author', content: 'kitchenart.id'},
            {name: 'keywords', content: this.metaTag['meta_keyword']}
          ]);
    })
  }

  ngOnInit() {
    this.getContactUs()
  }

  getContactUs() {
    this.contactService.getContactUs()
    .subscribe((contactUs: any) => {
        this.contacts = contactUs['kitchenart']['results']
        this.whatsappHelp = this.contacts['whatsapp_help']
        this.phoneHelp = this.contacts['phone_help']
        this.faxHelp = this.contacts['fax_help']
        this.emailHelp = this.contacts['email_help']
        this.whatsappService = this.contacts['whatsapp_service']
        this.phoneService = this.contacts['phone_service']
        this.emailService = this.contacts['email_service']
        this.youtube = this.contacts['youtube']
        this.instagram = this.contacts['instagram']
        this.facebook = this.contacts['facebook']
        this.twitter = this.contacts['twitter']
        this.pinterest = this.contacts['pinterest']
    })
  }

}
