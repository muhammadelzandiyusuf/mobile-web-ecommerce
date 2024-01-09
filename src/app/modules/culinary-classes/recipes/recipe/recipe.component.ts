import { Component, OnInit, HostListener } from '@angular/core';
import { RecipeService } from '../../../../service/recipe/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  filterCourseArr: any = [];
  public formModalCourse = false;

  filterCuisineArr: any = [];
  public formModalCuisine = false;

  filterHostArr: any = [];
  public formModalHost = false;

  filterBrandArr: any = [];
  public formModalBrand = false;

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  recipes: Array<any> = []
  arrayRecipe: Array<any> = []
  courses: Array<any> = []
  cuisines: Array<any> = []
  hosts: Array<any> = []
  brands: Array<any> = []
  metaTag: any;
  term: any;
  assetDomain: any;
  bannerPath: any;
  bannerImage: any;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.route.params.subscribe(params => {
      this.getBannerTerm()
    })
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Recipes');
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
    this.getCourseRecipe()
    this.getCuisineRecipe()
    this.getHostRecipe()
    this.getBrandRecipe()
    this.getRecipe()
  }

  getFilterCourse(): void {
    this.formModalCourse = true;
  }

  getFilterCuisine(): void {
    this.formModalCuisine= true;
  }

  getFilterHost(): void {
    this.formModalHost = true;
  }

  getFilterBrand(): void {
    this.formModalBrand = true;
  }

  closeModal(): void{
    this.getRecipe()
    this.formModalCourse = false;
    this.formModalCuisine = false;
    this.formModalHost = false;
    this.formModalBrand = false;
    this.page = 1
    this.offset = 0
  }

  getBannerTerm() {
    let slug = 'recipes'
    this.termService.getBannerTerms(slug)
      .subscribe((term: any) => {
        this.term = term['kitchenart']['results']
        this.assetDomain = this.term['image_domain']
        this.bannerPath = this.term['banner_path']
        this.bannerImage = this.term['banner_image']
      })
  }

  getRecipe() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 0;
    let start = 0;

    this.recipeService.getRecipes(sidx, sort, limit, start, this.filterCourseArr, this.filterCuisineArr, this.filterHostArr, this.filterBrandArr)
    .subscribe((restaurant: any) => {
        this.recipes = restaurant['kitchenart']['results'];
        // this.arrayRecipe = restaurant['kitchenart']['results'];
    });
  }

  getCourseRecipe() {
    this.recipeService.getRecipeCourse()
    .subscribe((recipe: any) => {
        this.courses = recipe['kitchenart']['results'];
    })
  }

  getCuisineRecipe() {
    this.recipeService.getRecipeCuisine()
    .subscribe((recipe: any) => {
        this.cuisines = recipe['kitchenart']['results'];
    })
  }

  getBrandRecipe() {
    this.recipeService.getRecipeBrand()
    .subscribe((recipe: any) => {
        this.brands = recipe['kitchenart']['results'];
    })
  }

  getHostRecipe() {
    this.recipeService.getRecipeHost()
    .subscribe((recipe: any) => {
        this.hosts = recipe['kitchenart']['results'];
    })
  }

  // @HostListener('scroll', ['$event'])
  // onScroll(event: any): void {
  //     if ((event.srcElement.scrollTop) >= (360 * this.page)) {
  //         this.offset = this.offset + this.limit;
  //         const sidx = 'id';
  //         const sort = 'asc';
  //         const limit = this.limit;
  //         const offset = this.offset;

  //         this.recipeService.getRecipes(sidx, sort, limit, offset, this.filterCourseArr, this.filterCuisineArr, this.filterHostArr, this.filterBrandArr)
  //         .subscribe((restaurant: any) => {
  //             this.arrayRecipe = this.arrayRecipe.concat(restaurant['kitchenart']['results'])
  //             this.recipes = this.arrayRecipe
  //         });

  //         this.page++;
  //     }
  // }

}
