import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {

    this.activeRoute.params.subscribe(params => {
      this.params = params;
      console.log({ params });

      if (this.params.hasOwnProperty('entity')) {
        this.entityName = params.entity;
        this.usecase = params.usecase;
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






}
