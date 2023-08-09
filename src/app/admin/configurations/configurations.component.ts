import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; 
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {
  tenantConfigList:  Array<String>;
  @Input() schemaItems;
  usecase: any;
  public res;
  addvc: boolean = true;
  params: any;
  currentTab: number;
  constructor(public translate: TranslateService, public router : Router, public generalService: GeneralService) { 
    this.tenantConfigList = ['Schema','Workflow','VC Template','Ownership','Roles','Theme']
  }
  imgUrl="/assets/images/certificate.svg";
  ngOnInit(): void {


    this.generalService.getData('/Schema').subscribe((res) => {
      this.res = res;
      this.usecase = res[0].referedSchema;
      if(this.usecase === 'attestmodule' || this.usecase === 'ownershipmodule' || this.usecase === 'attestownershipmodule' || this.usecase === 'newmodule'){
        this.addvc = false;
      }else{
        this.addvc = true;
      }
    })
  }

  addVC(){
    if(this.res.length > 1){
      if(this.usecase == 'vcmodule' || this.usecase == 'divoc' || this.usecase == 'issuance'){
        this.currentTab = 1;
      }
      else{
        this.currentTab = 2;
      }
      this.router.navigateByUrl('/create/' + this.currentTab  + '/' + this.usecase + '/' );
    }
    else{
      alert('No schema Exists, Please add the Schema');
    }
  }
}
