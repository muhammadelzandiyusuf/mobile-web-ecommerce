import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../modules/home/home.component';
import { NotFoundComponent } from '../modules/views/not-found/not-found.component';
import { LandingComponent } from '../modules/views/landing/landing.component';

const homeRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'landing', component: LandingComponent },
  { path: '404', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class HomeRoutingModule { }
