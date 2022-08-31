import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../../services/data/schema.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { getLocaleDateFormat } from '@angular/common';


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
  entityName: any;
  description: any;

  entityList: any = [];
  apiEntityName: any = []
  containCommonField: boolean = false;
  entityFieldList: any = []
  //jsonFields: any = { "products": [{ "name": "car", "product": [{ "name": "honda", "model": [{ "id": "civic", "name": "civic" }, { "id": "accord", "name": "accord" }, { "id": "crv", "name": "crv" }, { "id": "pilot", "name": "pilot" }, { "id": "odyssey", "name": "odyssey" }] }] }] }


  SchemaUrl: any;
  entityFields: any;
  isAddFormPg: boolean = false;
  isShowJson: boolean = false;
  isCreateVc: boolean = false;
  currentTab: number = 0;
  steps: any;
  stepList: any;
  isActive: string = 'createSchema';

  sideMenu: any;
  currentMenu: number = 0;
  menus: any;
  an_menus: any;
  entityProperties: any = [];
  entityKey: any;
  processSteps: any;
  entitySampleField: any = [];
  entityListArr: any = [];
  schemaDefination: any;
  schemaUrl: any;
  compFieldJson: any;
  properties: any;
  json_properties: any;
  actionIs: string;
  activeMenuIndex: any;
  nastedFieldIndex: any;
  objFieldIndex: any;
  editJsonType: any;

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

      // this.entityFields = this.apiEntityName[0]

      this.getSchemaJSON();

      console.log(this.entityFields);

      setTimeout(() => {
        this.stepList = document.querySelector('#stepList');
        this.steps = this.stepList.querySelectorAll(".tab");
        this.steps[this.currentTab].classList.add("activeTab");
        console.log(this.steps[this.currentTab]);

        this.sideMenu = document.querySelector('#sideMenu');
        this.menus = this.sideMenu.querySelectorAll(".menu");

        if (this.menus.length) {
          this.an_menus = this.menus[this.currentMenu].querySelectorAll(".a-menu");
          this.an_menus[0].classList.add("activeMenu");
        }

      }, 500);


    })

  }



  async getSchemaJSON() {
    await this.schemaService.getEntitySchemaJSON().subscribe((data) => {
      this.schemaUrl = data['usecase'][this.usecase];

      if (data['usecase'][this.usecase]['entity'].length) {
        this.entityList = data['usecase'][this.usecase]['entity'];
        this.entityKey = data['usecase'][this.usecase]['entity'][0].entityName
      }


      // for (let j = 0; j < this.entityList.length; j++) {
      //   this.entityFieldList[this.entityList[j].entityName] = this.entityList[j]
      // }

      this.processSteps = data['usecase'][this.usecase]['steps'];


      this.getEntityFields();
      //   this.getEntityFields();
      console.log({ data });
    })
  }

  getEntityFields() {

    for (let j = 0; j < this.entityList.length; j++) {
      this.schemaService.getJSONData(this.entityList[j].schemaUrl).subscribe((res) => {
        this.entityFieldList[res.title] = res;
        this.entityListArr.push(res);
        this.entityKey = res.title;
        if (j = this.entityList.length) {
          this.getEntityFields1();
        }
      })
    }

    if (this.schemaUrl.hasOwnProperty(['commonField'])) {
      this.containCommonField = true;
      this.schemaService.getJSONData(this.schemaUrl.commonField).subscribe((res) => {
        this.entityFieldList[res.title] = res;
        this.entityListArr.push(res);

        this.entityKey = "Common";
        this.schemaDefination = res.definitions;
        this.properties = res.definitions;

        this.entityProperties = this.createObjectFormat(this.properties);
      })

    }


  }

  getEntityFields1() {
    if (this.entityKey !== "Common") {
      let res = this.entityFieldList[this.entityKey];
      this.entityName = res.definitions[res.title].title;
      this.description = (res.definitions[res.title].description) ? res.definitions[res.title].description : res.description;
      this.entityKey = res.title;
      this.schemaDefination = res.definitions;
      this.properties = res.definitions[res.title].properties;

      this.entityProperties = this.createObjectFormat(this.properties);
      console.log(this.entityProperties);
    } else {
      let res = this.entityFieldList[this.entityKey];
      this.properties = res.definitions;
      this.entityProperties = this.createObjectFormat(this.properties);

    }
    //})

  }

  createObjectFormat(entityProperties) {

    // console.log({ entityProperties });
    let tempFieldObj = [];
    let self = this;
    Object.keys(entityProperties).forEach(function (key) {

      if (typeof (entityProperties[key]) == 'object' && entityProperties[key].type == 'string') {
        let data = entityProperties[key];
        let title = (entityProperties[key].hasOwnProperty('title') && entityProperties[key].title) ? entityProperties[key].title : key;
        data['title'] = title;

        tempFieldObj.push(
          {
            "key": key,
            "type": "string",
            data
          })
      }
      // else if (entityProperties[key].hasOwnProperty('items') || entityProperties[key].items.hasOwnProperty('properties')) {
      //   alert('check alter pos 1');
      // let  arrayObj = entityProperties[key].items['properties'];
      // tempFieldObj= self.readNastedFieldSchema(arrayObj);

      // }

      else if (entityProperties[key]['type'] == 'object' || entityProperties[key].hasOwnProperty('properties')) {


        let arrayObj = entityProperties[key].properties;
        //  tempFieldObj =  self.readNastedFieldSchema(arrayObj)
        tempFieldObj.push({
          "propertyName": (entityProperties[key].hasOwnProperty('title') ? entityProperties[key].title : key),
          "type": "object",
          "data": self.readNastedFieldSchema(arrayObj)

        });

        console.log({ tempFieldObj });

      }
      else if (entityProperties[key].type == 'array' || entityProperties[key].hasOwnProperty('$ref')) {
        let tempFieldObjSec = [];
        let tempStr;


        // if (entityProperties[key]['type'] == 'array' || entityProperties[key].item.hasOwnProperty('property')) {
        //   alert('check alter pos 1');
        // }

        if (entityProperties[key]['type'] != 'array' || entityProperties[key].hasOwnProperty('$ref')) {
          tempStr = entityProperties[key]['$ref'];
        } else {

          tempStr = entityProperties[key].items['$ref'];
        }

        let objInCommon = tempStr.includes("Common.json");
        tempStr = tempStr.split("definitions/").pop();
        let arrayObj;

        if (objInCommon) {
          self.schemaService.getJSONData(self.schemaUrl['commonField']).subscribe((res) => {

            arrayObj = res.definitions[tempStr].properties;
            tempFieldObjSec = self.readNastedFieldSchema(arrayObj);


            /* Object.keys(arrayObj).forEach(function (key1) {
               let data = arrayObj[key1];
               let title = (arrayObj[key1].hasOwnProperty('title') && arrayObj[key1].title) ? arrayObj[key1].title : key1;
               data['title'] = title;
 
               tempFieldObjSec.push(
                 {
                   "key": key1,
                   // "propertyName": tempStr,
                   "type": "string",
                   data
                 })
             });*/

            tempFieldObj.push({
              "propertyName": tempStr,
              "type": "array",
              "data": tempFieldObjSec

            })
          });

        } else {

          arrayObj = self.schemaDefination[tempStr].properties;
          tempFieldObjSec = self.readNastedFieldSchema(arrayObj);

          /*  Object.keys(arrayObj).forEach(function (key1) {
              let data = arrayObj[key1];
              let title = (arrayObj[key1].hasOwnProperty('title') && arrayObj[key1].title) ? arrayObj[key1].title : key1;
              data['title'] = title;
  
              tempFieldObjSec.push(
                {
                  "key": key1,
                  // "propertyName": tempStr,
                  "type": "string",
                  data
                })
            }); */

          tempFieldObj.push({
            "propertyName": tempStr,
            "type": "array",
            "data": tempFieldObjSec
          })
        }

      }
    });

    return tempFieldObj;
  }

  readNastedFieldSchema(arrayObj) {
    let tempFieldObjSec = [];

    Object.keys(arrayObj).forEach(function (key1) {
      let data = arrayObj[key1];
      let title = (arrayObj[key1].hasOwnProperty('title') && arrayObj[key1].title) ? arrayObj[key1].title : key1;
      data['title'] = title;

      tempFieldObjSec.push(
        {
          "key": key1,
          "type": "string",
          data
        })
    });

    return tempFieldObjSec;

  }

  showAddForm() {
    this.isAddFormPg = true;
    this.compFieldJson = '';
  }

  goBackEvent() {
    this.isAddFormPg = false;
  }

  showJson() {
    this.isShowJson = !this.isShowJson;
  }

  nextStep() {
    this.saveData(this.currentTab);
    if (this.currentTab < 4) {
      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab += 1;
      this.steps[this.currentTab].classList.add("activeTab")
      console.log(this.processSteps);

      this.isActive = this.processSteps[this.currentTab].key;
      this['active' + this.currentTab] = true;
      this['active' + (this.currentTab - 1)] = false;
    }

  }

  backStep() {
    if (this.currentTab < 4) {
      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab -= 1;
      this.steps[this.currentTab].classList.add("activeTab")
      console.log(this.processSteps);

      this.isActive = this.processSteps[this.currentTab].key;
      this['active' + this.currentTab] = false;
      this['active' + (this.currentTab - 1)] = true;
    }
  }


  openEntityModal(action, i) {

    if (action == 'add') {
      this.entityName = '';
      this.description = '';
    }

    this.actionIs = action;
    this.activeMenuIndex = i;



  }

  openEntity(index, entitykey) {
    this.sideMenu = document.querySelector('#sideMenu');
    this.menus = this.sideMenu.querySelectorAll(".menu");
    this.an_menus[0].classList.remove("activeMenu");
    this.currentMenu = index;
    this.an_menus = this.menus[this.currentMenu].querySelectorAll(".a-menu");
    this.an_menus[0].classList.add("activeMenu");
    this.entityKey = entitykey;
    this.entityFields = this.apiEntityName[this.currentMenu];
    this.getEntityFields1();

  }

  createEntity(event) {
    console.log(event);

    console.log(this.entityName);

    if (this.actionIs == 'add') {
      let str = this.entityName.replace(/\s+/g, '');
      let key = str.charAt(0).toUpperCase() + str.slice(1)
      // this.apiEntityName.push({
      //   'entityName': this.entityName,
      //   "key": key,
      //   "description": this.description
      // });

      // this.entityName = '';
      // this.description = '';
      let data = {
        'title': this.entityName,
        'description': this.description
      }

      this.entityListArr.push(this.newSchemaTemplate(key, data))
      this.entityFieldList[key] = this.newSchemaTemplate(key, data);

      console.log(this.newSchemaTemplate(key, data));

      setTimeout(() => {
        this.openEntity(this.menus.length, key);

      }, 500);

      console.log(this.entityListArr);
    } else {
      this.entityListArr[this.activeMenuIndex].definitions[this.entityKey].title = this.entityName;
      this.entityListArr[this.activeMenuIndex].definitions[this.entityKey].description = this.description;

    }

  }

  viewField(type, objectIndex_i, nastedObjIndex_j) {

    this.objFieldIndex = objectIndex_i;
    this.nastedFieldIndex = nastedObjIndex_j;
    this.editJsonType = type;


    console.log(this.entityProperties[objectIndex_i].data[nastedObjIndex_j]);
    let viewSchemaField;

    if (type == 'nasted') {
      viewSchemaField = this.entityProperties[objectIndex_i].data[nastedObjIndex_j];
    } else {
      viewSchemaField = this.entityProperties[objectIndex_i];
    }


    this.compFieldJson = this.convertSchemaToFormioJson(viewSchemaField);
    this.isAddFormPg = true;
  }

  deleteField(type, objectIndex_i, nastedObjIndex_j) {
    if (confirm("Are you sure to delete ")) {
      if (type == 'nasted') {
        delete this.entityProperties[objectIndex_i].data[nastedObjIndex_j];
      } else {
        delete this.entityProperties[objectIndex_i];
      }
    }
  }

  deleteEntity(index) {
    if (confirm("Are you sure to delete ")) {
      delete this.entityListArr[index];
    }
  }

  convertSchemaToFormioJson(viewSchemaField) {

    let compJson = {
      "label": viewSchemaField.data.title,
      "tableView": true,
      "key": viewSchemaField.key,
      "type": (viewSchemaField.type == 'string') ? "textfield" : viewSchemaField.type,
      "input": true
    }

    return compJson;

  }

  getJsonData(event) {
    console.log(event);
    let value = this.jsonEditor.get();
    this.properties = value;
    this.entityProperties = this.createObjectFormat(this.properties);
  }

  jsonSchemaData(formioJson) {

    console.log({ formioJson });
    console.log(this.entityProperties);

    if (this.compFieldJson) {
      if (this.editJsonType == 'nasted') {
        console.log(this.entityProperties[this.objFieldIndex].data[this.nastedFieldIndex]);
        this.entityProperties[this.objFieldIndex].data[this.nastedFieldIndex].data.title = formioJson[0].label;

      } else {
        this.entityProperties[this.objFieldIndex].data.title = formioJson[0].label;
        console.log(this.entityProperties[this.objFieldIndex]);
      }
    } else {



      let tempFieldObjSec = [];

      console.log(this.entityProperties);

      for (let i = 0; i < formioJson.length; i++) {
        if (formioJson[i].type == "container") {

          let tempjson = this.readNastedFormioJson(formioJson[i].components)

          tempFieldObjSec.push(
            {
              propertyName: formioJson[i].label,
              type: "object",
              data: tempjson
            })

        } else {


          let data = formioJson[i];
          let title = formioJson[i].label;
          data['title'] = title;
          data['type'] = (formioJson[i].type == 'textfield') ? "string" : formioJson[i].type;

          tempFieldObjSec.push(
            {
              "key": formioJson[i].key,
              "type": (formioJson[i].type == 'textfield') ? "string" : formioJson[i].type,
              data
            })

        }

        this.entityProperties.push(tempFieldObjSec[i]);

      }

      console.log(tempFieldObjSec);



    }


  }

  readNastedFormioJson(arrayObj) {
    let tempFieldObjSec = [];

    for (let i = 0; i < arrayObj.length; i++) {
      // let data = arrayObj[key1];

      arrayObj[i]['title'] = arrayObj[i].label;
      let data = arrayObj[i]

      tempFieldObjSec.push(
        {
          "key": arrayObj[i].key,
          "type": (arrayObj[i].type == 'textfield') ? "string" : arrayObj[i].type,
          data
        })
    };

    return tempFieldObjSec;

  }


  newSchemaTemplate(key, data) {

    let entityTemplate = {
      "$schema": "http://json-schema.org/draft-07/schema",
      "type": "object",
      "properties": {
        [key]: {
          "$ref": "#/definitions/" + key
        }
      },
      "required": [
        key
      ],
      "title": key,
      "description": "This is institute Entity",
      "definitions": {
        [key]: {
          "$id": "#/properties/" + key,
          "type": "object",
          "title": data.title,
          "description": data.description,
          "required": [],
          "properties": {}
        }
      }
    }

    return entityTemplate;
  }

  saveData(currentTab)
  {
    //alert(this.isActive);
    if(this.isActive == 'createSchema')
    {
      console.log('this.entityProperties ---', this.entityProperties);
      console.log('this.entityListArr ---', this.entityListArr);

    }
  }
}
