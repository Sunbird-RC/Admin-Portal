import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'create-vc-template',
  templateUrl: './create-vc-template.component.html',
  styleUrls: ['./create-vc-template.component.scss']
})
export class CreateVcTemplateComponent implements OnInit {
  thumbnailItems: any = [{
    "thumbnailUrl": "/assets/images/thumbnail.png"
  },
  {
    "thumbnailUrl": "/assets/images/thumbnail.png"
  }]
  params: any;
  entityName: any;
  usecase: any;
  vcObject: any;
  schemaName: string;
  isShow1 :boolean;
  isShow2: boolean;
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public location: Location
  ) { }

  ngOnInit() {

    this.activeRoute.params.subscribe(params => {
      this.params = params;
      console.log({ params });

      if (this.params.hasOwnProperty('usecase')) {
        this.usecase = params.usecase;
this.usecase = params.usecase;
        if(this.usecase == 'issuance')
        {
          this.isShow1 =true;
          this.isShow2 = true;
        }
        else if(this.usecase == 'atstandclaim')
        {
          this.isShow1 = false;
          this.isShow2 = true;
        }
        else if(this.usecase == 'divoc')
        {
          this.isShow1 = true;
          this.isShow2 = false;
        }
        else if(this.usecase == 'education')
        {
          this.isShow1 = true;
          this.isShow2 = false;
        }
      }

      if (this.params.hasOwnProperty('entity')) {
        this.entityName = params.entity;
      }else{
        let temp =  window.location.href.split('/');
        this.entityName = temp[temp.length - 1]
      }

      let schemaVc = localStorage.getItem('schemaVc');
      if (schemaVc != undefined) {
        schemaVc = JSON.parse(schemaVc);
        let self = this;
        Object.keys(schemaVc).forEach(function (key) {
          self.schemaName = key;
          self.vcObject = schemaVc[key];

          self.thumbnailItems.push({
            "thumbnailUrl": "/assets/images/thumbnail.png",
            "title" : self.vcObject.name,
            "description" : self.vcObject.description,
            "html" : self.vcObject.html
          })
        });
      }
    });
  }


  openAddVc(){
    this.location.replaceState('/add-template/' + this.usecase + '/' + this.entityName);
  }



}
