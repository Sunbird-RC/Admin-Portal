import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general/general.service';
import { TranslateService } from '@ngx-translate/core';
import { SchemaService } from 'src/app/services/data/schema.service';

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
  items = [];
  isLoading : boolean = true;
  isSchemaCreated: boolean = false;
  usecase: string;
  currentTab: any;
  entityKey: any;
  res: any;
  allUsecases: any = {};
  showRoles: boolean = false;
  showHelp: boolean = false;
  showDashboard: boolean = true;
  
  constructor(
  private activeRoute: ActivatedRoute,
  private generalService: GeneralService,
  public translate: TranslateService,
  public router: Router,
  public schemaService: SchemaService
) { }

  ngOnInit(): void {

    this.activeRoute.params.subscribe(params => {
      this.params = params;

      if(params.hasOwnProperty('page') && params.page)
     // this.activeMenu = params.page;
      console.log({params});
    });

     this.generalService.getData('/Schema').subscribe((res) => {
      this.res = res;
      this.usecase = res[0].referedSchema;
     this.readSchema(res);
    }, (err)=>{
      this.items = [];
      this.isLoading = false;

    });

    this.schemaService.getEntitySchemaJSON().subscribe((data) => {
      this.allUsecases = data['usecase'];
    })
  }


  readSchema(res)
  {
    for(let i =0; i < res.length; i++)
    {
      if(typeof(res[i].schema)== 'string')
      {
        res[i].schema = JSON.parse(res[i].schema);
        this.isSchemaCreated = true;

        if( !res[i].schema.hasOwnProperty('isRefSchema') &&  !res[i].schema.isRefSchema){
          this.items.push(res[i]);
        }

        this.isLoading = false;
       
      }
     
    }
  }

  openMenu(menu){
  }

  navigateTo(actionType: string){
    let currentTab = actionType;
  
    for (let i = 0; i < this.res.length; i++) {
      let temp = this.res[i]['schema']
      if (!temp.hasOwnProperty('isRefSchema')) {
        this.entityKey = temp.title;
        break;
      }
    }
      Object.keys(this.allUsecases).forEach((key) => {
        if (key === this.usecase) {
          this.allUsecases[key]['steps']?.forEach((step, i) => {
          if (step['key'] && step['key'] === currentTab) {
            this.currentTab = i.toString();
            this.router.navigateByUrl('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);
            return;
          }     
        });
      }
      return;
    });
    if(this.currentTab == undefined){
      alert("The Selected Module does not involve this Step !");
    }   
  }

  show(menu){
    this.showDashboard = (menu == 'dashboard' ) ? true : false;
    this.showRoles = (menu == 'roles' ) ? true : false;
    this.showHelp = (menu == 'help' ) ? true : false;
    }

  clickEvent() {
    this.status = !this.status;
  }

}
