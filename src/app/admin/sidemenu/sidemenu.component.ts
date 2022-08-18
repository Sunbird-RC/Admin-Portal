import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
 // @Output() activeMenu = new EventEmitter<any>();

status: boolean = false;
activeMenu: string = 'get-started';
  params: any;
  sideMenu: any;
  menus: any;
  an_menus: any;
  currentMenu: number = 0;
constructor(
  private activeRoute: ActivatedRoute
) { }

  ngOnInit(): void {

    this.activeRoute.params.subscribe(params => {
      this.params = params;

      if(params.hasOwnProperty('page') && params.page)
      this.activeMenu = params.page;
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
