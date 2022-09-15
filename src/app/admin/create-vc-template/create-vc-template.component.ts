import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'create-vc-template',
  templateUrl: './create-vc-template.component.html',
  styleUrls: ['./create-vc-template.component.scss']
})
export class CreateVcTemplateComponent implements OnInit {
  thumbnailItems : any = [{
    "thumbnailUrl" : "/assets/images/thumbnail.png"
  },
  {
    "thumbnailUrl" : "/assets/images/thumbnail.png"
  }]
  params: any;
  entityName: any;
  usecase: any;
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {

    this.activeRoute.params.subscribe(params => {
      this.params = params;
      console.log({params});

      if (this.params.hasOwnProperty('entity')) {
        this.entityName = params.entity;
        this.usecase = params.usecase;


      }
  });
  
  }
}
