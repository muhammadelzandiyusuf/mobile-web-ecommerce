import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { BussinessPartnersComponent } from '../modules/member/bussiness-partners/bussiness-partners.component';

const BussinessRoutes: Routes = [
  { path: 'business_partner/register', component: BussinessPartnersComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(BussinessRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class BussinessPartnersRoutingModule { }
