import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessionalResourceComponent } from '../modules/professional-resource/professional-resource/professional-resource.component';
import { ArchitectComponent } from '../modules/professional-resource/architect/architect/architect.component';
import { ArchitectDetailComponent } from '../modules/professional-resource/architect/architect-detail/architect-detail.component';
import { ArchitectPortfolioComponent } from '../modules/professional-resource/architect/architect-portfolio/architect-portfolio.component';
import { ContractorComponent } from '../modules/professional-resource/contractor/contractor/contractor.component';
import { ContractorDetailComponent } from '../modules/professional-resource/contractor/contractor-detail/contractor-detail.component';
import { ContractorPortfolioComponent } from '../modules/professional-resource/contractor/contractor-portfolio/contractor-portfolio.component';
import { HostComponent } from '../modules/professional-resource/host/host/host.component';
import { HostDetailComponent } from '../modules/professional-resource/host/host-detail/host-detail.component';
import { VideoComponent } from '../modules/professional-resource/video/video/video.component';
import { VideoListComponent } from '../modules/professional-resource/video/video-list/video-list.component';
import { VideoDetailComponent } from '../modules/professional-resource/video/video-detail/video-detail.component';
import { ProjectReferenceComponent } from '../modules/professional-resource/project-reference/project-reference/project-reference.component';
import { ProjectReferenceDetailComponent } from '../modules/professional-resource/project-reference/project-reference-detail/project-reference-detail.component';

const professionalResourceRoutes: Routes = [
  { path: 'professional-resource', component: ProfessionalResourceComponent },
  { path: 'interior_designers_architect_partners', component: ArchitectComponent },
  { path: 'interior_designers_architect_partners/:url', component: ArchitectDetailComponent },
  { path: 'interior_designers_architect_partners/portfolio/:url', component: ArchitectPortfolioComponent },
  { path: 'contractors_builders', component: ContractorComponent },
  { path: 'contractors_builders/:url', component: ContractorDetailComponent },
  { path: 'contractors_builders/portfolio/:url', component: ContractorPortfolioComponent },
  { path: 'partner_chefs', component: HostComponent },
  { path: 'partner_chefs/:url', component: HostDetailComponent },
  { path: 'videos', component: VideoComponent },
  { path: 'videos/list/:url', component: VideoListComponent },
  { path: 'videos/detail/:id', component: VideoDetailComponent },
  { path: 'project_references', component: ProjectReferenceComponent },
  { path: 'project_references/:url', component: ProjectReferenceDetailComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(professionalResourceRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class ProfesionalResourceModule { }
