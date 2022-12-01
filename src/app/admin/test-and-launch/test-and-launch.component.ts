import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'test-and-launch',
  templateUrl: './test-and-launch.component.html',
  styleUrls: ['./test-and-launch.component.scss']
})
export class TestAndLaunchComponent implements OnInit {
  linkImage: string = "assets/images/thumbnail.png";
  fixedImage: string = "assets/images/thumbnail.png"
  schemaName: string;
  vcObject: any;
  thumbnailItems: any = []
  constructor(private router: Router, public translate: TranslateService) { }

  ngOnInit(): void {

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
  }
  testAndVerify(){
    this.router.navigate(['/test-and-verify']);
  }
}
