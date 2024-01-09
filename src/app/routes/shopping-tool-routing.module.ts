import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ShoppingToolComponent } from '../modules/shopping-tool/shopping-tool/shopping-tool.component';
import { ShowroomComponent } from '../modules/shopping-tool/showroom/showroom/showroom.component';
import { ShowroomDetailComponent } from '../modules/shopping-tool/showroom/showroom-detail/showroom-detail.component';
import { KitchentPartnersComponent } from '../modules/shopping-tool/kitchent-partners/kitchen-partner/kitchent-partners.component';
import { KitchenPartnerDetailComponent } from '../modules/shopping-tool/kitchent-partners/kitchen-partner-detail/kitchen-partner-detail.component';
import { CatalogueComponent } from '../modules/shopping-tool/catalogues/catalogue/catalogue.component';
import { CatalogueDetailComponent } from '../modules/shopping-tool/catalogues/catalogue-detail/catalogue-detail.component';
import { InquiryComponent } from '../modules/shopping-tool/inquiry/inquiry.component';
import { BrandGalleryComponent } from '../modules/shopping-tool/brand-gallery/brand-gallery/brand-gallery.component';
import { BrandGalleryListComponent } from '../modules/shopping-tool/brand-gallery/brand-gallery-list/brand-gallery-list.component';
import { BrandGalleryDetailComponent } from '../modules/shopping-tool/brand-gallery/brand-gallery-detail/brand-gallery-detail.component';
import { FreeKitchenDesignComponent } from '../modules/shopping-tool/free-kitchen-design/free-kitchen-design/free-kitchen-design.component';
import { FreeKitchenDesignDetailComponent } from '../modules/shopping-tool/free-kitchen-design/free-kitchen-design-detail/free-kitchen-design-detail.component';
import { FreeKitchenDesignFormComponent } from '../modules/shopping-tool/free-kitchen-design/free-kitchen-design-form/free-kitchen-design-form.component';
import { ExhibitionComponent } from '../modules/shopping-tool/exhibition/exhibition/exhibition.component';
import { ExhibitionDetailComponent } from '../modules/shopping-tool/exhibition/exhibition-detail/exhibition-detail.component';

const shoppingToolRoutes: Routes = [
  { path: 'shopping-tool', component: ShoppingToolComponent },
  { path: 'showrooms', component: ShowroomComponent },
  { path: 'showrooms/:url', component: ShowroomDetailComponent },
  { path: 'partner_kitchens', component: KitchentPartnersComponent },
  { path: 'partner_kitchens/:url', component: KitchenPartnerDetailComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'catalogue/:url', component: CatalogueDetailComponent },
  { path: 'inquiry', component: InquiryComponent },
  { path: 'brand_galleries', component: BrandGalleryComponent },
  { path: 'brand_galleries/:brand', component: BrandGalleryListComponent },
  { path: 'brand_galleries/:brand/:url', component: BrandGalleryDetailComponent },
  { path: 'free_kitchen_designs/:id', component: FreeKitchenDesignComponent },
  { path: 'free_kitchen_designs/:id/:url', component: FreeKitchenDesignDetailComponent },
  { path: 'form/free_kitchen_designs/:id', component: FreeKitchenDesignFormComponent },
  { path: 'exhibitions', component: ExhibitionComponent },
  { path: 'exhibitions/:url', component: ExhibitionDetailComponent },
  { path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [
    RouterModule.forChild(shoppingToolRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class ShoppingToolRoutingModule { }
