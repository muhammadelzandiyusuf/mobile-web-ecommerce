import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '../../../../../../node_modules/@angular/router';

import { CareerService } from '../../../../service/career/career.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-career-form',
  templateUrl: './career-form.component.html',
  styleUrls: ['./career-form.component.css']
})
export class CareerFormComponent implements OnInit {

  contactForm: FormGroup;
  url: string;

  fileUploadPhoto: File  = null;
  fileUploadAplication: File  = null;
  fileUploadCv: File  = null;

  spinner: boolean = false

  @ViewChild('filePhoto') filePhoto: ElementRef;
  @ViewChild('fileApplication') fileApplication: ElementRef;
  @ViewChild('fileAcademy') fileAcademy: ElementRef;
  @ViewChild('fileCv') fileCv: ElementRef;

  phone: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  status: any;
  position: any;
  description_english: any;
  requirement_english: any;
  metaTag: any;
  lang: any;

  constructor(
    private careerService: CareerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getDetailCareer(params['url']);
      this.url = params['url'];
    })
    this.createForm();
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - Career Form');
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
  careers: any = [];

  createForm() {
    this.contactForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      photoFile: new FormControl (null, Validators.required),
      aplicationFile: new FormControl (null, Validators.required),
      cvFile: new FormControl (null, Validators.required)
    });
  }

  ngOnInit() {
  }

  getDetailCareer(url: any) {
    this.careerService.getCareerDetail(url)
    .subscribe((career: any) => {
      this.careerPosts = career['kitchenart']['results'];
      this.position = this.careerPosts['position']; 
      this.description_english = this.careerPosts['job_description_english']; 
      this.requirement_english = this.careerPosts['job_requirement_english']; 
    });
  }

  saveContact() {
    this.spinner = true
    const formModel = this.contactForm.value;
    
    this.careerService.careerPostFullTimeJob(formModel, this.url)
    .subscribe((career: any) => {
      let code = career['kitchenart']['status']['code'];
      if(code == 200){
        this.careerService.careerPostUploadFullTimeJob(this.fileUploadPhoto, this.fileUploadAplication, this.fileUploadCv)
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

  onFileChangeCv(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.contactForm.get('cvFile').setValue(file);
      this.fileUploadCv = file;
    }
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

}
