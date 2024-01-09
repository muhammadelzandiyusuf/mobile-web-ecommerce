import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CityService } from '../../../../service/city/city.service';
import { ProvinceService } from '../../../../service/province/province.service';
import { FormControl, Validators, FormGroup } from '../../../../../../node_modules/@angular/forms';
import { BrandService } from '../../../../service/brand/brand.service';
import { FreeKitchenDesignService } from '../../../../service/free-kitchen-design/free-kitchen-design.service';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { CategoryService } from '../../../../service/category/category.service';
import { CustomValidators } from '../../../../../../node_modules/ng4-validators';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-free-kitchen-design-form',
  templateUrl: './free-kitchen-design-form.component.html',
  styleUrls: ['./free-kitchen-design-form.component.css']
})
export class FreeKitchenDesignFormComponent implements OnInit {

  step: number = 0;
  cityDisabled: boolean = true;
  brands: any = [];
  provinces: any = []
  cities: any = []
  nameFile: string = '';

  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  params: any;
  freeKitchen: string[] = [];
  preferred_designs = new FormControl('', Validators.required);
  preferredDesign: any[] = []

  categoriesKitchen: string[] = [];
  categories = new FormControl('');
  category: any[] = []

  brandIds = new FormControl('');

  contactForm: FormGroup;
  fileToUpload: File  = null;

  kitchenPartner: any;
  mask: any[] = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  @ViewChild('layoutPlan') layoutPlan: ElementRef;
  metaTag: any;
  brandsId: any[] = [];
  lang: any;

  constructor(
    private brandService: BrandService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private freeKitchenService: FreeKitchenDesignService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) { 
    this.route.params.subscribe(params => {
      this.params = params['id']
      this.getKitchenDesign();
    })
    this.createForm();
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - Free Kitchen Design Form');
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
    this.getProvince();
    this.getBrands();
    this.getCategoryKitchen();
    this.getKitchenPartner();
  }

  createForm() {
    let email = new FormControl('', [Validators.required, Validators.email]);
    let sameEmail = new FormControl('', CustomValidators.equalTo(email));

    this.contactForm = new FormGroup({
      full_name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      person_as: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      province_id: new FormControl('', Validators.required),
      city_id: new FormControl('', Validators.required),
      notes: new FormControl('', Validators.required),
      company_name: new FormControl(''),
      company_phone: new FormControl(''),
      brand_id: new FormControl(''),
      email: email,
      same_email: sameEmail,
    })
  }
  
  onFileChange(event:any) {
    this.nameFile = '';
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.nameFile = file['name'];
      this.fileToUpload = file;
    }
  }

  equals(objOne:any, objTwo:any) {
    if (typeof objOne != 'undefined' && typeof objTwo != 'undefined') {
      return objOne.id == objTwo.id;
    }
  }

  // Brand
  getBrands(){
    let publish = 'T';
    let navbaronly = 'F';
    let sidx = 'id';
    let sort = 'asc';

    this.brandService.getBrands(publish, navbaronly, sidx, sort)
    .subscribe(brand => {
      this.brands = brand['kitchenart']['results'];
    });
  }

  getProvince(): void {
    this.provinceService.getProvinces()
    .subscribe(provinces => {
      this.provinces = provinces['kitchenart']['results'];
    });
  }

  getCityByProvince(province_id:number): void {
    this.cityDisabled = false;
    this.cityService.getCities(province_id)
    .subscribe(cities => {
      this.cities = cities['kitchenart']['results'];
    });
  }

  getKitchenDesign(){
    const kitchen_id = this.params
    const sidx = 'id'
    const sort = 'desc'
    const limit = 10
    const offset = 0

    this.freeKitchenService.getKitchenDesigns(kitchen_id, sidx, sort, limit, offset)
    .subscribe(freeKitchen => {
      this.freeKitchen = freeKitchen['kitchenart']['results'];
    })
  }

  getCategoryKitchen() {
    this.categoryService.getCategoryKitchenPartner()
    .subscribe( category => {
      this.categoriesKitchen = category['kitchenart']['results']
    });
  }

  getKitchenPartner() {
    this.freeKitchenService.getKitchenPartners(this.params)
    .subscribe(kitchenPartner => {
      this.kitchenPartner = kitchenPartner['kitchenart']['results']
    })
  }

  saveContact(){
    const formModel = this.contactForm.value;
    this.preferredDesign = [];
    this.category = [];
    this.brandsId = []

    if(this.preferred_designs){
      this.preferred_designs.value.forEach((item:any) => {
        this.preferredDesign.push(item.id);
      });
    }
    if(this.brandIds){
      this.brandIds.value.forEach((value:any) => {
        this.brandsId.push(value.id);
      });
    }
    if(this.categories){
      this.categories.value.forEach((value:any) => {
        this.category.push(value.id);
      });
    }

    this.freeKitchenService.freeKitchenDesignContact(formModel, this.params, this.preferredDesign, this.category, this.brandsId)
    .subscribe(freekitchen => {
      let status = freekitchen['kitchenart']['status']['code']
      if(status != 200){
        this.showError()
      }
      else{
        this.freeKitchenService.freeKitchenDesignUpload(this.fileToUpload)
        .subscribe((image:any) => {
          let imageStatus = image['type']
          if(imageStatus == 0){
            this.showSuccess()
            setTimeout(()=>{
              this.reset();
              this.router.navigate(['partner_kitchens/', this.kitchenPartner['url']]);
            },2000);
          }
        })
      }
    })
  }

  reset() {
    this.createForm();
  }

  showSuccess() {
    this.toastr.success('Contact success send', 'Succes');
  }

  showError() {
    this.toastr.error('Please complete the contact form', 'Oops!');
  }

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
