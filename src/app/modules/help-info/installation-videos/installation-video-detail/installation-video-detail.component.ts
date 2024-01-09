import { Component, OnInit } from '@angular/core';
import { InstallationVideoService } from '../../../../service/installation-video/installation-video.service';
import { TermService } from '../../../../service/term/term.service';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-installation-video-detail',
  templateUrl: './installation-video-detail.component.html',
  styleUrls: ['./installation-video-detail.component.css']
})
export class InstallationVideoDetailComponent implements OnInit {
  videos: any;
  title: any;
  videoUrl: any;
  descriptionIndonesia: any;
  descriptionEnglish: any;
  metaTag: any;
  lang: any;

  constructor(
    private installationVideoService: InstallationVideoService,
    private termService: TermService,
    private route: ActivatedRoute,
    private meta: Meta,
    private titleService: Title,
    private sanitizer: DomSanitizer,
    private localSt: LocalStorageService
  ) { 
    this.route.params.subscribe((params: any) => {
      this.getMeta()
      this.lang = this.localSt.retrieve('lang');
      this.getVideoDetail(params['id']);     
    })
  }

  ngOnInit() {
  }

  getMeta() {
    this.termService.getTagMeta()
      .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];

        this.meta.addTags([
          { name: 'description', content: this.metaTag['meta_description'] },
          { name: 'author', content: 'kitchenart.id' },
          { name: 'keywords', content: this.metaTag['meta_keyword'] }
        ]);
      })
  }

  getVideoDetail(id: any) {
    this.installationVideoService.getInstallationVideoDetail(id)
    .subscribe((detail: any) => {
      this.videos = detail['kitchenart']['results']
      this.title = this.videos['title']
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videos['embed_url'])
      this.descriptionIndonesia = this.videos['description_indonesia']
      this.descriptionEnglish = this.videos['description_english']

      this.titleService.setTitle('KitchenArt - ' + this.title);
    });
  }

}
