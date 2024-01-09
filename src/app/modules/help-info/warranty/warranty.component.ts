import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WarrantyService } from '../../../service/warranty/warranty.service';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { ProvinceService } from '../../../service/province/province.service';
import { CityService } from '../../../service/city/city.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng4-validators';
import { BrandService } from '../../../service/brand/brand.service';
import { WarrantyProduct } from '../../../service/warranty/warranty-product';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.css']
})
export class WarrantyComponent implements OnInit {

  warrantyForm: FormGroup;
  metaTag: any;
  provinces: any;
  cities: any;
  cityDisabled: boolean = true;
  fileToUpload1: File  = null;
  fileToUpload2: File  = null;
  fileToUpload3: File  = null;
  isLoading = false;
  products: WarrantyProduct[] = [];
  productDisable: boolean = true
  productDisable2: boolean = true
  productDisable3: boolean = true
  isCorrect: boolean = false;
  isError: boolean = false;
  isLoadingCheck: boolean = false;
  isCorrect2: boolean = false;
  isError2: boolean = false;
  isLoadingCheck2: boolean = false;
  isCorrect3: boolean = false;
  isError3: boolean = false;
  isLoadingCheck3: boolean = false;
  spinner: boolean = false

  registerForm: FormGroup;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  postal: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  url: any;
  salutaion: any = [
    {name:"Mr"}, {name:"Mrs"}, {name:"Ms"}
  ]

  @ViewChild('fileInput1') fileInput1: ElementRef;
  @ViewChild('fileInput2') fileInput2: ElementRef;
  @ViewChild('fileInput3') fileInput3: ElementRef;
  brands: any;
  warrantyProduct1Form: FormGroup;
  formProduct2: boolean = false
  formProduct3: boolean = false
  countProduct: number = 1;
  brand_id_2 = new FormControl();
  warranty_number_code_2 = new FormControl();
  warranty_number_text_2 = new FormControl();
  serial_number_2 = new FormControl();
  purchase_date_2 = new FormControl();
  productInput_2 = new FormControl();
  card_image_2 = new FormControl(null);
  brand_id_3 = new FormControl();
  warranty_number_code_3 = new FormControl();
  warranty_number_text_3 = new FormControl();
  serial_number_3 = new FormControl();
  purchase_date_3 = new FormControl();
  productInput_3 = new FormControl();
  card_image_3 = new FormControl(null);
  productsWaranty: WarrantyProduct[] = [];
  productWarranties: WarrantyProduct[] = [];
  urlProd: any;
  urlWarranty: any;
  maxToday: Date;
  pdfFile: any;

  constructor(
    private warrantyService : WarrantyService,
    private termService : TermService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private toastr: ToastrService,
    private meta : Meta,
    private titleService: Title,
    private brandService: BrandService,
    private router: Router,
  ) { 
    this.getMeta()
    this.createForm()
    this.titleService.setTitle('KitchenArt - Warranty Registration');
  }

  ngOnInit() {
    this.getPDFFile();
    this.getProvince()
    this.getBrands()
    this.warrantyForm
      .get('productInput_1')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap((value: any) => this.warrantyService.getSearchWarrantyProduct(value, this.warrantyForm.value['brand_id_1'])
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe((product: any) => this.products = product['kitchenart']['results']);
    
    this.warrantyForm
    .get('productInput_2')
    .valueChanges
    .pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap((value: any) => this.warrantyService.getSearchWarrantyProduct(value, this.warrantyForm.value['brand_id_2'])
      .pipe(
        finalize(() => this.isLoading = false),
        )
      )
    )
    .subscribe((product: any) => this.productsWaranty = product['kitchenart']['results']);

    this.warrantyForm
      .get('productInput_3')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap((value: any) => this.warrantyService.getSearchWarrantyProduct(value, this.warrantyForm.value['brand_id_3'])
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe((product: any) => this.productWarranties = product['kitchenart']['results']);

      let today = new Date();
      this.maxToday  = today;
  }

  getPDFFile() {
    this.termService.getTermConditionWarranty()
    .subscribe((term: any) => {
      const data = term['kitchenart']['results']
      this.pdfFile = data['file_term_condition']
    })
  }

  createForm() {
    let email = new FormControl('', [Validators.required, Validators.email]);
    let sameEmail = new FormControl('', CustomValidators.equalTo(email));
    
    this.warrantyForm = new FormGroup({
      salutation: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl (''),
      telephone: new FormControl (''),
      handphone: new FormControl ('', Validators.required),
      email: email,
      same_email: sameEmail,
      address: new FormControl ('', Validators.required),
      province_id: new FormControl ('', Validators.required),
      state_id: new FormControl ('', Validators.required),
      postal_zip: new FormControl ('', Validators.required),
      brand_id_1: new FormControl ('', Validators.required),
      // warranty_number_code_1: new FormControl ('', Validators.required),
      warranty_number_text_1: new FormControl ('', Validators.required),
      serial_number_1: new FormControl ('', Validators.required),
      purchase_date_1: new FormControl ('', [Validators.required, CustomValidators.date]),
      productInput_1: new FormControl('', Validators.required),
      card_image_1: new FormControl (null, Validators.required),
      brand_id_2: this.brand_id_2,
      // warranty_number_code_2: this.warranty_number_code_2,
      warranty_number_text_2: this.warranty_number_text_2,
      serial_number_2: this.serial_number_2,
      purchase_date_2: this.purchase_date_2,
      productInput_2: this.productInput_2,
      card_image_2: this.card_image_2,
      brand_id_3: this.brand_id_3,
      // warranty_number_code_3: this.warranty_number_code_3,
      warranty_number_text_3: this.warranty_number_text_3,
      serial_number_3: this.serial_number_3,
      purchase_date_3: this.purchase_date_3,
      productInput_3: this.productInput_3,
      card_image_3: this.card_image_3
    });
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

  onFileChangeProd(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload2 = file;
    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.urlProd = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onFileChangeProdWarranty(event: any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload3 = file;
    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.urlWarranty = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  warrantyDownloadPdf() {
    this.warrantyService.getWarrantyFile()
    .subscribe((warranty: any) => {
      console.log('success')
    })
  }

  getBrands(): void {
    let publish = 'T'
    this.brandService.getAllBrand(publish)
    .subscribe((brand: any) => {
      this.brands = brand['kitchenart']['results']
    })
  }

  getProvince(): void {
    this.provinceService.getProvinces()
    .subscribe((provinces: any) => {
      this.provinces = provinces['kitchenart']['results'];
    });
  }

  getCityByProvince(province_id: any): void {
    this.cityDisabled = false;
    this.cityService.getCities(province_id)
    .subscribe((cities: any) => {
      this.cities = cities['kitchenart']['results'];
    });
  }

  getProductWarranty(){
    let search = this.warrantyForm.value['productInput_1']
    let brand_id = this.warrantyForm.value['brand_id_1']
    this.warrantyService.getSearchWarrantyProduct(search, brand_id)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results']
      this.productDisable = false
    })
  }

  getProductWarranty2(){
    let search = this.warrantyForm.value['productInput_2']
    let brand_id = this.warrantyForm.value['brand_id_2']
    this.warrantyService.getSearchWarrantyProduct(search, brand_id)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results']
      this.productDisable2 = false
    })
  }

  getProductWarranty3(){
    let search = this.warrantyForm.value['productInput_3']
    let brand_id = this.warrantyForm.value['brand_id_3']
    this.warrantyService.getSearchWarrantyProduct(search, brand_id)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results']
      this.productDisable3 = false
    })
  }

  getCheckCode() {
    this.isCorrect = false
    this.isError = false
    this.isLoadingCheck = true;
    let code = this.warrantyForm.value['warranty_number_code_1']
    let brand_id = this.warrantyForm.value['brand_id_1']
    this.warrantyService.getWarrantyCekCode(code, brand_id)
    .subscribe((code: any) => {
        let status = code['kitchenart']['results']['status']
        setTimeout(()=>{
          if(status == 'success') {
            this.isCorrect = true
          }
          else{
            this.isError = true
          }
          this.isLoadingCheck = false;
        },1000);
    })
  }

  getCheckCode2() {
    this.isCorrect2 = false
    this.isError2 = false
    this.isLoadingCheck2 = true;
    let code = this.warrantyForm.value['warranty_number_code_2']
    let brand_id = this.warrantyForm.value['brand_id_2']
    this.warrantyService.getWarrantyCekCode(code, brand_id)
    .subscribe((code: any) => {
        let status = code['kitchenart']['results']['status']
        setTimeout(()=>{
          if(status == 'success') {
            this.isCorrect2 = true
          }
          else{
            this.isError2 = true
          }
          this.isLoadingCheck2 = false;
        },1000);
    })
  }

  getCheckCode3() {
    this.isCorrect3 = false
    this.isError3 = false
    this.isLoadingCheck3 = true;
    let code = this.warrantyForm.value['warranty_number_code_3']
    let brand_id = this.warrantyForm.value['brand_id_3']
    this.warrantyService.getWarrantyCekCode(code, brand_id)
    .subscribe((code: any) => {
        let status = code['kitchenart']['results']['status']
        setTimeout(()=>{
          if(status == 'success') {
            this.isCorrect3 = true
          }
          else{
            this.isError3 = true
          }
          this.isLoadingCheck3 = false;
        },1000);
    })
  }

  saveRegisterWarranty() {
    this.spinner = true
    let data =  this.warrantyForm.value
    let product_id_1 = this.warrantyForm.value['productInput_1']['id']
    let product_id_2  = null;
    let product_id_3  = null;
    if(this.countProduct == 2){
      product_id_2 = this.warrantyForm.value['productInput_2']['id']
    }
    else if(this.countProduct == 3){
      product_id_2 = this.warrantyForm.value['productInput_2']['id']
      product_id_3 = this.warrantyForm.value['productInput_3']['id']
    }
    let purchase_date_1 = this.warrantyForm.value['purchase_date_1']
    let purchase_date_2 = this.warrantyForm.value['purchase_date_2']
    let purchase_date_3 = this.warrantyForm.value['purchase_date_3']

    this.warrantyService.postRegistrasiWarranty(data, product_id_1, product_id_2, product_id_3, purchase_date_1, purchase_date_2, purchase_date_3, this.countProduct)
    .subscribe((warranty: any) => {
        let statusRegis = warranty['kitchenart']['results']['status']
        if(statusRegis == 'error') {
          this.showError()
        }
        else{
          setTimeout(()=>{
            this.warrantyService.warrantyUploadImage(this.fileToUpload1, this.fileToUpload2, this.fileToUpload3)
            .subscribe((images: any) => {
              this.showSuccess()
              this.spinner = false
              this.reset();
              this.router.navigate(['/']);
            });
          },1000);
        }
    })
  }

  addProduct() {
    this.countProduct++
    if(this.countProduct == 2) {
      this.formProduct2 = true
      this.formValidateProduct2()
    }
    else if(this.countProduct == 3) {
      this.formProduct3 = true
      this.formValidateProduct3()
    }
  }

  removeProduct() {
    this.countProduct--
    if(2 <= this.countProduct) {
      this.urlWarranty = null
      this.formProduct3 = false
      this.formValidateNotActive3()
    }
    else if(1 == this.countProduct){
      this.urlProd = null
      this.formProduct2 = false
      this.formValidateNotActive2()
    }
  }

  formValidateProduct2(){
    this.brand_id_2 = new FormControl ('', Validators.required)
    // this.warranty_number_code_2 = new FormControl ('', Validators.required)
    this.warranty_number_text_2 = new FormControl ('', Validators.required)
    this.serial_number_2 = new FormControl ('', Validators.required)
    this.purchase_date_2 = new FormControl ('', [Validators.required, CustomValidators.date])
    this.productInput_2 = new FormControl('', Validators.required)
    this.card_image_2 = new FormControl (null, Validators.required)
  }

  formValidateNotActive2() {
    this.brand_id_2 = new FormControl ('')
    this.warranty_number_code_2 = new FormControl ('')
    this.warranty_number_text_2 = new FormControl ('')
    this.serial_number_2 = new FormControl ('')
    this.purchase_date_2 = new FormControl ('')
    this.productInput_2 = new FormControl ('')
    this.card_image_2 = new FormControl(null)
  }

  formValidateProduct3(){
    this.brand_id_3 = new FormControl ('', Validators.required)
    // this.warranty_number_code_3 = new FormControl ('', Validators.required)
    this.warranty_number_text_3 = new FormControl ('', Validators.required)
    this.serial_number_3 = new FormControl ('', Validators.required)
    this.purchase_date_3 = new FormControl ('', [Validators.required, CustomValidators.date])
    this.productInput_3 = new FormControl('', Validators.required)
    this.card_image_3 = new FormControl (null, Validators.required)
  }

  formValidateNotActive3() {
    this.brand_id_3 = new FormControl ('')
    this.warranty_number_code_3 = new FormControl ('')
    this.warranty_number_text_3 = new FormControl ('')
    this.serial_number_3 = new FormControl ('')
    this.purchase_date_3 = new FormControl ('')
    this.productInput_3 = new FormControl ('')
    this.card_image_3 = new FormControl(null)
  }

  displayFn(product: WarrantyProduct) {
    if (product) { return product.full_name; }
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    this.toastr.success('Registration success');
  }

  showError() {
    this.toastr.error('Complete data');
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

}
