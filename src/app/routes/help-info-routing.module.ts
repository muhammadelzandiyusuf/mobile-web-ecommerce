import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippingInfoComponent } from '../modules/help-info/shipping-info/shipping-info.component';
import { TermConditionComponent } from '../modules/help-info/term-condition/term-condition.component';
import { PrivacyPolicyComponent } from '../modules/help-info/privacy-policy/privacy-policy.component';
import { LegalStatementComponent } from '../modules/help-info/legal-statement/legal-statement.component';
import { ProductManualComponent } from '../modules/help-info/product-manual/product-manual/product-manual.component';
import { ProductManualDetailComponent } from '../modules/help-info/product-manual/product-manual-detail/product-manual-detail.component';
import { InstallationVideoComponent } from '../modules/help-info/installation-videos/installation-video/installation-video.component';
import { InstallationVideoDetailComponent } from '../modules/help-info/installation-videos/installation-video-detail/installation-video-detail.component';
import { CertifiedTechnicianComponent } from '../modules/help-info/certified-technicians/certified-technician/certified-technician.component';
import { CertifiedTechnicianDetailComponent } from '../modules/help-info/certified-technicians/certified-technician-detail/certified-technician-detail.component';
import { WarrantyComponent } from '../modules/help-info/warranty/warranty.component';
import { FaqComponent } from '../modules/help-info/faq/faq/faq.component';
import { FaqListComponent } from '../modules/help-info/faq/faq-list/faq-list.component';
import { FaqDetailComponent } from '../modules/help-info/faq/faq-detail/faq-detail.component';
import { ServiceInstallationComponent } from '../modules/help-info/service-installation/service-installation/service-installation.component';
import { ServiceInstallationFormComponent } from '../modules/help-info/service-installation/service-installation-form/service-installation-form.component';

const helpInfoRoutes: Routes = [
  { path: 'shipping_info', component: ShippingInfoComponent },
  { path: 'terms_condition', component: TermConditionComponent },
  { path: 'privacy_policy', component: PrivacyPolicyComponent },
  { path: 'legal_statement', component: LegalStatementComponent },
  { path: 'manual_product', component: ProductManualComponent },
  { path: 'manual_product/:url', component: ProductManualDetailComponent },
  { path: 'installation_video', component: InstallationVideoComponent },
  { path: 'installation_video/:id', component: InstallationVideoDetailComponent },
  { path: 'certified_technician', component: CertifiedTechnicianComponent},
  { path: 'certified_technician/:id', component: CertifiedTechnicianDetailComponent},
  { path: 'register_warranty', component: WarrantyComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'faq/:url', component: FaqListComponent },
  { path: 'faq/:category/:url', component: FaqDetailComponent },
  { path: 'service_installations', component: ServiceInstallationComponent },
  { path: 'service_installations/:url', component: ServiceInstallationFormComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(helpInfoRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class HelpInfoRoutingModule { }
