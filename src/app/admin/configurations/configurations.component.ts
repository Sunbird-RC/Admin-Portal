import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from 'src/app/services/general/general.service';
import { SchemaService } from '../../services/data/schema.service';

@Component({
  selector: 'configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {
  tenantConfigList: Array<String>;
  @Input() schemaItems;
  usecase: any;
  public res;
  addvc: boolean = true;
  params: any;
  currentTab: number;
  allUsecases: any;
  entityKey: any;
  constructor(public translate: TranslateService, public router: Router, public generalService: GeneralService, public schemaService: SchemaService) {
    this.tenantConfigList = ['Schema', 'Workflow', 'VC Template', 'Ownership', 'Roles', 'Theme']
  }
  imgUrl = "/assets/images/certificate.svg";

  ngOnInit(): void {

    this.generalService.getData('/Schema').subscribe((res) => {
      this.res = res;
      this.usecase = res[0].referedSchema;
      if (this.usecase === 'attestmodule' || this.usecase === 'ownershipmodule' || this.usecase === 'attestownershipmodule' || this.usecase === 'newmodule') {
        this.addvc = false;
      } else {
        this.addvc = true;
      }
    })

    this.schemaService.getEntitySchemaJSON().subscribe((data) => {
      this.allUsecases = data['usecase'];
    })
  }

  addVC(schemaName) {
     if (this.res.length === 1) {
      const temp = JSON.parse(this.res[0]['schema']);
      if (temp.hasOwnProperty('isRefSchema')) {
        alert('Only Common Schema exists, please add other schema!');
      } else {
        this.entityKey = temp.title;
        this.navigateToCreateVC(schemaName);
      }
    } else {
      for (let i = 0; i < this.res.length; i++) {
        let temp = JSON.parse(this.res[i]['schema'])
        if (!temp.hasOwnProperty('isRefSchema')) {
          this.entityKey = temp.title;
          break;
        }
      }
      this.navigateToCreateVC(schemaName);
    }
  }

  navigateToCreateVC(schemaName) {
    Object.keys(this.allUsecases).forEach((key) => {
      if (key === this.usecase) {
        this.allUsecases[key]['steps']?.forEach((step, i) => {
          if (step['key'] === 'create-vc') {
            this.currentTab = i.toString();
          }
        });
      }
    });
    if(schemaName == ''){
    this.router.navigateByUrl('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);
    }
    if(schemaName !== ''){
      this.entityKey = schemaName;
      this.router.navigateByUrl('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);
      }

  }
    
    viewOrEditSchema(status: string, schemaName : string) {
      this.entityKey = schemaName;
      if (status === 'PUBLISHED') {
        this.router.navigateByUrl('/create/0' + '/' + this.usecase + '/' + this.entityKey);    
      } else if (status === 'DRAFT') {
        this.router.navigateByUrl('/create/0' + '/' + this.usecase + '/' + this.entityKey);
      }
    }

    previewCertificate(){
      const anchorTag = document.getElementById('previewLink');
      if (anchorTag) {
        anchorTag.click();
      }
    }
  }
  
