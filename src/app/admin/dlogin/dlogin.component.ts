import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dlogin',
  templateUrl: './dlogin.component.html',
  styleUrls: ['./dlogin.component.scss']
})
export class DloginComponent implements OnInit {

  params: any;
  isSettingMenu: boolean = false;
  status: boolean = false;
  activeMenu: string;
   
    sideMenu: any;
    menus: any;
    an_menus: any;
    currentMenu: number = 0;
  constructor(
    private activeRoute: ActivatedRoute,
    public translate: TranslateService) {  }

  ngOnInit(): void {
  
  this.activeRoute.params.subscribe(params => {
    this.params = params;

    if(params.hasOwnProperty('page') && params.page)
    this.isSettingMenu = true;
    console.log({params});
  });
}

openMenu(menu){
  this.activeMenu = menu;
 // this.activeMenu.emit(menu);

}

clickEvent() {
  this.status = !this.status;
}

}
