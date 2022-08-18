import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

}
