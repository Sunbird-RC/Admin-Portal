import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SchemaService } from '../../services/data/schema.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'src/app/app.config';
import { KeycloakService } from 'keycloak-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'create-vc-template',
  templateUrl: './create-vc-template.component.html',
  styleUrls: ['./create-vc-template.component.scss']
})
export class CreateVcTemplateComponent implements OnInit, OnChanges {
  @Input() usecaseSchema;
  thumbnailItems: any = []
  params: any;
  entityName: any;
  usecase: any;
  vcObject: any;
  schemaName: string;
  isShow1: boolean;
  isShow2: boolean;
  res2: any;
  items: any = []
  userHtml1 = '';
  credTemp: any = []
  baseUrl = this.config.getEnv('baseUrl');
  token: any;
  paramFromRoute: any;
  tempStr: any;
  iframe: any;

  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public location: Location,
    public schemaService: SchemaService,
    public generalService: GeneralService,
    public translate: TranslateService,
    private config: AppConfig,
    public keycloakService: KeycloakService
  ) {

  }


  ngOnChanges(changes: SimpleChanges): void {
    const latestRequest = changes['usecaseSchema'];
    if (latestRequest.currentValue) {
      this.entityName = latestRequest.currentValue;
      this.loadPage();
    }
  }


  ngOnInit() {

    this.keycloakService.getToken().then((res) => {
      this.token = res;
    });

    this.generalService.getData('/Schema').subscribe((res) => {
      this.readSchema(res);

      this.getCredTemplate();
      this.injectHTML();
    });

    this.activeRoute.params.subscribe(params => {
      this.params = params;


      if (this.params.hasOwnProperty('usecase')) {
        this.usecase = params.usecase;
        this.usecase = params.usecase;
        if (this.usecase == 'vcmodule') {
          this.isShow1 = true;
          this.isShow2 = true;
        }
        else if (this.usecase == 'attestmodule') {
          this.isShow1 = false;
          this.isShow2 = true;
        }
        else if (this.usecase == 'divoc') {
          this.isShow1 = true;
          this.isShow2 = false;
        }
        else if (this.usecase == 'education') {
          this.isShow1 = true;
          this.isShow2 = false;
        }else{
          this.isShow1 = true;
        }
      }

      if (this.params.hasOwnProperty('entity')) {
        this.entityName = params.entity;
      } else {
        let temp = window.location.href.split('/');
        this.entityName = temp[temp.length - 1]
      }

    });
  }

  async loadPage() {
    this.credTemp = [];
    await this.getCredTemplate();
    this.injectHTML();
  }


  readSchema(res) {
    for (let i = 0; i < res.length; i++) {
      if (typeof (res[i].schema) == 'string') {
        res[i].schema = JSON.parse(res[i].schema);

        if (!res[i].schema.hasOwnProperty('isRefSchema') && !res[i].schema.isRefSchema) {
          this.items.push(res[i]);
        }
      }
    }
  }


  getCredTemplate() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]["name"] == this.entityName) {
        let certificateTemplate = this.items[i]["schema"]["_osConfig"]["certificateTemplates"];

        let self = this;
        Object.keys(certificateTemplate).forEach(function (k) {

          let CertTitle = k;
          let certVal = certificateTemplate[k];

          let c = certVal.toString();
          let d = c.split("Schema/");

          self.generalService.getText('/Schema/' + d[1]).subscribe((res) => {
            self.credTemp.push({
              "title": CertTitle,
              "html": res,
            });

          }, (err) => {
            console.log({ err });
          })

        });

      }
    }

  }


  injectHTML() {

    setTimeout(() => {
      for (let i = 0; i < this.credTemp.length; i++) {
        let iframe: HTMLIFrameElement = document.getElementById('iframe' + i) as HTMLIFrameElement;

        if (iframe) {

          var iframedoc;
          if (iframe['contentDocument'])
            iframedoc = iframe.contentDocument;
          else if (iframe['contentWindow'])
            iframedoc = iframe.contentWindow.document;


          if (iframedoc) {
            // Put the content in the iframe
            iframedoc.open();
            iframedoc.writeln(this.credTemp[i].html);

            iframedoc.close();
          } else {
            alert('Cannot inject dynamic contents into iframe.');
          }
        } else {
          this.injectHTML();
        }
      }
    }, 1000)

  }


  openAddVc() {
    this.location.replaceState('/add-template/' + this.usecase + '/' + this.entityName);
  }



}
