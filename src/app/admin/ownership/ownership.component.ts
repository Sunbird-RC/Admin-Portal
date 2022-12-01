import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.scss']
})
export class OwnershipComponent implements OnInit {
  params: any;
  isSettingMenu: boolean = false;

  constructor(
    private activeRoute: ActivatedRoute,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.params = params;

      if(params.hasOwnProperty('page') && params.page)
      this.isSettingMenu = true;
      console.log({params});
    });
  }

}
