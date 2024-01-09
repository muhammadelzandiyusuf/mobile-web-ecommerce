import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CulinaryClassesComponent } from '../modules/culinary-classes/culinary-classes/culinary-classes.component';
import { WineDineComponent } from '../modules/culinary-classes/wine-dine/wine-dine.component';
import { WineDineDetailComponent } from '../modules/culinary-classes/wine-dine-detail/wine-dine-detail.component';
import { CookingClasssComponent } from '../modules/culinary-classes/cooking-class-demo/cooking-classs/cooking-classs.component';
import { CookingClassDetailComponent } from '../modules/culinary-classes/cooking-class-demo/cooking-class-detail/cooking-class-detail.component';
import { CafeRestoComponent } from '../modules/culinary-classes/cafe-resto/cafe-resto/cafe-resto.component';
import { CafeRestoDetailComponent } from '../modules/culinary-classes/cafe-resto/cafe-resto-detail/cafe-resto-detail.component';
import { RecipeComponent } from '../modules/culinary-classes/recipes/recipe/recipe.component';
import { RecipeDetailComponent } from '../modules/culinary-classes/recipes/recipe-detail/recipe-detail.component';
import { CookingClassRegistrationComponent } from '../modules/culinary-classes/cooking-class-demo/cooking-class-registration/cooking-class-registration.component';
import { CookingClassThanksComponent } from '../modules/culinary-classes/cooking-class-demo/cooking-class-thanks/cooking-class-thanks.component';

const culinaryClassesRoutes: Routes = [
  { path: 'culinary_classes', component: CulinaryClassesComponent },
  { path: 'wine_dine', component: WineDineComponent },
  { path: 'wine_dine/:url', component: WineDineDetailComponent },
  { path: 'cooking_class_demo', component: CookingClasssComponent },
  { path: 'cooking_class_demo/:url', component: CookingClassDetailComponent },
  { path: 'cooking_class_demo/registration/:url', component: CookingClassRegistrationComponent },
  { path: 'cooking_class_demo/registration/:register/:url', component: CookingClassThanksComponent },
  { path: 'cafe_resto', component: CafeRestoComponent },
  { path: 'cafe_resto/:url', component: CafeRestoDetailComponent },
  { path: 'recipes', component: RecipeComponent },
  { path: 'recipes/:url', component: RecipeDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(culinaryClassesRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class CulinaryClassesRoutingModule { }
