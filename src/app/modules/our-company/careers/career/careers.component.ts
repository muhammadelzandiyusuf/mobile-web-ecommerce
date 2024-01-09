import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '../../../../../../node_modules/@angular/router';

import { CareerService } from '../../../../service/career/career.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})
export class CareersComponent implements OnInit {

  contactForm: FormGroup;

  fileUploadPhoto: File  = null;
  fileUploadAplication: File  = null;
  fileUploadAcademy: File  = null;
  fileUploadCv: File  = null;

  spinner: boolean = false

  @ViewChild('filePhoto') filePhoto: ElementRef;
  @ViewChild('fileApplication') fileApplication: ElementRef;
  @ViewChild('fileAcademy') fileAcademy: ElementRef;
  @ViewChild('fileCv') fileCv: ElementRef;

  phone: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  status: any;
  metaTag: any;
  lang: any;

  constructor(
    private careerService: CareerService,
    private router: Router,
    private toastr: ToastrService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) { 
    this.createForm();
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - Careers');
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

  careerPosts: any = [];
  careerSpecialize: any = [];
  careers: any = [];

  createForm() {
    this.contactForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      spesializ: new FormControl('', Validators.required),
      photoFile: new FormControl (null, Validators.required),
      aplicationFile: new FormControl (null, Validators.required),
      academyFile: new FormControl (null, Validators.required),
      cvFile: new FormControl (null, Validators.required)
    });
  }

  ngOnInit() {
    this.getCareerPost();
    this.getCareerSpecialize();
  }

  onFileChangePhoto(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.contactForm.get('photoFile').setValue(file);
      this.fileUploadPhoto = file;
    }
  }

  onFileChangeApplication(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.contactForm.get('aplicationFile').setValue(file);
      this.fileUploadAplication = file;
    }
  }

  onFileChangeAcademy(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.contactForm.get('academyFile').setValue(file);
      this.fileUploadAcademy = file;
    }
  }

  onFileChangeCv(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.contactForm.get('cvFile').setValue(file);
      this.fileUploadCv = file;
    }
  }

  getCareerPost() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let offset = 0;

    this.careerService.getCareerPost(sidx, sort, limit, offset)
    .subscribe((career: any) => {
      this.careerPosts = career['kitchenart']['results'];
    });
  }

  getCareerSpecialize() {
    this.careerService.getCareerSpecialization()
    .subscribe((career: any) => {
      this.careerSpecialize = career['kitchenart']['results'];
    });
  }

  saveContact() {
    this.spinner = true
    const formModel = this.contactForm.value;

    this.careerService.careerPostInternship(formModel)
    .subscribe((career: any) => {
      let code = career['kitchenart']['status']['code'];
      if(code == 200){
        this.careerService.careerPostUploadInternship(this.fileUploadPhoto, this.fileUploadAplication, this.fileUploadAcademy, this.fileUploadCv)
        .subscribe((images: any) => {
            if(images['type'] == 0 || images['status'] == 200){
              this.showSuccess();
              setTimeout(()=>{
                this.spinner = false
                this.reset();
                this.router.navigate(['/']);
              },1000);
            }
            else{
              this.showError();
            }
        });
      }
      else{
        this.showError();
      }
    });
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    if(this.lang == 'en'){
      this.toastr.success('Saved successfully');
    }
    else{
      this.toastr.success('Berhasil Tersimpan');
    }
  }

  showError() {
    if(this.lang == 'en'){
      this.toastr.error('Saving Failed');
    }
    else{
      this.toastr.error('Gagal Menyimpan');
    }
  }

  goLinkForm(url: any) {
    this.router.navigate(['careers/', url]);
  }

}
