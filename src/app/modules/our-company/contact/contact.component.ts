import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { ContactUsService } from '../../../service/contact-us/contact-us.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NewsletterService } from '../../../service/newsletter/newsletter.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  metaTag: any;
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
  paymentMethod: any;

  newsletterForm: FormGroup;
  newsletter: boolean = false;
  status: any;

  constructor(
    private contactService: ContactUsService,
    private termService: TermService,
    private meta : Meta,
    private titleService: Title,
    private toastr: ToastrService,
    private newsletterService: NewsletterService
  ) { 
    this.createForm()
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Contact');
  }

  ngOnInit() {
    this.getContactUs()
    // this.getPaymentMethod()
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

  getPaymentMethod() {
    this.contactService.getMethodPaymentsChannel()
    .subscribe((payment: any) => {
        this.paymentMethod = payment['kitchenart']['results']
    })
  }

  createForm() {
    this.newsletterForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  popupNewsletter() {
    this.newsletter = true;
  }

  closePopupNewsletter() {
    this.newsletter = false;
  }

  showSuccess() {
    this.toastr.success('Registered', 'Success');
    this.closePopupNewsletter();
    this.createForm();
  }

  showError() {
    this.toastr.error('Already Exists', 'Oops!');
    this.closePopupNewsletter();
  }

  postNewsletter() {
    const formModel = this.newsletterForm.value;

    this.newsletterService.postNewsletters(formModel)
      .subscribe((contact: any) => {
        this.status = contact['kitchenart']['results']['status'];
        if(this.status === 'success'){
            this.showSuccess();
        }
        else{
            this.showError();
        }
      });
  }

}
