import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
 // @Output() activeMenu = new EventEmitter<any>();

status: boolean = false;
activeMenu: string = '';
  params: any;
  sideMenu: any;
  menus: any;
  an_menus: any;
  currentMenu: number = 0;
  items = []
constructor(
  private activeRoute: ActivatedRoute,
  private generalService: GeneralService
) { }

  ngOnInit(): void {

    this.activeRoute.params.subscribe(params => {
      this.params = params;

      if(params.hasOwnProperty('page') && params.page)
     // this.activeMenu = params.page;
      console.log({params});
    });

     this.generalService.getData('/Schema').subscribe((res) => {
     this.readSchema(res);
    });
  }


  readSchema(res)
  {
    for(let i =0; i < res.length; i++)
    {
      res[i].schema = JSON.parse(res[i].schema);
      this.items.push(res[i]);
    }
//      this.items = res;

  }

  openMenu(menu){
  //  this.activeMenu = menu;
   // this.activeMenu.emit(menu);

  }

  clickEvent() {
    this.status = !this.status;
  }

}
