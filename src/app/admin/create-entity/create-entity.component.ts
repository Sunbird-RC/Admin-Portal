import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../../services/data/schema.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';


@Component({
  selector: 'create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.scss']
})
export class CreateEntityComponent implements OnInit {
  public editorOptions: JsonEditorOptions;

  @ViewChild(JsonEditorComponent) jsonEditor: JsonEditorComponent;

  params: any;
  usecase: any;
  entity: any;
  entityName: string;
  description: string;


  apiEntityName: any = [
    {
      'entityName': "Education Board",
      "key": "educationboard",
      "fields": [
        {
          'title': "Institute Name"
        },
        {
          'title': "Affiliation Number"
        }
      ]
    },
    {
      'entityName': "Institute",
      "key": "institute",
      "fields": [
        {
          'title': "Institute Name"
        },
        {
          'title': "Affiliation Number"
        }
      ]
    }
  ]

  entityFieldList: any = [
    {
      "type": "string",
      "title": "Plot",
      "required": true
    },
    {
      "type": "string",
      "title": "Street"
    }
  ]
  jsonFields: any = { "products": [{ "name": "car", "product": [{ "name": "honda", "model": [{ "id": "civic", "name": "civic" }, { "id": "accord", "name": "accord" }, { "id": "crv", "name": "crv" }, { "id": "pilot", "name": "pilot" }, { "id": "odyssey", "name": "odyssey" }] }] }] }


  SchemaUrl: any;
  entityFields: any;
  isAddFormPg: boolean = false;
  isShowJson: boolean = false;
  isCreateVc: boolean = false;
  currentTab: number = 0;
  steps: any;
  stepList: any;
  isActive: string;
  active0: boolean = true;
  active1: boolean = false;
  active2: boolean = false;
  active3: boolean = false;
  active4: boolean = false;
  sideMenu: any;
  currentMenu: number = 0;
  menus: any;
  an_menus: any;
  // entityFieldList: any = [];

  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public schemaService: SchemaService) { }

  ngOnInit(): void {

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();





    this.activeRoute.params.subscribe(params => {
      this.params = params;

      // if (this.params.hasOwnProperty('entity')) {
      //   this.entity = this.params.entity;
      // }

      if (this.params.hasOwnProperty('usecase')) {
        this.usecase = params.usecase.toLowerCase();
      }

      this.entityFields = this.apiEntityName[0]

      //this.getSchemaJSON();

      console.log(this.entityFields);

      setTimeout(() => {
        this.stepList = document.querySelector('#stepList');
        this.steps = this.stepList.querySelectorAll(".tab");
        this.steps[this.currentTab].classList.add("activeTab");
        console.log(this.steps[this.currentTab]);

        this.sideMenu = document.querySelector('#sideMenu');
        this.menus = this.sideMenu.querySelectorAll(".menu");
        this.an_menus = this.menus[this.currentMenu].querySelectorAll(".a-menu");
        this.an_menus[0].classList.add("activeMenu");

      }, 500);


    })

  }



  getSchemaJSON() {
    this.schemaService.getEntitySchemaJSON().subscribe((data) => {
      this.SchemaUrl = data.entitySchema[this.usecase + "SchemaUrl"];
      console.log(this.SchemaUrl);
    })
  }



  showAddForm() {
    this.isAddFormPg = true;
  }

  goBackEvent() {
    this.isAddFormPg = false;
  }

  showJson() {
    this.isShowJson = !this.isShowJson;
  }

  nextStep() {
    if (this.currentTab < 4) {

      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab += 1;
      this.steps[this.currentTab].classList.add("activeTab");
      this['active' + this.currentTab] = true;
      this['active' + (this.currentTab - 1)] = false;
    }
  }

  openEntity1(entityName) {
    let url = "/create/" + this.usecase + "/entity/" + entityName;
    this.router.navigate([url])
  }

  openEntity(n) {
    this.sideMenu = document.querySelector('#sideMenu');
    this.menus = this.sideMenu.querySelectorAll(".menu");
    this.an_menus[0].classList.remove("activeMenu");
    this.currentMenu = n;
    this.an_menus = this.menus[this.currentMenu].querySelectorAll(".a-menu");
    this.an_menus[0].classList.add("activeMenu");

    this.entityFields = this.apiEntityName[this.currentMenu]

  }

  createEntity(event) {
    console.log(event);

    console.log(this.entityName);
    let str = this.entityName.replace(/\s+/g, '');
    let key = str.charAt(0).toUpperCase() + str.slice(1)
    this.apiEntityName.push({
      'entityName': this.entityName,
      "key": key,
      "description": this.description
    });

    this.entityName = '';
    this.description = '';

    setTimeout(() => {
      this.openEntity(this.menus.length);

    }, 500);
  }


}
