import { Component, OnInit, HostListener } from '@angular/core';
import { ProjectReferenceService } from '../../../../service/project-reference/project-reference.service';
import { Router } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-project-reference',
  templateUrl: './project-reference.component.html',
  styleUrls: ['./project-reference.component.css']
})
export class ProjectReferenceComponent implements OnInit {

  public formModalSortby: boolean = false;
  filterSortbys: string = '6';

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  projectId: number;
  arrayProject: Array<any> = []
  provinces: any = [];
  projects: Array<any> = [];
  metaTag: any;

  constructor(
    private router: Router,
    private projectService: ProjectReferenceService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Project Reference');
  }

  ngOnInit() {
    this.getProvinceProject()
    this.getProjectByProvinces()
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

  getProvinceProject() {
    this.projectService.getProjectReferenceProvince()
    .subscribe((province: any) => {
        this.provinces = province['kitchenart']['results'];
    })
  }

  getProjectByProvinces() {
    let province_id = this.filterSortbys;
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.projectService.getProjectReferenceByProvince(province_id, sidx, sort, limit, start)
    .subscribe((project: any) => {
        this.projects = project['kitchenart']['results'];
        this.arrayProject = project['kitchenart']['results'];
    });
  }

  getProjectProvince(province: any) {
    this.projectId = province
    let province_id = province;
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.projectService.getProjectReferenceByProvince(province_id, sidx, sort, limit, start)
    .subscribe((project: any) => {
        this.projects = project['kitchenart']['results'];
        this.arrayProject = project['kitchenart']['results'];
    });
  }

  getFilterSortby(): void {
    this.formModalSortby = true;
  }

  closeModal(): void{
    this.getProjectProvince(this.filterSortbys);
    this.formModalSortby = false;
  }

  goLink(link: any): void {
    this.router.navigate(['project_references/', link]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {

      if ((event.srcElement.scrollTop) >= (1058 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.projectService.getProjectReferenceByProvince(this.projectId, sidx, sort, limit, offset)
          .subscribe((showroom: any) => {
              this.arrayProject = this.arrayProject.concat(showroom['kitchenart']['results'])
              this.projects = this.arrayProject
          });

          this.page++;
      }
  }

}
