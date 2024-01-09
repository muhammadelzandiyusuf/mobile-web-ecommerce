import { Component, OnInit } from '@angular/core';
import { CertifiedTechnicianService } from '../../../../service/certified-technician/certified-technician.service';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-certified-technician-detail',
  templateUrl: './certified-technician-detail.component.html',
  styleUrls: ['./certified-technician-detail.component.css']
})
export class CertifiedTechnicianDetailComponent implements OnInit {
  actived: number = 1
  metaTag: any;
  technician: any;
  id: any;
  staff_id: any;
  name: any;
  age: any;
  date_start_working: any;
  image_domain: any;
  image_path: any;
  image: any;
  avg_rating: any;
  reviews: any;
  location: any;
  city_name: any;
  categories: any;
  categorySkill: any;
  lang: any;

  constructor(
    private technicianService: CertifiedTechnicianService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private route: ActivatedRoute,
    private localSt: LocalStorageService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getDetailTechnician(params['id']);
      this.getMeta()
      this.getCategories()
      this.titleService.setTitle('KitchenArt - Certified Technician');
    })
    this.lang = this.localSt.retrieve('lang');
  }

  ngOnInit() {
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

  getCategorySkill(parent_id: any) {
      this.actived = parent_id
      this.getSkills()
  }

  getSkills() {
    this.technicianService.getTechnicianSkill(this.id, this.actived)
    .subscribe((technician: any) => {
        this.categorySkill = technician['kitchenart']['results']
    })
  }

  getCategories() {
    this.technicianService.getTechnicianCategory()
    .subscribe((category: any) => {
        this.categories = category['kitchenart']['results']
    })
  }

  getDetailTechnician(staff_id: any) {
    this.technicianService.getTechnicianDetail(staff_id)
    .subscribe((technician: any) => {
      this.technician = technician['kitchenart']['results']
      this.id = this.technician['id']
      this.staff_id = this.technician['staff_id']
      this.name = this.technician['name']
      this.age = this.technician['age']
      this.date_start_working = this.technician['date_start_working']
      this.image_domain = this.technician['image_domain']
      this.image_path = this.technician['image_path']
      this.image = this.technician['image']
      this.avg_rating = this.technician['avg_rating']
      this.reviews = this.technician['reviews']
      this.location = this.technician['location']
      this.city_name = this.location['city_name']

      this.getSkills()
    })
  }

}
