import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from '../modules/product/product/product.component';
import { ProductListBrandComponent } from '../modules/product/product-list-brand/product-list-brand.component';
import { ProductDetailComponent } from '../modules/product/product-detail/product-detail.component';
import { ProductDetailPackageComponent } from '../modules/product/product-detail-package/product-detail-package.component';
import { PackageDealComponent } from '../modules/product/package-deal/package-deal.component';
import { ProductPromoComponent } from '../modules/product/product-promo/product-promo.component';
import { ProductSearchComponent } from '../modules/product/product-search/product-search.component';
import { ProductCompareComponent } from '../modules/product/product-compare/product-compare.component';
import { TradeInComponent } from '../modules/product/trade-in/trade-in.component';
import { TradeInFormComponent } from '../modules/product/trade-in-form/trade-in-form.component';
import { SearchComponent } from '../modules/search/search.component';
import { ProductDetailDiscussComponent } from '../modules/product/product-detail-discuss/product-detail-discuss.component';
import { ProductListCategoryComponent } from '../modules/product/product-list-category/product-list-category.component';
import { GiveAwayComponent } from '../modules/product/give-away/give-away.component';
import { ProductEventComponent } from '../modules/product/product-event/product-event.component';
import { ProductAccessoriesComponent } from '../modules/product/product-accessories/product-accessories.component';
import { ProductCommercialComponent } from '../modules/product/product-commercial/product-commercial.component';

const productRoutes: Routes = [
  { path: 'product/:group', component: ProductComponent },
  { path: 'category/:url', component: ProductListCategoryComponent },
  { path: 'brand/:brand', component: ProductListBrandComponent },
  { path: 'package/deal', component: PackageDealComponent },
  { path: 'package/free', component: GiveAwayComponent },
  { path: 'base/:id', component: ProductDetailComponent },
  { path: 'package/:id', component: ProductDetailPackageComponent },
  { path: 'promo/:url', component: ProductPromoComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search/result', component: ProductSearchComponent },
  { path: 'compare/:url', component: ProductCompareComponent },
  { path: 'trade_in', component: TradeInComponent },
  { path: 'trade_in/:url', component: TradeInFormComponent },
  { path: 'discussion/:url', component: ProductDetailDiscussComponent },
  { path: 'event/:url', component: ProductEventComponent },
  { path: 'accessories/:url', component: ProductAccessoriesComponent },
  { path: 'commercial', component: ProductCommercialComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(productRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class ProductRoutingModule { }
