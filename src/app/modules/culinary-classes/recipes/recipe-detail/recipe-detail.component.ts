import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../../service/recipe/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  metaTag: any;
  metaKeyword: any;
  metaDescription: any;
  recipes: any;
  videoUrl: any
  title: any;
  contentEnglish: any;
  contentIndonesia: any;
  imageDomain: any;
  bannerPath: any;
  bannerImage: any;
  courseTitle: any;
  cuisineTitle: any;
  hostName: any;
  hostUrl: any;
  products: any;

  config: any = {};
  heightVideo: string;
  link: string;
  media: string;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private deviceService: DeviceDetectorService
  ) { 
    this.route.params.subscribe(params => {
      this.getDetailRecipe(params['url'])
    })
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

  ngOnInit() {
    this.epicFunction()
  }

  epicFunction() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if(isMobile){
      this.heightVideo = "250px"
      this.config = {
        slidesPerView: 2,
        spaceBetween: 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      };
    }
    else if(isTablet){
      this.heightVideo = "500px"
      this.config = {
        slidesPerView: 3,
        spaceBetween: 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      };
    }
  }

  getDetailRecipe(url: any) {
    this.recipeService.getRecipeDetail(url)
    .subscribe((recipe: any) => {
      this.recipes = recipe['kitchenart']['results']
      this.imageDomain = this.recipes['image_domain']
      this.bannerPath = this.recipes['image_path']
      this.bannerImage = this.recipes['image']
      this.courseTitle = this.recipes['course_title']
      this.cuisineTitle = this.recipes['cuisine_title']
      this.hostName = this.recipes['host_name']
      this.hostUrl = this.recipes['host_url']
      this.title = this.recipes['title']
      this.contentEnglish = this.recipes['content_english']
      this.contentIndonesia = this.recipes['content_indonesia']
      this.products = this.recipes['products']
      this.link = this.recipes['web_domain'] + '/recipes/' + url
      this.media = this.imageDomain + '/' + this.bannerPath + '/' + this.bannerImage;

      if(this.recipes['video_url']){
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.recipes['video_url']);
      }

      let keyword = this.recipes['meta_keyword']
      let description = this.recipes['meta_description']
      this.getMeta(keyword, description)

      this.titleService.setTitle('KitchenArt - ' + this.title);
    })
  }

  getDetailHost(url: any){
    this.router.navigate(['partner_chefs/', url]);
  }

  goProductDetail(id: any) {
    this.router.navigate(['base/', id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  shareButtonFB() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + this.link, '_blank');
  }

  shareButtonWA() {
    window.open('whatsapp://send?text=' + this.link, '_blank');
  }

  shareButtonTW() {
    window.open('https://twitter.com/share?url='+ this.link + '&text=' + this.title + '&via=kitchenart_id', '_blank');
  }

  shareButtonPinterest() {
    window.open('https://pinterest.com/pin/create/button/?url=' + this.link + '&media=' + this.media + '&description=' + this.title, '_blank');
  }

}
