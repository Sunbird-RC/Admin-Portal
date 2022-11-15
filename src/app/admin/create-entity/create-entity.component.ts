import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../../services/data/schema.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { getLocaleDateFormat } from '@angular/common';
import { Location } from '@angular/common';
import { GeneralService } from 'src/app/services/general/general.service';

import { ToastMessageService } from '../../services/toast-message/toast-message.service';
import { exit } from 'process';
import { ignoreElements } from 'rxjs/operators';
import { MinLengthValidator } from '@angular/forms';

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
  nastedFieldIndex: any;
  objFieldIndex: any;
  editJsonType: any;
  usecaseSchema: any = [];
  activeMenuNo: number = 1;
  commonschemaDefination: any;
  defination: any = [];
  processEntity: number = 0;
  sselectedVal: any = "";
  templateName: any;
  configDescription: any;
  schemaName: string;
  vcObject: any;
  userHtml: any;
  issuerOsid: any;
  oldTemplateName: string;
  schemaContent: any;
  certificateTitle: any;
  rawCredentials: any;
  allField: any = [];
  required: any;

  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public schemaService: SchemaService,
    public generalService: GeneralService,
    public toastMsg: ToastMessageService,
    public location: Location) {
  }

  ngOnInit(): void {

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();
    localStorage.setItem('draftSchemaOsid', "");

    this.activeRoute.params.subscribe(params => {
      this.params = params;


      if (this.params.hasOwnProperty('step')) {

        this.currentTab = Number(params.step);
        this.isActive = 'create-vc';
      } else {
        this.currentTab = 0;
        this.isActive = 'createSchema'
      }

      switch (this.currentTab) {
        case 0: this.isActive = 'createSchema';
          localStorage.setItem('draftSchemaOsid', "");
          break;
        case 1: this.isActive = 'configurations'
          break;
        case 2: this.isActive = 'create-vc'
          break;
        case 3: this.isActive = 'ownership'
          break;
        case 4: this.isActive = 'test-publish'
          break;
      }

    

      if (this.params.hasOwnProperty('usecase')) {
        this.usecase = params.usecase.toLowerCase();
      }

      this.getSchemaJSON();

      setTimeout(() => {
        this.stepList = document.querySelector('#stepList');
        this.steps = this.stepList.querySelectorAll(".tab");
        this.steps[this.currentTab].classList.add("activeTab");

        this.sideMenu = document.querySelector('#sideMenu');
        this.menus = this.sideMenu.querySelectorAll(".menu");

        if (this.menus.length) {
          this.an_menus = this.menus[this.activeMenuNo].querySelectorAll(".a-menu");
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
        // this.entityKey = data['usecase'][this.usecase]['entity'][0].entityName;
      }

      this.processSteps = data['usecase'][this.usecase]['steps'];

      if (!localStorage.getItem('schemaParams') || JSON.parse(localStorage.getItem('schemaParams')).title != this.usecase) {
        this.getEntityFields();
      } else {
        this.usecaseSchema = JSON.parse(localStorage.getItem('schemaParams')).schema;
        this.getEntityProperties();
      }

    })
  }

  getEntityFields() {

    for (let j = 0; j < this.entityList.length; j++) {

      this.schemaService.getJSONData(this.entityList[j].schemaUrl).subscribe((res) => {
        this.usecaseSchema.push(res);
        this.defination.push(res);
        //  this.activeMenuNo = j;

        if (res.hasOwnProperty('isRefSchema' && res.isRefSchema)) {
          this.commonschemaDefination = res;
          this.containCommonField = true;
        }

        // this.entityKey = res.title;
        if (j == (this.entityList.length - 1)) {
          this.getEntityProperties();
          this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.usecaseSchema[1].title);
          this.activeMenuNo = 1;
        }
      })

     
    }

  }

  getEntityProperties() {
    console.log(this.usecaseSchema);
    for (let j = 0; j < this.usecaseSchema.length; j++) {
      this.getEntityPropertiesByIndex(j);
    }
  }


  getEntityPropertiesByIndex(j) {
    let res = this.usecaseSchema[j];
    this.activeMenuNo = j;

    this.entityName = res.title;
    this.description = (res.description) ? res.description : '';
    this.entityKey = res.title;
    // this.properties = res.definitions;


    if (res.hasOwnProperty('isRefSchema') && res.isRefSchema) {
      this.properties = res.definitions;
      let self = this;
      let tempObj = [];
      Object.keys(this.properties).forEach(function (key) {
        self.entityKey = key;
        self.required = (res.definitions[self.entityKey].hasOwnProperty('required') && res.definitions[self.entityKey].required.length) ? res.definitions[self.entityKey].required : self.required;

        tempObj.push({
          "propertyName": (res.definitions[self.entityKey].hasOwnProperty('title')) ? res.definitions[self.entityKey].title : self.entityKey,
          "propertyKey": self.entityKey,
          "type": res.definitions[self.entityKey].type,
          "required": (res.definitions[self.entityKey].hasOwnProperty('required') && res.definitions[self.entityKey].required.length) ? res.definitions[self.entityKey].required : '',
          "$id": (res.definitions[self.entityKey].hasOwnProperty('$id')) ? res.definitions[self.entityKey]['$id'] : '',
          "data": self.readPropertyObj(res.definitions[self.entityKey].properties)
        });
      });

      // self.usecaseSchema[j].definitions['data'] = tempObj;

      let cKey = res.title.replaceAll(/\s/g, '');
      cKey = cKey.charAt(0).toLowerCase() + cKey.slice(1);

      this.usecaseSchema[j].definitions = {
        "propertyName": res.title,
        "propertyKey": cKey,
        "type": 'object',
        "data": tempObj,
        "isRefSchema": true
      };

      this.commonschemaDefination = this.usecaseSchema[j];

    } else {
      this.properties = res.definitions[this.entityKey].properties;

      this.processEntity = j;
      this.required = (res.definitions[this.entityKey].hasOwnProperty('required') && res.definitions[this.entityKey].required.length) ? res.definitions[this.entityKey].required : this.required;

      this.usecaseSchema[j].definitions = {
        "propertyName": res.definitions[this.entityKey].title,
        "propertyKey": this.entityKey,
        "type": res.definitions[this.entityKey].type,
        "required": (res.definitions[this.entityKey].hasOwnProperty('required') && res.definitions[this.entityKey].required.length) ? res.definitions[this.entityKey].required : '',
        "$id": (res.definitions[this.entityKey].hasOwnProperty('$id')) ? res.definitions[this.entityKey]['$id'] : '',
        "data": this.readPropertyObj(this.properties)
      };
    }


  }

  convertIntoSBRCSchema(sProperties) {
    let tempFieldObj = {};

    if (!sProperties.hasOwnProperty('property')) {
      if (sProperties.hasOwnProperty('propertyKey')) {

        // if (!sProperties.hasOwnProperty('isRefSchema') && !sProperties.isRefSchema) {
        tempFieldObj[sProperties.propertyKey] = {
          "$id": sProperties['$id'],
          "type": sProperties['type'],
          "title": sProperties['propertyName'],
          "required": (sProperties.hasOwnProperty('required')) ? sProperties.required : [],
          "properties": {}
        }
        // }


        for (let i = 0; i < sProperties.data.length; i++) {

          if (sProperties.data[i].hasOwnProperty('propertyKey')) {
            let field = sProperties.data[i];
            let tempFieldSecObj = {};
            let nastedKey;
            if (sProperties.hasOwnProperty('isRefSchema') && !sProperties.isRefSchema) {
              nastedKey = field.propertyKey;
            } else {
              nastedKey = field.propertyKey.charAt(0).toLowerCase() + field.propertyKey.slice(1);
            }

            if ((field['$ref'] != "" && field.type == 'array') && (!sProperties.hasOwnProperty('isRefSchema') && !sProperties.isRefSchema)) {
              tempFieldSecObj[nastedKey] = {
                "type": "array",
                "required": (field.hasOwnProperty('required')) ? field.required : [],
                "items": {
                  "$ref": field['$ref']
                }
              }
              tempFieldObj[sProperties.propertyKey]['properties'][nastedKey] = tempFieldSecObj[nastedKey]

            } else if (((field['$ref'] != "" && field['$ref'] != undefined) && field.type == 'object' && field.hasOwnProperty('$ref')) && (!sProperties.hasOwnProperty('isRefSchema') && sProperties.isRefSchema)) {
              tempFieldSecObj[nastedKey] = {
                "$ref": field['$ref']
              }

              tempFieldObj[sProperties.propertyKey]['properties'][nastedKey] = tempFieldSecObj[nastedKey]

            } else {

              if (field['type'] == 'array') {

                tempFieldSecObj[nastedKey] = {
                  "$id": field['$id'],
                  "type": field['type'],
                  "title": field['propertyName'],
                  "required": (field.hasOwnProperty('required')) ? field.required : [],
                  "items": {
                    "type": "object",
                    "properties": {}
                  }
                }

              } else {
                tempFieldSecObj[nastedKey] = {
                  "$id": field['$id'],
                  "type": field['type'],
                  "title": field['propertyName'],
                  "required": (field.hasOwnProperty('required')) ? field.required : [],
                  "properties": {}
                }
              }

              if (field.hasOwnProperty('data')) {
                for (let j = 0; j < field.data.length; j++) {
                  let property = field.data[j];

                  if (field['type'] == 'array') {
                    tempFieldSecObj[nastedKey]['items']['properties'][property.key] = property.data;

                  } else if (field['type'] == 'object') {

                    if (property.type != 'array' && property.type != 'object') {
                      tempFieldSecObj[nastedKey]['properties'][property.key] = property.data;
                    } else {

                      tempFieldSecObj[nastedKey]['properties'][property.propertyKey] = {

                        "type": property['type'],
                        "properties": {}
                      }
                      for (let m = 0; m < property.data.length; m++) {
                        tempFieldSecObj[nastedKey]['properties'][property.propertyKey]['properties'][property.data[m].key] = property.data[m].data;
                      }
                    }

                  } else {
                    tempFieldSecObj[nastedKey]['properties'][property.key] = property.data;

                  }
                }
              }

              // if (!sProperties.hasOwnProperty('isRefSchema') && !sProperties.isRefSchema) {
              tempFieldObj[sProperties.propertyKey]['properties'][nastedKey] = tempFieldSecObj[nastedKey];

              // }else{
              //   tempFieldObj[sProperties.propertyKey]['properties'][nastedKey] = tempFieldSecObj[nastedKey];

              //   //tempFieldObj[sProperties.propertyKey] = tempFieldSecObj[nastedKey];

              // }


            }
          } else {
            let property = sProperties.data[i];
            tempFieldObj[sProperties.propertyKey]['properties'][property.key] = property.data

          }

        }
      }


      return tempFieldObj;
    } else {
      return false
    }

  }


  readPropertyObj(propertyObj) {
    let tempFieldObjSec = [];
    let self = this;
    let data;
    Object.keys(propertyObj).forEach(function (key) {
      data = propertyObj[key];


      if ((data.hasOwnProperty('type') && data.type == 'array')) {
        //  tempFieldObjSec.push(self.readArraySchema(data));

        let dataTemp = self.readArraySchema(data);
        if (dataTemp.hasOwnProperty('data')) {
          dataTemp = dataTemp['data'];
        }

        self.required = (data.hasOwnProperty('required') && data.required.length) ? data.required : self.required;

        tempFieldObjSec.push({
          "propertyName": (data.hasOwnProperty('title') ? data.title : key),
          "propertyKey": key,
          "type": data.type,
          "$ref": '',
          "required": (data.hasOwnProperty('required') && data.required.length) ? data.required : '',
          "$id": (data.hasOwnProperty('$id')) ? data['$id'] : '',
          "data": dataTemp
        });

        if (!self.usecaseSchema[self.activeMenuNo].hasOwnProperty('isRefSchema') && !self.usecaseSchema[self.activeMenuNo].isRefSchema) {
          tempFieldObjSec[tempFieldObjSec.length - 1]['$ref'] = ((data.hasOwnProperty('$ref')) ? data['$ref'] : ((data.hasOwnProperty('items') && data.items.hasOwnProperty('$ref') ? data.items['$ref'] : '')));
        }

      } else if ((data.hasOwnProperty('$ref'))) {
        tempFieldObjSec.push(self.readCommonSchema(data));

        if (!self.usecaseSchema[self.activeMenuNo].hasOwnProperty('isRefSchema') && !self.usecaseSchema[self.activeMenuNo].isRefSchema) {
          tempFieldObjSec[tempFieldObjSec.length - 1]['$ref'] = data['$ref'];
        }

        // tempFieldObjSec.push({
        //   "propertyName": (data.hasOwnProperty('title') ? data.title : key),
        //   "propertyKey": key,
        //   "type": "object",
        //   "$id": (data.hasOwnProperty('$id')) ? data['$id'] : '',
        //   "data": self.readCommonSchema(data)

        // });

      } else if ((data.hasOwnProperty('type') && data.type == 'object') && data.hasOwnProperty('properties')) {
        // tempFieldObjSec.push(self.readPropertyObj(data.properties));

        self.required = (data.hasOwnProperty('required') && data.required.length) ? data.required : self.required;

        tempFieldObjSec.push({
          "propertyName": (data.hasOwnProperty('title') ? data.title : key),
          "propertyKey": key,
          "type": data.type,
          "$ref": '',
          "required": (data.hasOwnProperty('required') && data.required.length) ? data.required : '',
          "$id": (data.hasOwnProperty('$id')) ? data['$id'] : '',
          "data": self.readPropertyObj(data.properties)

        });

        if (!self.usecaseSchema[self.activeMenuNo].hasOwnProperty('isRefSchema') && !self.usecaseSchema[self.activeMenuNo].isRefSchema) {
          tempFieldObjSec[tempFieldObjSec.length - 1]['$ref'] = data['$ref'];
        }

      } else if (!data.hasOwnProperty('properties')) {

        let title = (propertyObj[key].hasOwnProperty('title') && propertyObj[key].title) ? propertyObj[key].title : key;
        if (typeof (data) == 'object') {
          data['title'] = title;
        }


        let required: any = [];
        required = (self.required != undefined) ? self.required.includes(key) : false;

        if (!self.usecaseSchema[self.activeMenuNo].hasOwnProperty('isRefSchema') && !self.usecaseSchema[self.activeMenuNo].isRefSchema) {
          if (!required && self.usecaseSchema[self.activeMenuNo].definitions[self.usecaseSchema[self.activeMenuNo].title].hasOwnProperty('required')) {
            required = self.usecaseSchema[self.activeMenuNo].definitions[self.usecaseSchema[self.activeMenuNo].title].required;
            required = (required) ? required.includes(key) : false;
          }
        }


        tempFieldObjSec.push(
          {
            "key": key,
            "type": (propertyObj[key].type == "string") ? 'string' : propertyObj[key].type,
            "visiblity": ['private'],
            "required": required,
            data
          })
      } else if (data.type != 'array' && data.type != 'object') {
        let title = (propertyObj[key].hasOwnProperty('title') && propertyObj[key].title) ? propertyObj[key].title : key;
        if (typeof (data) == 'object') {
          data['title'] = title;
        }

        let required: any = [];
        required = (self.required != undefined) ? self.required.includes(key) : false;

        if (!self.usecaseSchema[self.activeMenuNo].hasOwnProperty('isRefSchema') && !self.usecaseSchema[self.activeMenuNo].isRefSchema) {

        if (!required && self.usecaseSchema[self.activeMenuNo].definitions[self.usecaseSchema[self.activeMenuNo].title].hasOwnProperty('required')) {

          required = self.usecaseSchema[self.activeMenuNo].definitions[self.usecaseSchema[self.activeMenuNo].title].required;
          required = (required != undefined) ? required.includes(key) : false;
        }
      }


        tempFieldObjSec.push(
          {
            "key": key,
            "type": (propertyObj[key].type == "string") ? 'string' : propertyObj[key].type,
            "visiblity": ['private'],
            "required": required,
            data
          })
      }


    });

    return tempFieldObjSec;

  }


  readArraySchema(arrayObj) {
    let tempArrObj = [];
    let tempFieldObj;
    if (arrayObj.hasOwnProperty('items') && arrayObj.items.hasOwnProperty('$ref')) {
      tempArrObj = this.readCommonSchema(arrayObj);


    } else if (arrayObj.items.type == 'object' && arrayObj.items.hasOwnProperty('properties')) {
      tempArrObj = this.readPropertyObj(arrayObj.items.properties);
    } else if (arrayObj.items.type != 'array' && arrayObj.items.type != 'object') {
      tempArrObj = this.readPropertyObj(arrayObj);
    }


    return tempArrObj;
  }

  readCommonSchema(commonSchema) {
    let refUrl, refKey;
    let tempFieldObjSec = [];
    let tempFieldObj = [];

    if (commonSchema.type != 'array' && commonSchema.hasOwnProperty('$ref')) {
      refUrl = commonSchema['$ref'];
    } else if (commonSchema.type == 'array' && commonSchema.hasOwnProperty('$ref')) {
      refUrl = commonSchema['$ref']
    } else if (commonSchema.type == 'array' && commonSchema.hasOwnProperty('items')) {
      refUrl = commonSchema.items['$ref']
    } else if (commonSchema.hasOwnProperty('$ref')) {
      refUrl = commonSchema['$ref'];
    }

    let objInCommon = refUrl.includes("Common.json");
    refKey = (refUrl) ? refUrl.split("definitions/").pop() : refUrl;
    if (objInCommon) {
      // this.schemaService.getJSONData(this.schemaUrl.commonField).subscribe((res) => {
      let arrayObj;

      if (this.commonschemaDefination.definitions.hasOwnProperty('data') && this.commonschemaDefination.definitions.data.length) {
        for (let j = 0; j < this.commonschemaDefination.definitions.data.length; j++) {

          if (this.commonschemaDefination.definitions.data[j].propertyKey == refKey) {
            arrayObj = this.commonschemaDefination.definitions.data[j];
          }
        }

        this.required = (arrayObj.hasOwnProperty('required') && arrayObj.required.length) ? arrayObj.required : this.required;
        tempFieldObjSec = arrayObj;


      } else {

        // arrayObj = this.commonschemaDefination.definitions[refKey].properties;
        // tempFieldObjSec = this.readPropertyObj(arrayObj);

        for (let j = 0; j < this.commonschemaDefination.definitions.data.length; j++) {

          if (this.commonschemaDefination.definitions.data[j].propertyKey == refKey) {
            arrayObj = this.commonschemaDefination.definitions.data[j];

          }
        }

        this.required = (arrayObj.hasOwnProperty('required') && arrayObj.required.length) ? arrayObj.required : this.required;

        tempFieldObjSec = arrayObj;

      }

    } else {
      let arrayObj = this.usecaseSchema[this.processEntity].definitions[refKey].properties;

      this.required = (this.usecaseSchema[this.processEntity].definitions[refKey].hasOwnProperty('required') && this.usecaseSchema[this.processEntity].definitions[refKey].required.length) ? this.usecaseSchema[this.processEntity].definitions[refKey].required : this.required;

      tempFieldObjSec = this.readPropertyObj(arrayObj);
    }

    return tempFieldObjSec;

    // })

  }

  showAddForm() {
    this.compFieldJson = '';
    let viewSchemaField = this.usecaseSchema[this.activeMenuNo].definitions.data;
    this.compFieldJson = this.convertSchemaToFormioJson(viewSchemaField);

    this.isAddFormPg = true;

  }

  goBackEvent() {
    this.isAddFormPg = false;
  }

  showJson() {
    this.isShowJson = !this.isShowJson;
    this.getEntityJson();
  }

  getEntityJson() {

    let tempProperty: any;
    tempProperty = this.usecaseSchema[this.activeMenuNo];

    let cJson = this.convertIntoSBRCSchema(this.usecaseSchema[this.activeMenuNo].definitions);


    if (cJson) {
      tempProperty.definitions = cJson;
    }

    this.properties = tempProperty;
  }



  nextStep() {
    this.saveData();
    if (this.currentTab < 4) {
      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab += 1;
      this.steps[this.currentTab].classList.add("activeTab")

      this.isActive = this.processSteps[this.currentTab].key;
      this['active' + this.currentTab] = true;
      this['active' + (this.currentTab - 1)] = false;


      this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);
    }

    this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);


  }

  backStep() {
    if (this.currentTab < 4) {
      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab -= 1;
      this.steps[this.currentTab].classList.add("activeTab")

      this.isActive = this.processSteps[this.currentTab].key;
      this['active' + this.currentTab] = false;
      this['active' + (this.currentTab - 1)] = true;


      this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);
      if (localStorage.getItem('schemaParams') && JSON.parse(localStorage.getItem('schemaParams')).title == this.usecase) {
        this.usecaseSchema = JSON.parse(localStorage.getItem('schemaParams')).schema;
        this.getEntityProperties();
      }

    }


  }


  openEntityModal(action, i) {

    if (action == 'add') {
      this.entityName = '';
      this.description = '';
    } else {
      this.entityName = this.usecaseSchema[i].title;
      this.description = this.usecaseSchema[i].description;
    }

    this.actionIs = action;
    this.activeMenuNo = i;
  }

  openEntity(index, entitykey) {

    if (this.isActive != 'createSchema') {
      index = index - 1;
    }

    this.sideMenu = document.querySelector('#sideMenu');
    this.menus = this.sideMenu.querySelectorAll(".menu");
    this.an_menus[0].classList.remove("activeMenu");
    //    this.currentMenu = index;
    this.activeMenuNo = index;

    this.an_menus = this.menus[this.activeMenuNo].querySelectorAll(".a-menu");
    this.an_menus[0].classList.add("activeMenu");
    this.entityKey = entitykey;

    this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);

    if (this.isShowJson) {
      this.getEntityJson();
    }

  }

  createEntity(event) {

    let str = this.entityName.replace(/\s+/g, '');
    let key = str.charAt(0).toUpperCase() + str.slice(1);
    this.entityName = key;

    if (this.actionIs == 'add') {
      // this.description = '';
      let data = {
        'title': this.entityName,
        'description': this.description
      }

      this.entityKey = this.entityName;
      this.usecaseSchema.push(this.newSchemaTemplate(key, data));
      this.getEntityPropertiesByIndex(this.usecaseSchema.length - 1)


      setTimeout(() => {
        this.openEntity(this.menus.length, key);

      }, 500);

    } else {

      if (this.usecaseSchema[this.activeMenuNo].hasOwnProperty('isRefSchema') && this.usecaseSchema[this.activeMenuNo].isRefSchema) {
        this.oldTemplateName = this.usecaseSchema[this.activeMenuNo].title;

        for (let k = 0; k < this.usecaseSchema.length; k++) {
          if (this.usecaseSchema[k].hasOwnProperty('isRefSchema') && this.usecaseSchema[k].isRefSchema) {
            let result = JSON.stringify(this.usecaseSchema[k]);
            result = this.replaceAll(result, this.oldTemplateName, this.entityName);
            this.usecaseSchema[k] = JSON.parse(result);

          } else {
            let newName = this.entityName + '.json';
            let result = JSON.stringify(this.usecaseSchema[k]);
            result = this.replaceAll(result, this.oldTemplateName + '.json', newName);
            console.log({ result });
            this.usecaseSchema[k] = JSON.parse(result);
          }
        }



      } else {
        this.oldTemplateName = this.usecaseSchema[this.activeMenuNo].title;
        this.usecaseSchema[this.activeMenuNo].description = this.description;
        let result = JSON.stringify(this.usecaseSchema[this.activeMenuNo]);
        console.log({ result });
        result = this.replaceAll(result, this.oldTemplateName, this.entityName);


        this.usecaseSchema[this.activeMenuNo] = JSON.parse(result);
        this.entityKey = this.entityName;
        this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityName);
      }
    }

  }

  viewField(type, objectIndex_i, nastedObjIndex_j) {

    this.objFieldIndex = objectIndex_i;
    this.nastedFieldIndex = nastedObjIndex_j;
    this.editJsonType = type;


    let viewSchemaField;

    if (type == 'nasted') {
      viewSchemaField = this.usecaseSchema[this.activeMenuNo].definitions.data;
    } else {
      viewSchemaField = this.usecaseSchema[this.activeMenuNo].definitions.data;
    }


    this.compFieldJson = this.convertSchemaToFormioJson(viewSchemaField);
    this.isAddFormPg = true;
  }

  deleteField(type, objectIndex_i, nastedObjIndex_j) {
    if (confirm("Are you sure to delete ")) {
      if (type == 'nasted') {
        this.usecaseSchema[this.activeMenuNo].definitions.data[objectIndex_i].data.splice(nastedObjIndex_j, 1);

      } else {
        this.usecaseSchema[this.activeMenuNo].definitions.data.splice(objectIndex_i, 1);

      }
    }
  }

  deleteEntity(index) {
    if (confirm("Are you sure to delete ")) {
      //delete this.usecaseSchema[index];
      this.usecaseSchema.splice(index, 1);
      this.openEntity(0, this.entityKey);
    }
  }

  convertSchemaToFormioJson(viewSchemaField) {
    let newArr: any = [];
    for (let i = 0; i < viewSchemaField.length; i++) {
      if (viewSchemaField[i].type == 'string') {
        let compJson = {
          "label": viewSchemaField[i].data.title,
          "tableView": true,
          "validate": {
            "required": viewSchemaField[i].required
          },
          "key": viewSchemaField[i].key,
          "$id": "#/properties/" + viewSchemaField[i].key,
          "type": (viewSchemaField[i].type == 'string') ? "textfield" : viewSchemaField[i].type,
          "input": true
        }
        newArr.push(compJson);
      } else {

        let fieldData = viewSchemaField[i];

        let compJson = {
          "label": fieldData.propertyName,
          "tableView": false,
          "key": fieldData.propertyKey,
          "type": "container",
          "input": true,
          "components": [
          ]
        }

        for (let i = 0; i < fieldData.data.length; i++) {
          if (fieldData.data[i].type == 'string') {
            let compJsonS = {
              "label": fieldData.data[i].data.title,
              "validate": {
                "required": fieldData.data[i].required
              },
              "tableView": true,
              "key": fieldData.data[i].key,
              "$id": "#/properties/" + fieldData.data[i].key,
              "type": (fieldData.data[i].type == 'string') ? "textfield" : fieldData.data[i].type,
              "input": true
            }
            compJson.components.push(compJsonS);
          }
        }

        newArr.push(compJson);

      }

    }

    return newArr;

  }

  readConvertJsonData(event) {
    let value = this.jsonEditor.get();
    this.usecaseSchema[this.activeMenuNo] = value;
    this.getEntityPropertiesByIndex(this.activeMenuNo);
    this.isShowJson = !this.isShowJson;
  }

  hideJSon() {

    this.getEntityPropertiesByIndex(this.activeMenuNo);
    this.isShowJson = !this.isShowJson;

  }

  jsonSchemaData(formioJson) {

    formioJson = this.compFieldJson
    let tempFieldObjSec = [];
    let requiredFields = [];


    for (let i = 0; i < formioJson.length; i++) {

      if (formioJson[i].type == "container") {

        let tempjson = this.readNastedFormioJson(formioJson[i].components);


        let key = formioJson[i].label.replaceAll(/\s/g, '');
        key = key.charAt(0).toLowerCase() + key.slice(1);
        let requiredSecFields = [];
        for (let j = 0; j < formioJson[i].components.length; j++) {
          if (formioJson[i].components[j].validate.required) {
            requiredSecFields.push(formioJson[i].components[j].key);
          }
        }


        tempFieldObjSec.push(
          {
            propertyName: formioJson[i].label,
            propertyKey: key,
            type: "object",
            "required": requiredSecFields,
            data: tempjson
          })

      } else {

        let key = formioJson[i].label.replaceAll(/\s/g, '');
        key = key.charAt(0).toLowerCase() + key.slice(1);

        if (formioJson[i].validate.required) {
          requiredFields.push(formioJson[i].key);
        }

        let data = formioJson[i];

        let tempjson1 = {};
        tempjson1['$id'] = data.hasOwnProperty('$id') ? data['$id'] : '#/properties/' + key;
        tempjson1['type'] = data.hasOwnProperty('type') ? 'string' : 'string'
        tempjson1['title'] = data.hasOwnProperty('label') ? data['label'] : data['title'];
        data = tempjson1;


        tempFieldObjSec.push(
          {
            "key": key,
            "$id": "#/properties/" + key,
            "type": (formioJson[i].type == 'textfield') ? "string" : formioJson[i].type,
            "visiblity": ['private'],
            "required": formioJson[i].validate.required,
            data
          })

      }

    }

    this.usecaseSchema[this.activeMenuNo].definitions.data = tempFieldObjSec;
    this.usecaseSchema[this.activeMenuNo].definitions.required = requiredFields;


  }

  readNastedFormioJson(arrayObj) {
    let tempFieldObjSec = [];

    for (let i = 0; i < arrayObj.length; i++) {


      arrayObj[i]['title'] = arrayObj[i].label;
      arrayObj[i]['type'] = (arrayObj[i].type == 'textfield') ? "string" : arrayObj[i].type;
      let data = arrayObj[i]
      let key = arrayObj[i].label.replaceAll(/\s/g, '');
      key = key.charAt(0).toLowerCase() + key.slice(1);

      let tempjson1 = {};
      tempjson1['$id'] = data.hasOwnProperty('$id') ? data['$id'] : '#/properties/' + key;
      tempjson1['type'] = data.hasOwnProperty('type') ? 'string' : 'string'
      tempjson1['title'] = data.hasOwnProperty('label') ? data['label'] : data['title'];
      data = tempjson1;


      tempFieldObjSec.push(
        {
          "key": key,
          "$id": "#/properties/" + key,
          "type": arrayObj[i].type,
          "multiple": data.hasOwnProperty('multiple') ? data['multiple'] : false,
          "visiblity": ['public'],
          "required": arrayObj[i].validate.required,
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
      "description": "",
      "definitions": {
        [key]: {
          "$id": "#/properties/" + key,
          "type": "object",
          "title": data.title,
          "description": data.description,
          "required": [],
          "properties": {}
        }
      },
      "_osConfig": this.getRawCredentials(key)
    }


    return entityTemplate;
  }

  getRawCredentials(key) {
    this.rawCredentials = {
      "uniqueIndexFields": [],
      "ownershipAttributes": [],
      "roles": [],
      "inviteRoles": ["anonymous"],
      "enableLogin": false,
      "credentialTemplate": {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          {
            "@context": {
              "@version": 1.1,
              "@protected": true,
              key: {
                "@id": "https://github.com/sunbird-specs/vc-specs#" + key,
                "@context": {
                  "id": "@id",
                  "@version": 1.1,
                  "@protected": true,
                }
              }
            }
          }
        ],
        "type": [
          "VerifiableCredential"
        ],
        "issuanceDate": "2021-08-27T10:57:57.237Z",
        "credentialSubject": {
          "type": "DeathCertificate"
        },
        "issuer": "did:web:sunbirdrc.dev/vc/skill"
      },
      "certificateTemplates": {}
    }

    return this.rawCredentials;
  }

  saveData() {
    if (this.isActive == 'createSchema') {
      let tempProperty: any;
      tempProperty = this.usecaseSchema;
      for (let i = 0; i < this.usecaseSchema.length; i++) {

        // tempProperty[i].definitions = this.convertIntoSBRCSchema(this.usecaseSchema[i].definitions);
        let cJson = this.convertIntoSBRCSchema(this.usecaseSchema[i].definitions);
        if (cJson) {
          tempProperty.definitions = cJson;

        }


        if (i == this.usecaseSchema.length) {

          let schemaParams = {
            'title': this.usecase,
            'schema': tempProperty

          }
          console.log({ schemaParams });
          localStorage.setItem('schemaParams', JSON.stringify(schemaParams));

        }
      }

    }
  }


  async createSchema() {
   
    let errArr = [];
    let tempProperty: any;
    tempProperty = this.usecaseSchema;
    for (let i = 0; i < this.usecaseSchema.length; i++) {

      if (!this.usecaseSchema[i].hasOwnProperty('isRefSchema') || !this.usecaseSchema[i].isRefSchema) {
        await this.addCrtTemplateFields(this.usecaseSchema[i]);
      }

      // for (let j = 0; j < this.usecaseSchema.length; j++) {
      let cJson = this.convertIntoSBRCSchema(this.usecaseSchema[i].definitions);
      if (cJson) {
        tempProperty[i].definitions = {};
        tempProperty[i].definitions = cJson;

      }
      // }

      console.log({ tempProperty });
      if (tempProperty.length == this.usecaseSchema.length) {
        let payload = {
          "name": tempProperty[i].title,
          "description": tempProperty[i].description,
          "schema": JSON.stringify(tempProperty[i])
        }

        this.generalService.postData('/Schema', payload).subscribe((res) => {
         
          if (!this.usecaseSchema[i].hasOwnProperty('isRefSchema') || !this.usecaseSchema[i].isRefSchema) {
            if (localStorage.getItem('draftSchemaOsid')) {
              let draftSchemaOsid = JSON.parse(localStorage.getItem('draftSchemaOsid'));
              draftSchemaOsid.push({
                'title': this.usecaseSchema[i].title,
                'osid': res.result.Schema.osid,
              })
              localStorage.setItem('draftSchemaOsid', JSON.stringify(draftSchemaOsid));

            } else {
              let draftSchemaOsid = [{
                'title': this.usecaseSchema[i].title,
                'osid': res.result.Schema.osid,
              }]
              localStorage.setItem('draftSchemaOsid', JSON.stringify(draftSchemaOsid));
            }
          }

          let schemaParams = {
            'title': this.usecase,
            'schema': this.usecaseSchema,
          }
          console.log({ schemaParams });
          localStorage.setItem('schemaParams', JSON.stringify(schemaParams));

          if (i == (this.usecaseSchema.length - 1) && !errArr.length) {
            this.saveData();
            this.nextStep();
          }
        }, (err) => {
          errArr.push(this.usecaseSchema[i].title);

          if (errArr.length == 1 && (errArr.includes('Common') || errArr.includes('common'))) {
          
            this.saveData();
            this.nextStep();
            console.log('err ----', err);
          } else {
            if (i == this.usecaseSchema.length - 1) {
              this.toastMsg.error('error', errArr + " name schema already exists, please rename");
            }
          }



        })
      }
    }
  }

  async saveSchemaConfig() {
  
    let errArr = [];
    let tempProperty: any;
    tempProperty = this.usecaseSchema;
    for (let i = 0; i < this.usecaseSchema.length; i++) {

      if (!this.usecaseSchema[i].hasOwnProperty('isRefSchema') || !this.usecaseSchema[i].isRefSchema) {
        await this.addCrtTemplateFields(this.usecaseSchema[i]);
      }

      // for (let j = 0; j < this.usecaseSchema.length; j++) {
      let cJson = this.convertIntoSBRCSchema(this.usecaseSchema[i].definitions);
      if (cJson) {
        tempProperty.definitions = cJson;

      }
      // }

      console.log({ tempProperty });
      if (tempProperty.length == this.usecaseSchema.length) {
        let payload = {
          "name": this.templateName,
          "description": this.configDescription,
          "schema": JSON.stringify(tempProperty)
        }

        this.generalService.postData('/Schema', payload).subscribe((res) => {
         
          if (!this.usecaseSchema[i].hasOwnProperty('isRefSchema') || this.usecaseSchema[i].isRefSchema) {
            if (localStorage.getItem('draftSchemaOsid')) {
              let draftSchemaOsid = JSON.parse(localStorage.getItem('draftSchemaOsid'));
              draftSchemaOsid.push({
                'title': this.usecaseSchema[i].title,
                'osid': res.result.Schema.osid,
              })
              localStorage.setItem('draftSchemaOsid', JSON.stringify(draftSchemaOsid));

            } else {
              let draftSchemaOsid = [{
                'title': this.usecaseSchema[i].title,
                'osid': res.result.Schema.osid,
              }]
              localStorage.setItem('draftSchemaOsid', JSON.stringify(draftSchemaOsid));
            }
          }


          if (i == (this.usecaseSchema.length - 1) && !errArr.length) {
            this.saveData();
            this.nextStep();
          } else {
            this.toastMsg.error('error', errArr + " name schema already exists, please rename");
          }
        }, (err) => {
          errArr.push(this.usecaseSchema[i].title);

          if (errArr.length == 1 && (errArr.includes('Common') || errArr.includes('common'))) {

            this.saveData();
            this.nextStep();
            console.log('err ----', err);
          } else {
            if (i == this.usecaseSchema.length - 1) {
              this.toastMsg.error('error', errArr + " name schema already exists, please rename");
            }
          }



        })
      }
    }

  }
  saveConfiguration() {
    // alert('save');

    let schemaVc = localStorage.getItem('schemaVc');
    if (schemaVc != undefined) {
      schemaVc = JSON.parse(schemaVc);
      let self = this;
      Object.keys(schemaVc).forEach(function (key) {
        self.schemaName = key;
        self.vcObject = schemaVc[key];
        self.userHtml = self.vcObject.html

      });
    }

    // Creating a file object with some content
    var fileObj = new File([this.userHtml], this.templateName.replace(/\s+/g, '') + '.html');


    let str = this.templateName.replace(/\s+/g, '');
    this.templateName = str.charAt(0).toUpperCase() + str.slice(1)
    // Create form data
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append("files", fileObj, fileObj.name);
    this.generalService.postData('/Issuer/' + this.issuerOsid + '/schema/documents', formData).subscribe((res) => {

      let _self = this;
      Object.keys(this.usecaseSchema[1]['properties']).forEach(function (key) {
        _self.oldTemplateName = key;
      });


      this.usecaseSchema[1]._osConfig['certificateTemplates'] = { html: 'minio://' + res.documentLocations[0] }

      let result = JSON.stringify(this.usecaseSchema[1]);

      result = this.replaceAll(result, this.oldTemplateName, this.templateName);

      let payload = {
        "name": this.templateName,
        "description": this.configDescription,
        "schema": result
      }

      if (res.documentLocations[0]) {
        this.generalService.postData('/Schema', payload).subscribe((res) => {
          localStorage.setItem('content', '');
          this.router.navigate(['/dashboard']);
        }, (err) => {
          console.log('err ----', err);
          //   this.toastMsg.error('error', err.error.params.errmsg)

        })
      }
    })
  }

  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }

  addCrtTemplateFields(certTmpJson) {
    if (!certTmpJson.isRefSchema) {
      this.schemaContent = certTmpJson;
      this.certificateTitle = certTmpJson.title;
      certTmpJson['_osConfig']['credentialTemplate'] = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          {
            "@context": {
              "@version": 1.1,
              "@protected": true,
              [this.certificateTitle]: {
                "@id": "https://github.com/sunbird-specs/vc-specs#" + this.certificateTitle,
                "@context": {
                  "id": "@id",
                  "@version": 1.1,
                  "@protected": true,
                }
              }
            }
          }
        ],
        "type": [
          "VerifiableCredential"
        ],
        "issuanceDate": "2021-08-27T10:57:57.237Z",
        "credentialSubject": {
          "type": this.certificateTitle,
        },
        "issuer": "did:web:sunbirdrc.dev/vc/skill"
      };

      if (typeof (certTmpJson) == 'string') {
        let jsonUrl = certTmpJson;

        fetch(jsonUrl)
          .then(response => response.text())
          .then(data => {
          });


      } else {

        certTmpJson['_osConfig']['credentialTemplate']['credentialSubject'] = {};

        if (this.schemaContent) {
          let _self = this;
          let propertyData = this.schemaContent.definitions.data ? this.schemaContent.definitions.data : this.schemaContent.definitions;
          // this.schemaContent._osConfig.credentialTemplate["@context"][1]["@context"][this.certificateTitle]["@context"] = {};
          let contextProperty = this.schemaContent._osConfig.credentialTemplate["@context"][1]["@context"][this.certificateTitle]["@context"];


          for (let i = 0; i < propertyData.length; i++) {
            if (propertyData[i].type != 'object' && propertyData[i].type != 'array') {
              if (propertyData[i].key != undefined) {
                contextProperty[propertyData[i].key] = "schema:Text";
                certTmpJson['_osConfig']['credentialTemplate']['credentialSubject'][contextProperty[propertyData[i].key]] = "{{" + contextProperty[propertyData[i].key] + "}}"
              }
            } else {
              let stringKey = propertyData[i].propertyKey;
              stringKey = stringKey.charAt(0).toLowerCase() + stringKey.slice(1);
              contextProperty[stringKey] = {
                "@id": "https://github.com/sunbird-specs/vc-specs#" + stringKey,
                "@context": {
                }
              }
              for (let j = 0; j < propertyData[i].data.length; j++) {
                if (propertyData[i].data[j].type != 'object' && propertyData[i].data[j].type != 'array') {
                  let keyName = propertyData[i].data[j].key;

                  let stringKey = propertyData[i].propertyKey;
                  stringKey = stringKey.charAt(0).toLowerCase() + stringKey.slice(1);
                  if (stringKey != undefined && keyName != undefined) {

                    contextProperty[stringKey]["@context"][keyName] = "schema:Text";
                    certTmpJson['_osConfig']['credentialTemplate']['credentialSubject'][keyName] = "{{" + stringKey + "." + keyName + "}}"
                  }
                }
              }
            }
          }


          let temp = JSON.stringify(certTmpJson);

        }
      }
    }
  }
}
