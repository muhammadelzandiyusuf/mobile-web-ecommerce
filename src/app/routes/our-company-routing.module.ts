import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from '../modules/our-company/about-us/about-us.component';
import { MediaCenterComponent } from './../modules/our-company/media-center/media-center/media-center.component';
import { MediaCenterDetailComponent } from './../modules/our-company/media-center/media-center-detail/media-center-detail.component';
import { ContactComponent } from '../modules/our-company/contact/contact.component';
import { CareersComponent } from '../modules/our-company/careers/career/careers.component';
import { CareerFormComponent } from '../modules/our-company/careers/career-form/career-form.component';

const ourCompanyRoutes: Routes = [
  { path: 'about_us', component: AboutUsComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'careers/:url', component: CareerFormComponent },
  { path: 'media_center', component: MediaCenterComponent },
  { path: 'media_center/:url', component: MediaCenterDetailComponent },
  { path: 'contact_us', component: ContactComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ourCompanyRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class OurCompanyRoutingModule { }
