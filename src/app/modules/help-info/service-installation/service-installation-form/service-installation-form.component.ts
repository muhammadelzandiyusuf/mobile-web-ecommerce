import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TermService } from '../../../../service/term/term.service';
import { ProvinceService } from '../../../../service/province/province.service';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng4-validators';
import { BrandService } from '../../../../service/brand/brand.service';
import { CategoryService } from '../../../../service/category/category.service';
import { CertifiedTechnicianService } from '../../../../service/certified-technician/certified-technician.service';
import { ServiceInstallationService } from '../../../../service/service-installation/service-installation.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-service-installation-form',
  templateUrl: './service-installation-form.component.html',
  styleUrls: ['./service-installation-form.component.css']
})
export class ServiceInstallationFormComponent implements OnInit, OnDestroy {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  id: number = null;
  subcription: Subscription;
  navigationSubscription: any

  serviceForm: FormGroup;
  metaTag: any;
  provinces: any;
  brands: any;
  spinner: boolean = false
  countProduct: number = 1
  formProduct1 : boolean = false
  formProduct2 : boolean = false

  url: any;
  fileToUpload1: File  = null;
  fileToUpload2: File  = null;
  fileToUpload3: File  = null;
  salutaion: any = [
    {name:"Mr"}, {name:"Mrs"}, {name:"Ms"}
  ]
  service_type_demos: any = [
    {name:"Install"}, {name:"Demo"}, {name:"Install & Demo"}
  ]

  @ViewChild('fileInput1') fileInput1: ElementRef;
  @ViewChild('fileInput2') fileInput2: ElementRef;
  @ViewChild('fileInput3') fileInput3: ElementRef;
  categories: any;
  technicians: any;
  param: any;
  category: any;
  categoryId: any;
  nameIndonesia: any;
  nameEnglish: any;
  slug: any;
  urlService: any;
  urlInstallation: any;


  brand_id_2 = new FormControl();
  category_id_2 = new FormControl();
  product_model_2 = new FormControl();
  serial_number_2 = new FormControl();
  product_file_2 = new FormControl(null);

  brand_id_3 = new FormControl();
  category_id_3 = new FormControl();
  product_model_3 = new FormControl();
  serial_number_3 = new FormControl();
  product_file_3 = new FormControl(null);
  data: any;
  serviceProducts: any;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  token: any;

  constructor(
    private serviceInstallationService: ServiceInstallationService,
    private termService : TermService,
    private provinceService: ProvinceService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private technicianService: CertifiedTechnicianService,
    private toastr: ToastrService,
    private meta : Meta,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private localSt: LocalStorageService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.param = params['url']
      this.getDetailCategoryService(params['url']);
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
        if (this.token == null) {
          this.router.navigate(['login']);
        }
      }
    });
    this.createForm()
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Service & Installation');
  }

  ngOnInit() {
    this.getProvince()
    this.getBrands()
    this.getParentCategory()
    this.getTechnicians()
  }

  initialiseInvites() {
    let token = this.localSt.retrieve('token');
    if(token){
      this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.subcription){
      this.subcription.unsubscribe();
    }
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

  getProvince(): void {
    this.provinceService.getProvinces()
    .subscribe((provinces: any) => {
      this.provinces = provinces['kitchenart']['results'];
    });
  }

  getBrands(): void {
    let publish = 'T'
    this.brandService.getAllBrand(publish)
    .subscribe((brand: any) => {
      this.brands = brand['kitchenart']['results']
    })
  }

  getParentCategory() {
    let parent = '';
    let publish = 'T'
    let sidx = 'position'
    let sort = 'asc'

    this.categoryService.getCategoryByParent(parent, publish, sidx, sort)
    .subscribe((category: any) => {
      this.categories = category['kitchenart']['results']
    })
  }

  getTechnicians(){
    this.technicianService.getTechnicians()
    .subscribe((technician: any) => {
      this.technicians = technician['kitchenart']['results']
    })
  }

  getDetailCategoryService(url: any) {
    this.serviceInstallationService.getDetailServiceCategory(url)
    .subscribe((detail: any) => {
        this.category = detail['kitchenart']['results']
        this.categoryId = this.category['id']
        this.nameIndonesia = this.category['name_indonesia']
        this.nameEnglish = this.category['name_english']
        this.slug = this.category['slug'] 
    })
  }

  onFileChange(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload1 = file;
    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onFileChangeService(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload2 = file;
    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.urlService = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onFileChangeInstallation(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload3 = file;
    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.urlInstallation = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  createForm() {
    let email = new FormControl('', [Validators.required, Validators.email]);
    let sameEmail = new FormControl('', CustomValidators.equalTo(email));
    
    this.serviceForm = new FormGroup({
      salutation: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl (''),
      telephone: new FormControl (''),
      handphone: new FormControl ('', Validators.required),
      email: email,
      same_email: sameEmail,
      address: new FormControl ('', Validators.required),
      province_id: new FormControl ('', Validators.required),
      technician: new FormControl ('', Validators.required),
      message: new FormControl ('', Validators.required),
      service_type: new FormControl (''),
      brand_id_1: new FormControl ('', Validators.required),
      category_id_1: new FormControl ('', Validators.required),
      product_model_1: new FormControl ('', Validators.required),
      serial_number_1: new FormControl ('', Validators.required),
      product_file_1: new FormControl (null, Validators.required),
      brand_id_2: this.brand_id_2,
      category_id_2: this.category_id_2,
      product_model_2: this.product_model_2,
      serial_number_2: this.serial_number_2,
      product_file_2: this.product_file_2,
      brand_id_3: this.brand_id_3,
      category_id_3: this.category_id_3,
      product_model_3: this.product_model_3,
      serial_number_3: this.serial_number_3,
      product_file_3: this.product_file_3
    });
  }

  serviceProduct: any

  saveServiceInstallation() {
    this.spinner = true
    let model = this.serviceForm.value
    this.serviceInstallationService.postServiceInstallation(model, this.categoryId, this.token, this.countProduct)
    .subscribe((service: any) => {
        this.data =  service['kitchenart']['results']
        this.serviceProducts = this.data['service_products']
        let status = this.data['status']
        if(status == 'success') {
          this.showSuccess()
          this.serviceInstallationService.postUploadImage(this.fileToUpload1, this.fileToUpload2, this.fileToUpload3)
          .subscribe((images: any) => {
            this.showSuccess()
            setTimeout(()=>{
              this.reset();
              this.router.navigate(['/']);
            },1000);
          })
        }
        else{
          this.showError();
          this.spinner = false
        }

    })
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    this.toastr.success('Registration success', 'Successfully');
  }

  showError() {
    this.toastr.error('Complete data', 'Oops!');
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  addProduct() {
    this.countProduct++
    if(this.countProduct == 2) {
      this.formProduct1 = true
      this.formValidateServiceProduct()
    }
    else if(this.countProduct == 3) {
      this.formProduct2 = true
      this.formValidateInstallationProduct()
    }
  }

  formValidateServiceProduct() {
      this.brand_id_2 = new FormControl ('', Validators.required)
      this.category_id_2 = new FormControl ('', Validators.required)
      this.product_model_2 = new FormControl ('', Validators.required)
      this.serial_number_2 = new FormControl ('', Validators.required)
      this.product_file_2 = new FormControl (null, Validators.required)
  }

  formValidateServiceNotActive() {
      this.brand_id_2 = new FormControl ('')
      this.category_id_2 = new FormControl ('')
      this.product_model_2 = new FormControl ('')
      this.serial_number_2 = new FormControl ('')
      this.product_file_2 = new FormControl(null)
  }

  formValidateInstallationProduct() {
      this.brand_id_3 = new FormControl ('', Validators.required)
      this.category_id_3 = new FormControl ('', Validators.required)
      this.product_model_3 = new FormControl ('', Validators.required)
      this.serial_number_3 = new FormControl ('', Validators.required)
      this.product_file_3 = new FormControl (null, Validators.required)
  }

  formValidateNotActive() {
      this.brand_id_3 = new FormControl ('')
      this.category_id_3 = new FormControl ('')
      this.product_model_3 = new FormControl ('')
      this.serial_number_3 = new FormControl ('')
      this.product_file_3 = new FormControl(null)
  }

  removeProduct() {
    this.countProduct--
    if(2 <= this.countProduct) {
      this.formProduct2 = false
      this.formValidateNotActive()
    }
    else if(1 == this.countProduct){
      this.formProduct1 = false
      this.formValidateServiceNotActive()
    }
  }

}
