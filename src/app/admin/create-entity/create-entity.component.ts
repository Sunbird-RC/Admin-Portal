import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../../services/data/schema.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { getLocaleDateFormat } from '@angular/common';
import { Location } from '@angular/common';


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
  usecaseSchema: any = [];
  activeMenuNo: number = 1;
  commonschemaDefination: any;
  defination: any = [];
  processEntity: number = 0;
  sselectedVal: any = "";
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public schemaService: SchemaService,
    public location: Location) { }

  ngOnInit(): void {

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();

    this.activeRoute.params.subscribe(params => {
      this.params = params;
     

      if (this.params.hasOwnProperty('step')) {
        this.currentTab = Number(params.step);
      }else{
        this.currentTab = 0;
      }

      // if (this.params.hasOwnProperty('entity')) {
      //   this.entity = this.params.entity;
      // }

      if (this.params.hasOwnProperty('usecase')) {
        this.usecase = params.usecase.toLowerCase();
      }



      // this.entityFields = this.apiEntityName[0]



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

      if (this.schemaUrl.hasOwnProperty(['commonField'])) {
        this.schemaService.getJSONData(this.schemaUrl.commonField).subscribe((res) => {
          this.commonschemaDefination = res;
          this.getEntityFields();
        })
      } else {
        this.getEntityFields();
      }



      //     this.usecaseSchema[j+1].definitions = this.createObjectFormat(this.properties);


      // for (let j = 0; j < this.entityList.length; j++) {
      //   this.entityFieldList[this.entityList[j].entityName] = this.entityList[j]
      // }



      //   this.getEntityFields();
    })
  }

  getEntityFields() {

    for (let j = 0; j < this.entityList.length; j++) {

      this.schemaService.getJSONData(this.entityList[j].schemaUrl).subscribe((res) => {
        //  this.entityFieldList[res.title] = res;
        //  this.entityListArr.push(res);
        this.usecaseSchema.push(res);
        this.defination.push(res);
      //  this.activeMenuNo = j;

        // this.entityKey = res.title;
        if (j == (this.entityList.length - 1)) {
          this.getEntityProperties();
          this.location.replaceState('/create/' +  this.currentTab + '/' + this.usecase + '/' +  this.usecaseSchema[1].title);
          this.activeMenuNo = 1;
        }
      })

      if (j == (this.entityList.length - 1)) {
        if (this.schemaUrl.hasOwnProperty(['commonField'])) {
          this.containCommonField = true;
          // this.schemaService.getJSONData(this.schemaUrl.commonField).subscribe((res) => {
          // this.entityFieldList[res.title] = res;
          // this.entityListArr.push(res);

          // this.entityKey = "Common";
        //  this.activeMenuNo = j;

          this.usecaseSchema.push(this.commonschemaDefination);
          //  this.properties = this.commonschemaDefination.definitions;

          //     this.usecaseSchema[j+1].definitions = this.createObjectFormat(this.properties);
          //  })

        }
      }
    }

  }

  getEntityProperties() {
    for (let j = 0; j < this.usecaseSchema.length; j++) {
      this.getEntityPropertiesByIndex(j);
    }
  }


  getEntityPropertiesByIndex(j) {
    let res = this.usecaseSchema[j];
this.activeMenuNo = j;

    if (this.usecaseSchema[j].title !== "Common" && this.usecaseSchema[j].title !== "common") {
      let res = this.usecaseSchema[j];


      this.entityName = res.title;
      this.description = (res.description) ? res.description : '';
      this.entityKey = res.title;
      // this.commonschemaDefination = res.definitions;
      // this.properties = res.definitions;


      this.properties = res.definitions[this.entityKey].properties;

      // this.entityProperties = this.createObjectFormat(this.properties);
      //  this.usecaseSchema[j].definitions = ;
      this.processEntity = j;

      // if(this.usecaseSchema[j].title != 'Common' && this.usecaseSchema[j].title != 'common')
      // {
      //   this.usecaseSchema[j].definitions['$ref'] = ((this.usecaseSchema[j].definitions[this.entityKey].hasOwnProperty('$ref')) ? this.usecaseSchema[j].definitions[this.entityKey]['$ref'] : ((this.usecaseSchema[j].definitions[this.entityKey].hasOwnProperty('items') && this.usecaseSchema[j].definitions[this.entityKey].items.hasOwnProperty('$ref') ? this.usecaseSchema[j].definitions[this.entityKey].items['$ref'] : '')));
      // }

      this.usecaseSchema[j].definitions = {
        "propertyName": res.definitions[this.entityKey].title,
        "propertyKey": this.entityKey,
        "type": res.definitions[this.entityKey].type,
        "$id": (res.definitions[this.entityKey].hasOwnProperty('$id')) ? res.definitions[this.entityKey]['$id'] : '',
        "data": this.readPropertyObj(this.properties)
      };

    

    } else {
      let res = this.usecaseSchema[j];
      this.properties = res.definitions;

      this.usecaseSchema[j].definitions = {
        "propertyName": res.title,
        "propertyKey": res.title,
        "type":  'object',
        "data": this.readPropertyObj(this.properties)
      };

      // this.entityProperties = this.createObjectFormat(this.properties);
      //  this.usecaseSchema[j].definitions = this.readPropertyObj(this.properties);

    }

  }

  convertIntoSBRCSchema(sProperties) {
    let tempFieldObj = {};

    for (let i = 0; i < sProperties.data.length; i++) {
      if (sProperties.data[i].hasOwnProperty('propertyKey')) {


        let field = sProperties.data[i];

        if((field['$ref'] != "" && field.type == 'array') && (sProperties.propertyKey != 'Common' && sProperties.propertyKey != 'common'))
        {
          tempFieldObj[field.propertyKey]= { 
            "type": "array",
            "items" : {
              "$ref" : field['$ref']
            }
          }
        }else if((field['$ref'] != "" && field.type == 'object' ) && (sProperties.propertyKey != 'Common' && sProperties.propertyKey != 'common'))
        {
          tempFieldObj[field.propertyKey]= { 
              "$ref" : field['$ref']
            }
        }else{

        tempFieldObj[field.propertyKey] = {
          "$id": field['$id'],
          "type": field['type'],
          "title": field['propertyName'],
          "properties": {}
        }

        if (field.hasOwnProperty('data')) {
          for (let j = 0; j < field.data.length; j++) {
            let property = field.data[j];
            tempFieldObj[field.propertyKey]['properties'][property.key] = property.data
          }
        }

      }

      

      }
    }

    return tempFieldObj;


  }


  createObjectFormat_____delete(definationData) {

    let tempFieldObj = [];

    // for (let i = 0; i < definationData.length; i++) {
    let self = this;
    Object.keys(definationData).forEach(function (key) {
      let jentityProperties = definationData[key];
      if (typeof (jentityProperties) == 'object' && jentityProperties.type == 'string') {
        let data = jentityProperties;
        let title = (jentityProperties.hasOwnProperty('title') && jentityProperties.title) ? jentityProperties.title : key;
        data['title'] = title;

        tempFieldObj.push(
          {
            "key": key,
            "type": "string",
            "visiblity": ['private'],
            data
          })
      }
      else if (jentityProperties['type'] == 'object' || jentityProperties.hasOwnProperty('properties')) {


        let propertyObj = jentityProperties.properties;
        //  tempFieldObj =  self.readNastedFieldSchema(arrayObj)
        tempFieldObj.push({
          "propertyName": (jentityProperties.hasOwnProperty('title') ? jentityProperties.title : key),
          "propertyKey": key,
          "type": "object",
          "$id": (jentityProperties.hasOwnProperty('$id')) ? jentityProperties['$id'] : '',
          "data": self.readPropertyObj(propertyObj)

        });


      } else if (jentityProperties.type == 'array') {
        tempFieldObj = this.readPropertyObj(jentityProperties);

      }

      // else if(jentityProperties.type == 'object' || jentityProperties.hasOwnProperty('$ref')){

      // }
      // else if (jentityProperties.type == 'array' || jentityProperties.hasOwnProperty('$ref')) {
      //   tempFieldObj = this.readNastedArraySchema(jentityProperties, key);

      // }
    });
    //}

    return tempFieldObj;
  }

  readPropertyObj(propertyObj) {
    let tempFieldObjSec = [];
    let self = this;
    let data;
    Object.keys(propertyObj).forEach(function (key) {
      data = propertyObj[key];


      if ((data.hasOwnProperty('type') && data.type == 'array')) {
        //  tempFieldObjSec.push(self.readArraySchema(data));

        tempFieldObjSec.push({
          "propertyName": (data.hasOwnProperty('title') ? data.title : key),
          "propertyKey": key,
          "type": data.type,
          "$ref": '',
          "$id": (data.hasOwnProperty('$id')) ? data['$id'] : '',
          "data": self.readArraySchema(data)
        });

        if(self.usecaseSchema[self.activeMenuNo].title != 'Common' && self.usecaseSchema[self.activeMenuNo].title != 'common')
        {
          tempFieldObjSec[tempFieldObjSec.length - 1]['$ref'] = ((data.hasOwnProperty('$ref')) ? data['$ref'] : ((data.hasOwnProperty('items') && data.items.hasOwnProperty('$ref') ? data.items['$ref'] : '')));
        }

      } else if ((data.hasOwnProperty('$ref'))) {
        tempFieldObjSec.push(self.readCommonSchema(data));

        if(self.usecaseSchema[self.activeMenuNo].title != 'Common' && self.usecaseSchema[self.activeMenuNo].title != 'common')
        {
          tempFieldObjSec[tempFieldObjSec.length - 1]['$ref'] = data['$ref'];
        }

        // tempFieldObjSec.push({
        //   "propertyName": (data.hasOwnProperty('title') ? data.title : key),
        //   "propertyKey": key,
        //   "type": "object",
        //   "$id": (data.hasOwnProperty('$id')) ? data['$id'] : '',
        //   "data": self.readCommonSchema(data)

        // });

      } else if ((data.hasOwnProperty('type') && data.type == 'object') || data.hasOwnProperty('properties')) {
        // tempFieldObjSec.push(self.readPropertyObj(data.properties));

        tempFieldObjSec.push({
          "propertyName": (data.hasOwnProperty('title') ? data.title : key),
          "propertyKey": key,
          "type": data.type,
          "$ref": '', 
          "$id": (data.hasOwnProperty('$id')) ? data['$id'] : '',
          "data": self.readPropertyObj(data.properties)

        });

        if(self.usecaseSchema[self.activeMenuNo].title != 'Common' && self.usecaseSchema[self.activeMenuNo].title != 'common')
        {
          tempFieldObjSec[tempFieldObjSec.length - 1]['$ref'] = data['$ref'];
        }

      } else if (!data.hasOwnProperty('properties')) {

        let title = (propertyObj[key].hasOwnProperty('title') && propertyObj[key].title) ? propertyObj[key].title : key;
        if (typeof (data) == 'object') {
          data['title'] = title;
        }

        tempFieldObjSec.push(
          {
            "key": key,
            "type": (propertyObj[key].type == "string") ? 'string' : propertyObj[key].type,
            "visiblity": ['private'],
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
    } else if (arrayObj.items.type == 'string') {
      tempArrObj = this.readPropertyObj(arrayObj);
    }

    // tempFieldObj.push({
    //   "propertyName": arrayObj,
    //   '$ref':refKey,
    //   "propertyKey": refKey,
    //   "type": (commonSchema.type == 'array') ? commonSchema.type : '',
    //   "data": tempFieldObjSec
    // })

    return tempArrObj;
  }

  // readObjectSchema(propertyObj) {
  //   return propertyObj;
  // }

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

      if (this.commonschemaDefination.definitions.data.length) {
        for (let j = 0; j < this.commonschemaDefination.definitions.data.length; j++) {

          if (this.commonschemaDefination.definitions.data[j].propertyKey == refKey) {
            arrayObj = this.commonschemaDefination.definitions.data[j];
          }
        }

        tempFieldObjSec = arrayObj;


      } else {
        arrayObj = this.commonschemaDefination.definitions[refKey].properties;
        tempFieldObjSec = this.readPropertyObj(arrayObj);

      }

    } else {
      let arrayObj = this.usecaseSchema[this.processEntity].definitions[refKey].properties;
      tempFieldObjSec = this.readPropertyObj(arrayObj);
    }

    return tempFieldObjSec;

    // })

  }

  showAddForm() {
    this.isAddFormPg = true;
    this.compFieldJson = '';
  }

  goBackEvent() {
    this.isAddFormPg = false;
  }

  showJson()
  {
    this.isShowJson = !this.isShowJson;
    this.getEntityJson();
  }

  getEntityJson() {
   
    let tempProperty: any;
    tempProperty = this.usecaseSchema[this.activeMenuNo];
    tempProperty.definitions = this.convertIntoSBRCSchema(this.usecaseSchema[this.activeMenuNo].definitions);
    this.properties = tempProperty;

    console.log(this.properties);
    console.log(tempProperty);


  }



  nextStep() {
    this.saveData(this.currentTab);
    if (this.currentTab < 4) {
      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab += 1;
      this.steps[this.currentTab].classList.add("activeTab")

      this.isActive = this.processSteps[this.currentTab].key;
      this['active' + this.currentTab] = true;
      this['active' + (this.currentTab - 1)] = false;

      alert(this.isActive);

    this.location.replaceState('/create/' +  this.currentTab + '/' + this.usecase + '/' + this.entityKey);
    }

alert(this.isActive);
    this.location.replaceState('/create/' +  this.currentTab + '/' + this.usecase + '/' + this.entityKey);


  }

  backStep() {
    if (this.currentTab < 4) {
      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab -= 1;
      this.steps[this.currentTab].classList.add("activeTab")

      this.isActive = this.processSteps[this.currentTab].key;
      this['active' + this.currentTab] = false;
      this['active' + (this.currentTab - 1)] = true;

      alert(this.isActive);

    this.location.replaceState('/create/' +  this.currentTab + '/' + this.usecase + '/' + this.entityKey);
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

    if (this.isActive != 'createSchema') {
      index = index - 1;
    }

    this.sideMenu = document.querySelector('#sideMenu');
    this.menus = this.sideMenu.querySelectorAll(".menu");
    this.an_menus[0].classList.remove("activeMenu");
    //    this.currentMenu = index;
    this.activeMenuNo = index;
    //  if(index >= this.menus.length )
    //  {
    //   this.activeMenuNo = this.menus.length - 1;
    //  }

    this.an_menus = this.menus[this.activeMenuNo].querySelectorAll(".a-menu");
    this.an_menus[0].classList.add("activeMenu");
    this.entityKey = entitykey;

    this.location.replaceState('/create/' +  this.currentTab + '/' + this.usecase + '/' + this.entityKey);

    if(this.isShowJson)
    {
      this.getEntityJson();
    }



    // this.entityFields = this.apiEntityName[this.currentMenu];
    // this.getEntityFields1();

  }

  createEntity(event) {


    if (this.actionIs == 'add') {
      let str = this.entityName.replace(/\s+/g, '');
      let key = str.charAt(0).toUpperCase() + str.slice(1)

      // this.description = '';
      let data = {
        'title': this.entityName,
        'description': this.description
      }

      // this.entityListArr.push(this.newSchemaTemplate(key, data))
      // this.entityFieldList[key] = this.newSchemaTemplate(key, data);
      this.usecaseSchema.push(this.newSchemaTemplate(key, data));


      setTimeout(() => {
        this.openEntity(this.menus.length, key);

      }, 500);

    } else {
      // this.usecaseSchema[this.activeMenuIndex].definitions[this.entityKey].title = this.entityName;
      // this.usecaseSchema[this.activeMenuIndex].definitions[this.entityKey].description = this.description;
      this.usecaseSchema[this.activeMenuIndex].title = this.entityName;
      this.usecaseSchema[this.activeMenuIndex].description = this.description;


    }

  }

  viewField(type, objectIndex_i, nastedObjIndex_j) {

    this.objFieldIndex = objectIndex_i;
    this.nastedFieldIndex = nastedObjIndex_j;
    this.editJsonType = type;


    let viewSchemaField;

    if (type == 'nasted') {
      viewSchemaField = this.usecaseSchema[this.activeMenuNo].definitions.data[objectIndex_i].data[nastedObjIndex_j];
    } else {
      viewSchemaField = this.usecaseSchema[this.activeMenuNo].definitions.data[objectIndex_i];
    }


    this.compFieldJson = this.convertSchemaToFormioJson(viewSchemaField);
    this.isAddFormPg = true;
  }

  deleteField(type, objectIndex_i, nastedObjIndex_j) {
    if (confirm("Are you sure to delete ")) {
      if (type == 'nasted') {
        //  delete this.usecaseSchema[this.activeMenuNo].definitions[objectIndex_i].data[nastedObjIndex_j];
        this.usecaseSchema[this.activeMenuNo].definitions.data[objectIndex_i].data.splice(nastedObjIndex_j, 1);

      } else {
        //delete this.usecaseSchema[this.activeMenuNo].definitions[objectIndex_i];
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
    let value = this.jsonEditor.get();
    this.usecaseSchema[this.activeMenuNo] = value;
    this.getEntityPropertiesByIndex(this.activeMenuNo);
    this.isShowJson = !this.isShowJson;
    // let value = this.jsonEditor.get();
    // this.properties = value;
    // this.usecaseSchema[this.activeMenuNo].definitions = this.createObjectFormat(this.properties);
  }

  hideJSon() {
    this.isShowJson = !this.isShowJson;

  }

  jsonSchemaData(formioJson) {

    if (this.compFieldJson) {
      if (this.editJsonType == 'nasted') {
        this.usecaseSchema[this.activeMenuNo].definitions.data[this.objFieldIndex].data[this.nastedFieldIndex].data.title = formioJson[0].label;

      } else {
        this.usecaseSchema[this.activeMenuNo].definitions.data[this.objFieldIndex].data.title = formioJson[0].label;
      }
    } else {



      let tempFieldObjSec = [];


      for (let i = 0; i < formioJson.length; i++) {
        if (formioJson[i].type == "container") {

          let tempjson = this.readNastedFormioJson(formioJson[i].components);

          let key = formioJson[i].label.replaceAll(/\s/g, '');
          key = key.charAt(0).toLowerCase() + key.slice(1);


          tempFieldObjSec.push(
            {
              propertyName: formioJson[i].label,
              propertKey: key,
              type: "object",
              data: tempjson
            })

        } else {

          let key = formioJson[i].label.replaceAll(/\s/g, '');
          key = key.charAt(0).toLowerCase() + key.slice(1);


          let data = formioJson[i];
          let title = formioJson[i].label;
          data['title'] = title;
          data['type'] = (formioJson[i].type == 'textfield') ? "string" : formioJson[i].type;

          tempFieldObjSec.push(
            {
              "key": key,
              "type": (formioJson[i].type == 'textfield') ? "string" : formioJson[i].type,
              "visiblity": ['private'],
              data
            })

        }

        this.usecaseSchema[this.activeMenuNo].definitions.data.push(tempFieldObjSec[i]);
        //       this.usecaseSchema[this.activeMenuNo].definitions[formioJson[i].key].properties.push(tempFieldObjSec[i]);


      }

    }


  }

  readNastedFormioJson(arrayObj) {
    let tempFieldObjSec = [];

    for (let i = 0; i < arrayObj.length; i++) {
      // let data = arrayObj[key1];

      arrayObj[i]['title'] = arrayObj[i].label;
      arrayObj[i]['type'] = (arrayObj[i].type == 'textfield') ? "string" : arrayObj[i].type;
      let data = arrayObj[i]
      let key = arrayObj[i].label.replaceAll(/\s/g, '');
      key = key.charAt(0).toLowerCase() + key.slice(1);


      tempFieldObjSec.push(
        {
          "key": key,
          "type": arrayObj[i].type,
          "visiblity": ['private'],
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
      "definitions": [{
        [key]: {
          "$id": "#/properties/" + key,
          "type": "object",
          "title": data.title,
          "description": data.description,
          "required": [],
          "properties": {}
        }
      }]
    }

    return entityTemplate;
  }

  saveData(currentTab) {
    //alert(this.isActive);
    if (this.isActive == 'createSchema') {

      for(let i=0; i< this.usecaseSchema.length; i++)
      {
        this.usecaseSchema[i].definitions = this.convertIntoSBRCSchema(this.usecaseSchema[i].definitions);

      }
   let  schemaParams = {
     'schema' :  this.usecaseSchema

      }

      localStorage.setItem('schemaParams', JSON.stringify(schemaParams));


    }
  }


  
}
