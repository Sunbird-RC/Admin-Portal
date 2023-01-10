import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../../services/data/schema.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Location } from '@angular/common';
import { GeneralService } from 'src/app/services/general/general.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';
import { FormioJsonService } from './schema-to-formiojson';
import { SchemaBodyService } from './schema-body'


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
  compFieldJson: any = [];
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

  visiblityOpt = [{
    "name": "Private",
    "key": "private"
  },
  {
    "name": "Public",
    "key": "public"
  },
  {
    "name": "Personal",
    "key": "personal"
  }];

  privateFields: any = [];
  internalFields: any = [];
  privateFieldsName: string = '';
  items: any = [];
  isNew: boolean = true;
  secFieldObj: any = {};
  isStatus: any;
  commonSchemaField: any;
  deleteingOsid: any;
  index: any;
  usecaseSchemaData: any;
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public schemaService: SchemaService,
    public generalService: GeneralService,
    public toastMsg: ToastMessageService,
    public translate: TranslateService,
    public location: Location,
    public formioJsonService: FormioJsonService,
    public schemaBodyService: SchemaBodyService) {
  }

  ngOnInit(): void {
    this.commonSchemaField = [];
    localStorage.setItem('commonSchema', "[]");

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();

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

      this.getSchema();

    })

  }

  readSchema(res) {
    for (let i = 0; i < res.length; i++) {
      if (typeof (res[i].schema) == 'string') {
        res[i].schema = JSON.parse(res[i].schema);
        res[i].schema['osid'] = res[i].osid;
        res[i].schema['status'] = res[i].status;

        this.usecase = res[i].referedSchema;

        this.isNew = false;

        if (res[i].schema.hasOwnProperty('isRefSchema') && res[i].schema.isRefSchema) {
          this.usecaseSchema.unshift(res[i].schema);
          this.commonschemaDefination = res[i].schema;
          this.containCommonField = true;
        } else {
          this.usecaseSchema.push(res[i].schema);
        }

        if (i == (res.length - 1)) {
          this.getEntityProperties();
          if (!this.containCommonField) {
            this.usecaseSchema.unshift(this.schemaBodyService.commonSchemaBody());
          }
          if (!this.params.entity) {
            this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.usecaseSchema[i].title);
          }
        }

      }
    }
  }

  getSchema() {
    this.usecaseSchema = [];
    this.generalService.getData('/Schema').subscribe((res) => {
      if (res) {
        this.schemaService.getEntitySchemaJSON().subscribe((data) => {
          this.processSteps = data['usecase']['education']['steps'];
        });

        this.readSchema(res);

      } else {
        this.getSchemaJSON();
      }

    }, (err) => {
      this.getSchemaJSON();

    });

    setTimeout(() => {
      this.stepList = document.querySelector('#stepList');
      this.steps = this.stepList.querySelectorAll(".tab");
      this.steps[this.currentTab].classList.add("activeTab");

      this.sideMenu = document.querySelector('#sideMenu');
      this.menus = this.sideMenu.querySelectorAll(".menu");

      if (this.params.entity) {
        for (let i = 0; i < this.menus.length; i++) {
          if (this.menus[i].innerText == this.params.entity) {
            this.activeMenuNo = i;
          }
        }
      } else {
        this.activeMenuNo = (this.activeMenuNo >= this.menus.length) ? this.activeMenuNo - 1 : this.activeMenuNo;
      }

      if (this.menus.length) {
        this.an_menus = this.menus[this.activeMenuNo]?.querySelectorAll(".a-menu");
        this.an_menus[0].classList.add("activeMenu");
      }
    }, 1000);
  }





  getSchemaJSON() {
    this.schemaService.getEntitySchemaJSON().subscribe((data) => {
      this.schemaUrl = data['usecase'][this.usecase];

      if (data['usecase'][this.usecase]['entity'].length) {
        this.entityList = data['usecase'][this.usecase]['entity'];
      }

      this.processSteps = data['usecase'][this.usecase]['steps'];
      this.getEntityFields();


    })
  }

  getEntityFields() {

    if (this.entityList.length) {

      for (let j = 0; j < this.entityList.length; j++) {

        this.schemaService.getJSONData(this.entityList[j].schemaUrl).subscribe((res) => {
          this.defination.push(res);
          res['status'] = 'DRAFT';

          if (res.hasOwnProperty('isRefSchema') && res.isRefSchema) {
            this.usecaseSchema.unshift(res);
            this.commonschemaDefination = res;
            this.containCommonField = true;
          } else {
            this.usecaseSchema.push(res);
          }

          if (j == (this.entityList.length - 1)) {


            if (!this.containCommonField) {
              this.usecaseSchema.unshift(this.schemaBodyService.commonSchemaBody());
            }

            this.getEntityProperties();
            if (this.params.entity) {
              this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.params.entity);
            } else {
              this.location.replaceState('/create/' + this.currentTab + '/' + this.usecase + '/' + this.usecaseSchema[1].title);

            }
            this.activeMenuNo = 1;
          }
        })


      }
    } else {
      this.usecaseSchema.push(this.schemaBodyService.commonSchemaBody());
      this.activeMenuNo = 0;
    }

  }

  getEntityProperties() {
    console.log(this.usecaseSchema);
    for (let j = 0; j < this.usecaseSchema.length; j++) {
      this.getEntityPropertiesByIndex(j);

      if (j == (this.usecaseSchema.length - 1)) {
        for (let k = 0; k < this.usecaseSchema.length; k++) {

          if (this.params.entity == this.usecaseSchema[k].title) {
            this.activeMenuNo = k;
          }
          if (this.usecaseSchema[k].hasOwnProperty('isRefSchema') && this.usecaseSchema[k].isRefSchema) {

            this.commonSchemaField = this.convertSchemaToFormioJson(this.usecaseSchema[k].definitions.data);
            localStorage.setItem('commonSchema', JSON.stringify(this.commonSchemaField));

          }
        }
      }
    }
  }


  getEntityPropertiesByIndex(j) {
    let res = this.usecaseSchema[j];
    this.entityName = res.title;
    this.description = (res.description) ? res.description : '';
    this.entityKey = res.title;
    this.activeMenuNo = j;
    this.privateFieldsName = '';
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
          "required": (res.definitions[self.entityKey].hasOwnProperty('required') && res.definitions[self.entityKey].required.length) ? res.definitions[self.entityKey].required : [],
          "$id": (res.definitions[self.entityKey].hasOwnProperty('$id')) ? res.definitions[self.entityKey]['$id'] : '',
          "data": self.readPropertyObj(res.definitions[self.entityKey].properties)
        });
      });

      let cKey = res.title.replaceAll(/\s/g, '');
      cKey = cKey.charAt(0).toLowerCase() + cKey.slice(1);

      this.usecaseSchema[j].definitions = {
        "type": 'object',
        "data": tempObj,
        "isRefSchema": true
      };

      this.commonschemaDefination = this.usecaseSchema[j];

    } else if (res.definitions.hasOwnProperty(this.entityKey)) {
      this.properties = res.definitions[this.entityKey].properties;
      this.processEntity = j;
      if (res.hasOwnProperty('_osConfig') && res._osConfig.hasOwnProperty('privateFields')) {
        this.privateFields[j] = res._osConfig.privateFields;
      } else {
        this.privateFields[j] = [];
      }

      if (res.hasOwnProperty('_osConfig') && res._osConfig.hasOwnProperty('internalFields')) {
        this.internalFields[j] = res._osConfig.internalFields;
      } else {
        this.internalFields[j] = [];
      }

      this.required = (res.definitions[this.entityKey].hasOwnProperty('required') && res.definitions[this.entityKey].required.length) ? res.definitions[this.entityKey].required : this.required;

      this.usecaseSchema[j].definitions = {
        "propertyName": res.definitions[this.entityKey].title,
        "propertyKey": this.entityKey,
        "type": res.definitions[this.entityKey].type,
        "required": (res.definitions[this.entityKey].hasOwnProperty('required') && res.definitions[this.entityKey].required.length) ? res.definitions[this.entityKey].required : [],
        "$id": (res.definitions[this.entityKey].hasOwnProperty('$id')) ? res.definitions[this.entityKey]['$id'] : '',
        "data": this.readPropertyObj(this.properties)
      };
    }


  }

  convertIntoSBRCSchema(sProperties): {} {
    let tempFieldObj = {};

    if (!sProperties.hasOwnProperty('property')) {
      if (sProperties.hasOwnProperty('propertyKey')) {

        tempFieldObj[sProperties.propertyKey] = {
          "$id": sProperties['$id'],
          "type": sProperties['type'],
          "title": sProperties['propertyName'],
          "required": (sProperties.hasOwnProperty('required')) ? sProperties.required : [],
          "properties": {}
        }

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

              tempFieldObj[sProperties.propertyKey]['properties'][nastedKey] = tempFieldSecObj[nastedKey];

            }
          } else {
            let property = sProperties.data[i];
            tempFieldObj[sProperties.propertyKey]['properties'][property.key] = property.data

          }

        }

        return tempFieldObj;
      } else if (sProperties.hasOwnProperty('isRefSchema')) {

        for (let i = 0; i < sProperties.data.length; i++) {

          if (sProperties.data[i].hasOwnProperty('propertyKey')) {
            let dataObj = this.convertIntoSBRCSchema(sProperties.data[i]);
            this.secFieldObj[sProperties.data[i].propertyKey] = dataObj[sProperties.data[i].propertyKey]
          } else {
            let dataObj = sProperties.data[i];
            this.secFieldObj[dataObj.key] = {
              "$id": "#/properties/" + dataObj.key,
              "type": dataObj.type,
              "title": dataObj.data.title,
              "required": (dataObj.hasOwnProperty('required')) ? dataObj.required : [],
            }

            if (dataObj.data.hasOwnProperty('enum') && dataObj.data.enum) {
              this.secFieldObj[dataObj.key]['enum'] = dataObj.data.enum;
            }

            dataObj[sProperties.data[i].key]

          }
        }

        tempFieldObj = this.secFieldObj;
        this.secFieldObj = {};
        return tempFieldObj;

      }



    } else {
      return {};
    }

  }


  readPropertyObj(propertyObj) {
    let tempFieldObjSec = [];
    let self = this;
    let data;
    Object.keys(propertyObj).forEach(function (key) {
      data = propertyObj[key];
      if (data != undefined) {

        if ((data.hasOwnProperty('type') && data.type == 'array')) {

          let dataTemp = self.readArraySchema(data);
          if (dataTemp.hasOwnProperty('data')) {
            dataTemp = dataTemp['data'];
          }

          self.required = (data.hasOwnProperty('required') && data.required.length) ? data.required : self.required;

          if (self.privateFieldsName == '') {
            self.privateFieldsName = "$." + key;
          } else {
            self.privateFieldsName = self.privateFieldsName.concat("." + key);
          }

          tempFieldObjSec.push({
            "propertyName": (data.hasOwnProperty('title') ? data.title : key),
            "propertyKey": key,
            "type": data.type,
            "$ref": '',
            "required": (data.hasOwnProperty('required') && data.required.length) ? data.required : [],
            "$id": (data.hasOwnProperty('$id')) ? data['$id'] : '',
            "data": dataTemp
          });

          if (!self.usecaseSchema[self.activeMenuNo].hasOwnProperty('isRefSchema') && !self.usecaseSchema[self.activeMenuNo].isRefSchema) {
            tempFieldObjSec[tempFieldObjSec.length - 1]['$ref'] = ((data.hasOwnProperty('$ref')) ? data['$ref'] : ((data.hasOwnProperty('items') && data.items.hasOwnProperty('$ref') ? data.items['$ref'] : '')));
          }

        } else if ((data.hasOwnProperty('$ref'))) {
          tempFieldObjSec.push(self.readCommonSchema(data));

          if (self.privateFieldsName == '') {
            self.privateFieldsName = "$." + key;
          } else {
            self.privateFieldsName = self.privateFieldsName.concat("." + key);
          }


          if (!self.usecaseSchema[self.activeMenuNo].hasOwnProperty('isRefSchema') && !self.usecaseSchema[self.activeMenuNo].isRefSchema) {
            tempFieldObjSec[tempFieldObjSec.length - 1]['$ref'] = data['$ref'];
          }

        } else if ((data.hasOwnProperty('type') && data.type == 'object') && data.hasOwnProperty('properties')) {

          self.required = (data.hasOwnProperty('required') && data.required.length) ? data.required : self.required;

          if (self.privateFieldsName == '') {
            self.privateFieldsName = "$." + key;
          } else {
            self.privateFieldsName = self.privateFieldsName.concat("." + key);
          }

          tempFieldObjSec.push({
            "propertyName": (data.hasOwnProperty('title') ? data.title : key),
            "propertyKey": key,
            "type": data.type,
            "$ref": '',
            "required": (data.hasOwnProperty('required') && data.required.length) ? data.required : [],
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



          if (self.privateFieldsName == '') {
            self.privateFieldsName = "$." + key;
          } else {
            self.privateFieldsName = self.privateFieldsName.concat("." + key);
          }

          let visiblityIs = 'public';

          if (!self.usecaseSchema[self.activeMenuNo].hasOwnProperty('isRefSchema') && !self.usecaseSchema[self.activeMenuNo].isRefSchema) {

            visiblityIs = (!(self.privateFields[self.activeMenuNo]).length && !(self.internalFields[self.activeMenuNo]).length) ? self.setPVisibility() : self.checkVisibility();
          }

          tempFieldObjSec.push(
            {
              "key": key,
              "type": (propertyObj[key].type == "string") ? 'string' : propertyObj[key].type,
              "visiblity": visiblityIs,
              "required": required,
              data
            });

          self.setPVisibility();
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


          if (self.privateFieldsName == '') {
            self.privateFieldsName = "$." + key;
          } else {
            self.privateFieldsName = self.privateFieldsName.concat("." + key);
          }

          let visiblityIs = (!(self.privateFields[self.activeMenuNo]).length && !(self.internalFields[self.activeMenuNo]).length) ? self.setPVisibility() : self.checkVisibility();


          tempFieldObjSec.push(
            {
              "key": key,
              "type": (propertyObj[key].type == "string") ? 'string' : propertyObj[key].type,
              "visiblity": visiblityIs,
              "required": required,
              data
            });

          self.setPVisibility();
        }
      }

    });

    return tempFieldObjSec;

  }

  checkVisibility() {

    let privateArr = (this.privateFields[this.activeMenuNo]);
    let internalArr = (this.internalFields[this.activeMenuNo]);

    if (privateArr) {

      let isPrivate = privateArr.some(x => x.toLowerCase() == this.privateFieldsName.toLowerCase());
      let isInternal = internalArr.some(x => x.toLowerCase() == this.privateFieldsName.toLowerCase());
      for (let i = 0; i < privateArr.length; i++) {
        if (isPrivate) {
          this.privateFieldsName = '';

          return 'private';
        } else if (isInternal) {
          this.privateFieldsName = '';

          return 'personal';
        } else if (!isPrivate && !isInternal) {
          this.privateFieldsName = '';
          return 'public';
        }

      }
    }

    if (internalArr) {

      let isPrivate = privateArr.some(x => x.toLowerCase() == this.privateFieldsName.toLowerCase());
      let isInternal = internalArr.some(x => x.toLowerCase() == this.privateFieldsName.toLowerCase());

      for (let i = 0; i < internalArr.length; i++) {
        if (isPrivate) {
          this.privateFieldsName = '';

          return 'private';
        } else if (isInternal) {
          this.privateFieldsName = '';

          return 'personal';
        } else if (!isPrivate && !isInternal) {
          this.privateFieldsName = '';
          return 'public';
        }

      }
    }

  }

  setPVisibility() {

    let privateArr = (this.privateFields[this.activeMenuNo]) ? this.privateFields[this.activeMenuNo] : [];
    let internalArr = (this.internalFields[this.activeMenuNo]) ? this.internalFields[this.activeMenuNo] : [];

    if ((!privateArr.length && !internalArr.length)) {
      this.privateFieldsName = '';
      return 'public';
    }
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
    this.privateFieldsName = '';

    if (commonSchema.type != 'array' && commonSchema.hasOwnProperty('$ref')) {
      refUrl = commonSchema['$ref'];
    } else if (commonSchema.type == 'array' && commonSchema.hasOwnProperty('$ref')) {
      refUrl = commonSchema['$ref']
    } else if (commonSchema.type == 'array' && commonSchema.hasOwnProperty('items')) {
      refUrl = commonSchema.items['$ref']
    } else if (commonSchema.hasOwnProperty('$ref')) {
      refUrl = commonSchema['$ref'];
    }

    if (commonSchema.hasOwnProperty('$id')) {
      let splitArr = commonSchema.$id.split('/');

      for (let j = 2; j < splitArr.length; j++) {
        if (this.privateFieldsName == '') {
          this.privateFieldsName = "$." + splitArr[j];
        } else {
          this.privateFieldsName = this.privateFieldsName.concat("." + splitArr[j]);
        }

      }
    } else {

      refKey = (refUrl) ? refUrl.split("definitions/").pop() : '';
      if (refKey) {
        if (this.privateFieldsName == '') {
          this.privateFieldsName = "$." + refKey;
        } else {
          this.privateFieldsName = this.privateFieldsName.concat("." + refKey);
        }
      }

    }



    let objInCommon = refUrl.includes(".json");
    refKey = (refUrl) ? refUrl.split("definitions/").pop() : refUrl;
    if (objInCommon) {

      let arrayObj;

      if (this.commonschemaDefination.definitions.hasOwnProperty('data') && this.commonschemaDefination.definitions.data.length) {
        for (let j = 0; j < this.commonschemaDefination.definitions.data.length; j++) {

          if (this.commonschemaDefination.definitions.data[j].propertyKey == refKey) {
            arrayObj = this.commonschemaDefination.definitions.data[j];

            for (let k = 0; k < arrayObj.data.length; k++) {
              if (this.privateFieldsName == '') {
                this.privateFieldsName = "$." + refKey + '.' + arrayObj.data[k].key;
              } else {
                this.privateFieldsName = this.privateFieldsName.concat("." + arrayObj.data[k].key);
              }

              arrayObj.data[k].visiblity = (!(this.privateFields[this.activeMenuNo]).length) ? this.setPVisibility() : this.checkVisibility();
            }

          }
        }

        this.required = (arrayObj.hasOwnProperty('required') && arrayObj.required.length) ? arrayObj.required : this.required;
        tempFieldObjSec = arrayObj;


      } else {

        for (let j = 0; j < this.commonschemaDefination.definitions.data.length; j++) {

          if (this.commonschemaDefination.definitions.data[j].propertyKey == refKey) {
            arrayObj = this.commonschemaDefination.definitions.data[j];

          }
        }

        this.required = (arrayObj.hasOwnProperty('required') && arrayObj.required.length) ? arrayObj.required : this.required;
        tempFieldObjSec = arrayObj;

      }

    } else {
      let sdata = this.usecaseSchema[this.processEntity].definitions;
      let refSecKey = refKey.charAt(0).toLowerCase() + refKey.slice(1);
      let arrayObj = (sdata.hasOwnProperty(refKey)) ? sdata[refKey].properties : (sdata.hasOwnProperty(refSecKey) ? sdata[refSecKey].properties : {});
      this.required = (sdata[refKey].hasOwnProperty('required') && sdata[refKey].required.length) ? sdata[refKey].required : this.required;


      tempFieldObjSec = this.readPropertyObj(arrayObj);
    }

    return tempFieldObjSec;

  }

  showAddForm() {
    this.compFieldJson = '';
    let viewSchemaField = this.usecaseSchema[this.activeMenuNo].definitions.data;
    this.compFieldJson = this.convertSchemaToFormioJson(viewSchemaField);

    this.isAddFormPg = true;

  }

  goBackEvent() {
    this.isAddFormPg = false;
    this.changeActiveMenu(this.activeMenuNo);
    // setTimeout(() => {
    //   this.openEntity(this.activeMenuNo, this.usecaseSchema[this.activeMenuNo].title)
    // }, 500);
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
    this.usecaseSchema = [];
    this.saveData();
    if (this.currentTab < this.steps.length) {
      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab += 1;
      this.steps[this.currentTab].classList.add("activeTab")

      this.isActive = this.processSteps[this.currentTab].key;
      this['active' + this.currentTab] = true;
      this['active' + (this.currentTab - 1)] = false;

      this.router.navigateByUrl('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);

    } else {
      this.router.navigateByUrl('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);

    }

  }


  onSelect(userSchema) {
    this.usecaseSchemaData = userSchema;
  }

  backStep() {
    this.usecaseSchema = [];
    if (this.currentTab >= 1 && this.currentTab < this.steps.length) {
      this.steps[this.currentTab].classList.remove("activeTab");
      this.currentTab -= 1;
      this.steps[this.currentTab].classList.add("activeTab")

      this.isActive = this.processSteps[this.currentTab].key;
      this['active' + this.currentTab] = false;
      this['active' + (this.currentTab - 1)] = true;


      this.router.navigateByUrl('/create/' + this.currentTab + '/' + this.usecase + '/' + this.entityKey);

      // if (this.currentTab == 0) {
      //   this.usecaseSchema = [];
      //   this.ngOnInit();
      // }

    } else {
      this.router.navigateByUrl('/home');
    }


  }


  openEntityModal(action, i) {

    if (action == 'add') {
      this.entityName = '';
      this.description = '';
    } else {
      this.entityName = this.usecaseSchema[i].title;
      this.description = this.usecaseSchema[i].description;
      this.activeMenuNo = i;
    }

    this.actionIs = action;

  }

  openEntity(index, entitykey) {

    if (this.isActive != 'createSchema') {
      index = index - 1;
    }

    this.sideMenu = document.querySelector('#sideMenu');
    this.menus = this.sideMenu.querySelectorAll(".menu");
    this.an_menus[0].classList.remove("activeMenu");
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
      let data = {
        'title': this.entityName,
        'description': this.description
      }

      this.entityKey = this.entityName;
      this.usecaseSchema.push(this.schemaBodyService.newSchemaTemplate(key, data));
      this.getEntityPropertiesByIndex(this.usecaseSchema.length - 1);
      this.changeActiveMenu(this.menus.length);

      // setTimeout(() => {
      //   this.openEntity(this.menus.length, key);
      // }, 700);

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

  viewField() {

    let viewSchemaField;

    viewSchemaField = this.usecaseSchema[this.activeMenuNo].definitions.data;

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


  deleteEntity(i, action) {
    if (i || !action) {
      this.deleteingOsid = (this.usecaseSchema[i].osid) ? this.usecaseSchema[i].osid : '';
      this.index = i;
    }

    if (action == 'delete') {
      if (this.deleteingOsid) {
        this.generalService.deleteData('/Schema', this.deleteingOsid).subscribe((res) => {
          console.log({ res });
          this.usecaseSchema.splice(this.index, 1);
          this.index = (this.index > (this.usecaseSchema.length)) ? this.index - 1 : this.index + 1;
          this.openEntity(this.index, this.usecaseSchema[this.index].title);
        }, (err) => {
          console.log({ err });
        })
      } else {
        this.usecaseSchema.splice(this.index, 1);

        this.index = (this.index >= this.usecaseSchema.length) ? (this.index - 1) : this.index;
        this.changeActiveMenu(this.index);

      }

    }
    console.log(this.usecaseSchema[i]);
  }

  convertSchemaToFormioJson(viewSchemaField) {
    if (viewSchemaField) {
      let newArr = this.formioJsonService.convertSchemaToFormioJson(viewSchemaField);
      return newArr;
    }
  }

  containerFields(fieldData) {
    let compJson = {
      "label": fieldData.propertyName,
      "tableView": false,
      "key": fieldData.propertyKey,
      "type": "container",
      "input": true,
      "components": [
      ]
    }

    if (fieldData.description) {
      compJson['description'] = fieldData.description;
    }

    if (fieldData.placeholder) {
      compJson['placeholder'] = fieldData.placeholder;
    }


    for (let i = 0; i < fieldData.data.length; i++) {
      if (fieldData.data[i].type == 'string') {

        let compJsonS = this.singleField(fieldData.data[i]);
        compJson.components.push(compJsonS);
      } else {
        let compJson1 = this.containerFields(fieldData.data[i]);
        compJson.components.push(compJson1);

      }
    }

    return compJson;

  }


  singleField(fieldData) {
    let compJsonS = {
      "label": fieldData.data.title,
      "validate": {
        "required": fieldData.required
      },
      "tableView": true,
      "key": fieldData.key,
      "$id": "#/properties/" + fieldData.key,
      "type": (fieldData.type == 'string') ? "textfield" : fieldData.type,
      "input": true
    }

    if (fieldData.data.hasOwnProperty('description') && fieldData.data.description) {
      compJsonS['description'] = fieldData.data.description;
    }

    if (fieldData.data.hasOwnProperty('placeholder') && fieldData.data.placeholder) {
      compJsonS['placeholder'] = fieldData.data.placeholder;
    }

    return compJsonS
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

    if (this.compFieldJson) {
      formioJson = this.compFieldJson;
    }

    let tempFieldObjSec = [];
    let requiredFields = [];

    for (let i = 0; i < formioJson.length; i++) {

      if (formioJson[i].type == "container") {
        let key

        if (formioJson[i].key) {
          key = formioJson[i].key;
        } else {
          key = formioJson[i].label.replaceAll(/\s/g, '');
          key = key.charAt(0).toLowerCase() + key.slice(1);
        }

        if (this.privateFieldsName == '') {
          this.privateFieldsName = "$." + key;
        } else {
          this.privateFieldsName = this.privateFieldsName.concat("." + key);
        }

        let tempjson = this.readNastedFormioJson(formioJson[i].components);


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


        let key;
        if (formioJson[i].key) {
          key = formioJson[i].key;
        } else {
          key = formioJson[i].label.replaceAll(/\s/g, '');
          key = key.charAt(0).toLowerCase() + key.slice(1);
        }


        if (formioJson[i].hasOwnProperty('validate') && formioJson[i].validate.required) {
          requiredFields.push(formioJson[i].key);
        }

        let data = formioJson[i];

        let tempjson1 = {};
        tempjson1['$id'] = data.hasOwnProperty('$id') ? data['$id'] : '#/properties/' + key;
        tempjson1['type'] = (data.type != 'number') ? 'string' : data.type;
        tempjson1['title'] = data.hasOwnProperty('label') ? data['label'] : data['title'];

        if (data.hasOwnProperty('description') && data.description) {
          tempjson1['description'] = data['description'];
        }

        if (data.hasOwnProperty('placeholder') && data.placeholder) {
          tempjson1['placeholder'] = data['placeholder'];
        }

        if (data.hasOwnProperty('data') && data.data.values.length) {
          tempjson1['enum'] = this.getEnumValueFromFormio(data.data.values);
        }

        if (this.privateFieldsName == '') {
          this.privateFieldsName = "$." + key;
        } else {
          this.privateFieldsName = this.privateFieldsName.concat("." + key);
        }

        data = tempjson1;
        let visiblityIs;
        if (!this.usecaseSchema[this.activeMenuNo].hasOwnProperty('isRefSchema') && this.privateFields.hasOwnProperty(this.activeMenuNo)) {
          visiblityIs = (!(this.privateFields[this.activeMenuNo]).length && !(this.internalFields[this.activeMenuNo]).length) ? this.setPVisibility() : this.checkVisibility();
        } else {
          visiblityIs = 'public';
        }

        tempFieldObjSec.push(
          {
            "key": key,
            "$id": "#/properties/" + key,
            "type": (formioJson[i].type != 'number') ? "string" : formioJson[i].type,
            "visiblity": visiblityIs,
            "required": (formioJson[i].hasOwnProperty('validate')) ? formioJson[i].validate.required : false,
            data
          });

        this.setPVisibility();
      }

    }

    this.usecaseSchema[this.activeMenuNo].definitions['data'] = tempFieldObjSec;
    this.usecaseSchema[this.activeMenuNo].definitions['required'] = requiredFields;
    this.changeActiveMenu(this.activeMenuNo);

    // setTimeout(() => {
    //   this.openEntity(this.activeMenuNo, this.usecaseSchema[this.activeMenuNo].title)
    // }, 500);

    if (this.usecaseSchema[this.activeMenuNo].hasOwnProperty('isRefSchema') && this.usecaseSchema[this.activeMenuNo].isRefSchema) {

      this.commonSchemaField = this.convertSchemaToFormioJson(this.usecaseSchema[this.activeMenuNo].definitions.data);
      localStorage.setItem('commonSchema', JSON.stringify(this.commonSchemaField));

    }


  }

  readNastedFormioJson(arrayObj) {
    let tempFieldObjSec = [];

    let commonKey = (this.privateFieldsName) ? this.privateFieldsName : '';

    for (let i = 0; i < arrayObj.length; i++) {

      if (arrayObj[i].type != "container") {

        tempFieldObjSec.push(this.convertSingleFiledFormioNastedObj(arrayObj, i, commonKey));
      }
      else {

        tempFieldObjSec.push(this.convertSingleFiledFormioObj(arrayObj, i));

      }
    };

    this.setPVisibility();

    return tempFieldObjSec;

  }


  convertSingleFiledFormioNastedObj(arrayObj, i, commonKey) {
    arrayObj[i]['title'] = arrayObj[i].label;
    arrayObj[i]['type'] = (arrayObj[i].type != 'number') ? "string" : arrayObj[i].type;
    let data = arrayObj[i]


    let key;
    if (arrayObj[i].key) {
      key = arrayObj[i].key;
    } else {
      key = arrayObj[i].label.replaceAll(/\s/g, '');
      key = key.charAt(0).toLowerCase() + key.slice(1);
    }

    let tempjson1 = {};
    tempjson1['$id'] = data.hasOwnProperty('$id') ? data['$id'] : '#/properties/' + key;
    tempjson1['type'] = data.hasOwnProperty('type') ? 'string' : 'string'
    tempjson1['title'] = data.hasOwnProperty('label') ? data['label'] : data['title'];

    if (data.hasOwnProperty('description') && data.description) {
      tempjson1['description'] = data['description'];
    }

    if (data.hasOwnProperty('placeholder') && data.placeholder) {
      tempjson1['placeholder'] = data['placeholder'];
    }

    if (data.hasOwnProperty('data') && data.data.values.length) {
      tempjson1['enum'] = this.getEnumValueFromFormio(data.data.values);
    }

    if (this.privateFieldsName == '') {
      this.privateFieldsName = commonKey + '.' + key;
    } else {
      this.privateFieldsName = this.privateFieldsName.concat("." + key);
    }

    data = tempjson1;
    let visiblityIs;
    if (!this.usecaseSchema[this.activeMenuNo].hasOwnProperty('isRefSchema') && !this.usecaseSchema[this.activeMenuNo].isRefSchema) {
      visiblityIs = (!(this.privateFields[this.activeMenuNo]).length && !(this.internalFields[this.activeMenuNo]).length) ? this.setPVisibility() : this.checkVisibility();
    } else {
      visiblityIs = 'public';

    }

    let tempFieldObjSec =
    {
      "key": key,
      "$id": "#/properties/" + key,
      "type": arrayObj[i].type,
      "multiple": data.hasOwnProperty('multiple') ? data['multiple'] : false,
      "visiblity": visiblityIs,
      "required": (arrayObj[i].hasOwnProperty('validate')) ? arrayObj[i].validate.required : false,
      data
    }

    return tempFieldObjSec;
  }

  convertSingleFiledFormioObj(formioJson, i) {
    let key;

    if (formioJson[i].key) {
      key = formioJson[i].key;
    } else {
      key = formioJson[i].label.replaceAll(/\s/g, '');
      key = key.charAt(0).toLowerCase() + key.slice(1);
    }

    if (this.privateFieldsName == '') {
      this.privateFieldsName = "$." + key;
    } else {
      this.privateFieldsName = this.privateFieldsName.concat("." + key);
    }

    let tempjson = this.readNastedFormioJson(formioJson[i].components);


    let requiredSecFields = [];
    for (let j = 0; j < formioJson[i].components.length; j++) {
      if (formioJson[i].components[j].validate.required) {
        requiredSecFields.push(formioJson[i].components[j].key);
      }
    }

    let tempFieldObj =
    {
      propertyName: formioJson[i].label,
      propertyKey: key,
      type: "object",
      "required": requiredSecFields,
      data: tempjson
    }

    return tempFieldObj;
  }



  getEnumValueFromFormio(enumList) {
    let enumArr = [];

    for (let i = 0; i < enumList.length; i++) {

      enumArr.push(enumList[i].value);
    }

    return enumArr;

  }

  saveData() {
    if (this.isActive == 'createSchema') {
      let tempProperty: any;
      tempProperty = this.usecaseSchema;
      for (let i = 0; i < this.usecaseSchema.length; i++) {

        tempProperty[i].definitions = this.convertIntoSBRCSchema(this.usecaseSchema[i].definitions);
        let cJson = this.convertIntoSBRCSchema(this.usecaseSchema[i].definitions);

      }

    }
  }


  createSchema(index) {

    let errArr = [];
    let tempProperty: any;

    tempProperty = this.usecaseSchema;

    for (let i = 0; i < this.usecaseSchema.length; i++) {
      let osid;
      if (!this.usecaseSchema[i].hasOwnProperty('isRefSchema') || !this.usecaseSchema[i].isRefSchema) {
        this.addCrtTemplateFields(this.usecaseSchema[i]);
      }

      let cJson = this.convertIntoSBRCSchema(this.usecaseSchema[i].definitions);

      if (cJson) {
        tempProperty[i].definitions = {};
        tempProperty[i].definitions = cJson;
      }

      this.isNew = (tempProperty[i].hasOwnProperty('osid') ? false : true);
      this.isStatus = (tempProperty[i].hasOwnProperty('status') ? tempProperty[i].status : '');

      if (!this.isNew) {
        osid = tempProperty[i].osid;
        delete tempProperty[i].osid;
        delete tempProperty[i].status;
      }

      console.log({ tempProperty });
      if (tempProperty.length == this.usecaseSchema.length) {
        let payload = {
          "name": tempProperty[i].title,
          "description": tempProperty[i].description,
          "schema": JSON.stringify(tempProperty[i]),
          "referedSchema": this.usecase,
          "status": "DRAFT"
        }

        if (!this.isNew) {
          this.usecaseSchema[i].osid = osid;
          this.usecaseSchema[i].status = this.isStatus;
        }

        if (this.isNew) {
          this.generalService.postData('/Schema', payload).subscribe((res) => {
            this.usecaseSchema[i].osid = res.result.Schema.osid;

            if (i == this.usecaseSchema.length - 1 && !errArr.length) {
              this.getEntityProperties();
              if (!index) {
                this.nextStep();
              }
            } else if (i == this.usecaseSchema.length - 1) {
              this.showErrMsg(errArr);
            }
          }, (err) => {
            errArr.push(this.usecaseSchema[i].title);
            if (i == this.usecaseSchema.length - 1) {
              this.showErrMsg(errArr);
            }
          })
        } else if (this.isStatus != 'PUBLISHED') {

          this.generalService.putData('/Schema', osid, payload).subscribe((res) => {

            if (i == this.usecaseSchema.length - 1 && !errArr.length) {
              this.getEntityProperties();
              if (!index) {
                this.nextStep();
              }
            } else if (i == this.usecaseSchema.length - 1) {
              this.showErrMsg(errArr);
            }
          }, (err) => {
            errArr.push(this.usecaseSchema[i].title);

            if (errArr.length == 1 && (errArr.includes('Common') || errArr.includes('common'))) {

              console.log('err ----', err);
            } else {
              if (i == this.usecaseSchema.length - 1) {
                this.showErrMsg(errArr);
              }
            }
          })
        } else {
          if (i == (this.usecaseSchema.length - 1)) {
            if (!index) {
              this.nextStep();
            }
          }

        }
      }
    }
  }


  showErrMsg(errArr) {
    this.getEntityProperties();
    this.toastMsg.error('error', errArr + " name schema already exists, please rename ");
  }


  saveConfiguration() {

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
        "status": "DRAFT",
        "referedSchema": this.usecase,
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

  onVisibilityChange(event, oldVisibility, type, j, k, m) {
    let res = this.usecaseSchema[this.activeMenuNo].definitions;
    let fieldName = '';
    let key = '';
    let key1 = '';
    let key2 = '';

    if (type == 'string') {
      res.data[j].visiblity = event.target.value;


      let key = res.data[j].key.charAt(0).toLowerCase() + res.data[j].key.slice(1);
      fieldName = '$.' + key;

    } else if (type == 'nasted') {
      res.data[j].data[k].visiblity = event.target.value;


      key = res.data[j].propertyKey.charAt(0).toLowerCase() + res.data[j].propertyKey.slice(1);
      key1 = res.data[j].data[k].key.charAt(0).toLowerCase() + res.data[j].data[k].key.slice(1);

      fieldName = '$.' + key + '.' + key1;

    } else if (type == 'childNased') {
      res.data[j].data[k].data[m].visiblity = event.target.value;


      key = res.data[j].propertyKey.charAt(0).toLowerCase() + res.data[j].propertyKey.slice(1);
      key1 = res.data[j].data[k].key.charAt(0).toLowerCase() + res.data[j].data[k].key.slice(1);
      key2 = res.data[j].data[k].data[m].key.charAt(0).toLowerCase() + res.data[j].data[k].data[m].key.slice(1);

      fieldName = '$.' + key + '.' + key1 + '.' + key2;

    }

    if (oldVisibility == 'private') {
      let arr = this.privateFields[this.activeMenuNo];
      this.privateFields[this.activeMenuNo] = arr.filter(item => item !== fieldName);
    }

    if (oldVisibility == 'personal') {
      let arr = this.internalFields[this.activeMenuNo];
      this.internalFields[this.activeMenuNo] = arr.filter(item => item !== fieldName);
    }

    if (event.target.value == 'private') {
      if (!this.privateFields[this.activeMenuNo].includes(fieldName)) {
        this.privateFields[this.activeMenuNo].push(fieldName);
      }
    }

    if (event.target.value == 'personal') {
      if (!this.internalFields[this.activeMenuNo].includes(fieldName)) {
        this.internalFields[this.activeMenuNo].push(fieldName);
      }
    }

    this.usecaseSchema[this.activeMenuNo]['_osConfig']['privateFields'] = this.privateFields[this.activeMenuNo];
    this.usecaseSchema[this.activeMenuNo]['_osConfig']['internalFields'] = this.internalFields[this.activeMenuNo];
  }

  goBack() {
    this.location.back();
  }

  space(event: any) {

    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }


  changeActiveMenu(index) {
    setTimeout(() => {
      this.openEntity(index, this.usecaseSchema[index].title);
    }, 700);
  }

}

