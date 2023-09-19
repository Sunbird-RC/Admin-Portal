import { Component, OnInit, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { V2schemaService } from 'src/app/services/v2schema.service';
import { FormioJsonService } from '../create-entity/schema-to-formiojson';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { GeneralService } from 'src/app/services/general/general.service';

export interface IIssuer {
  name: string;
  did: string;
}

@Component({
  selector: 'app-create-v2-schema',
  templateUrl: './create-v2-schema.component.html',
  styleUrls: ['./create-v2-schema.component.scss']
})
export class CreateV2SchemaComponent implements OnInit {
  objectKeys = Object.keys;
  schemaList: any[] = [];
  entityName: string;
  description: string;
  tags: string
  issuer: string;
  issuerList: IIssuer[] = [];
  addSchema: boolean = false;
  activeMenuNo: number = 0;
  actionIs: string;
  isShowJson: boolean = false;
  properties: any;
  editorOptions: JsonEditorOptions;
  isAddFormPg: boolean = false;
  compFieldJson: any = [];

  @ViewChild(JsonEditorComponent) jsonEditor: JsonEditorComponent;
  constructor(
    private readonly v2SchemaService: V2schemaService,
    private readonly formioJsonService: FormioJsonService,
    private readonly router: Router,
    private readonly toastMsgService: ToastMessageService,
    private readonly generalService: GeneralService
  ) { }

  ngOnInit(): void {
    this.initializeEditor();
    this.getSchemaList();
    this.getIssuerList();
  }

  getSchemaList() {
    this.v2SchemaService.getSchemaListDetails().subscribe((res: any) => {
      if (Array.isArray(res)) {
        res = res.reduce((acc, val) => acc.concat(val), []);
      }
      this.schemaList = res;
      console.log("res", res);
    });
    // this.schemaList = [{
    //   "title": "test",
    //   "description": "test",
    //   "tags": "ulpq2"
    // }];
  }

  getIssuerList() {
    this.v2SchemaService.getIssuerList().subscribe((issuers) => {
      this.issuerList = issuers;
      console.log(this.issuerList);
    }, error => {
      console.log("Eror while fetching Issuer List", error);
    })
  }

  initializeEditor() {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();
  }

  openEntityModal(action, i?) {
    if (action == 'add') {
      this.addSchema = true;
      this.entityName = '';
      this.description = '';
      this.tags = '';
    } else {
      this.addSchema = false;
      this.issuer = this.schemaList?.[i]?.schema?.author || '';
      this.entityName = this.schemaList?.[i]?.schema?.name || '';
      this.description = this.schemaList?.[i]?.schema?.schema?.description;
      this.tags = this.schemaList[i].tags;
      this.activeMenuNo = i;
    }

    this.actionIs = action;
  }

  createEntity(event) {
    let str = this.entityName.replace(/\s+/g, '');
    let key = str.charAt(0).toUpperCase() + str.slice(1);
    this.entityName = key;

    if (this.actionIs === 'add') {
      let data = {
        'title': this.entityName,
        'description': this.description,
        'tag': this.tags.split(',').map(item => item.trim()),
        'issuer': this.issuer
      }

      this.schemaList = [...this.schemaList, this.v2SchemaService.getSchemaTemplate(data)];
      console.log("schemaList", this.schemaList);
      this.properties = this.schemaList[this.activeMenuNo];
      this.changeActiveMenu(this.schemaList.length - 1);
    }
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  openEntity(index, entitykey) {
    // this.sideMenu = document.querySelector('#sideMenu');
    // this.menus = this.sideMenu.querySelectorAll(".menu");
    // this.an_menus[0].classList.remove("activeMenu");
    this.activeMenuNo = index;

    // this.an_menus = this.menus[this.activeMenuNo].querySelectorAll(".a-menu");
    // this.an_menus[0].classList.add("activeMenu");
    // this.entityKey = entitykey;

    if (this.isShowJson) {
      this.getEntityJson();
    }
  }

  changeActiveMenu(index) {
    setTimeout(() => {
      this.openEntity(index, this.schemaList[index].schema.name);
    }, 700);
  }

  toggleShowJson() {
    this.isShowJson = !this.isShowJson;
    this.getEntityJson();
  }
  getEntityJson() {
    this.properties = this.schemaList[this.activeMenuNo];
  }

  navigateToTemplates() {
    this.router.navigateByUrl(`/v2-schema/${this.schemaList[this.activeMenuNo].schema.id}/templates`);
  }

  readConvertJsonData(event) {
    let value = this.jsonEditor.get();
    this.schemaList[this.activeMenuNo] = value;
    // this.getEntityPropertiesByIndex(this.activeMenuNo);
    this.isShowJson = !this.isShowJson;
  }

  showAddForm() {
    this.compFieldJson = [];
    let schema = { ...this.schemaList[this.activeMenuNo].schema.schema };
    if (schema?.properties) {
      this.compFieldJson = Object.keys(schema.properties).length ? this.v2SchemaService.convertSchemaToFormioJson(schema) : [];
    }
    this.isAddFormPg = true;
  }

  goBackEvent() {
    this.isAddFormPg = false;
    this.changeActiveMenu(this.activeMenuNo);
    // setTimeout(() => {
    //   this.openEntity(this.activeMenuNo, this.usecaseSchema[this.activeMenuNo].title)
    // }, 500);
  }

  deleteEntity() {

  }

  onSelect() {

  }

  backStep() {
    this.router.navigateByUrl('/home');
  }


  jsonSchemaData(formioJson) {
    console.log("compField", this.compFieldJson);

    if (this.compFieldJson) {
      formioJson = this.compFieldJson;
    }
    let requiredFields = [];
    let properties = {};
    formioJson.forEach((element: any) => {
      let key = '';
      if (element.key) {
        key = element.key;
      } else {
        key = element.label.replaceAll(/\s/g, '');
        key = key.charAt(0).toLowerCase() + key.slice(1);
      }

      // let key = element.key ? element.key : element.label.replaceAll(/\s/g, '').toUpperCase();
      if (element?.validate?.required) {
        requiredFields.push(element.key);
      }

      const propertiesObj = {
        [key]: {
          type: element.type !== 'number' ? "string" : element.type,
        }
      }

      if (element.hasOwnProperty('key') && element.key == 'dateTime') {
        propertiesObj[key]['format'] = 'date';
      }

      if (element?.description) {
        propertiesObj[key]['description'] = element.description
      }

      if (element?.placeholder) {
        propertiesObj[key]['placeholder'] = element['placeholder'];
      }

      if (element?.data?.values?.length) {
        propertiesObj[key]['enum'] = this.getEnumValueFromFormio(element.data.values);
      }

      properties = { ...properties, ...propertiesObj };
    });

    this.schemaList[this.activeMenuNo].schema.schema.properties = properties;
    this.schemaList[this.activeMenuNo].schema.schema.required = requiredFields;
  }

  getEnumValueFromFormio(enumList) {
    let enumArr = [];
    for (let i = 0; i < enumList.length; i++) {
      enumArr.push(enumList[i].value);
    }
    return enumArr;
  }

  createSchema() {
    console.log(this.schemaList[this.activeMenuNo]);
    if (Object.keys(this.schemaList[this.activeMenuNo].schema.schema.properties).length) {
      if (this.schemaList[this.activeMenuNo].schema.id) {
        this.v2SchemaService.createSchema(this.schemaList[this.activeMenuNo]).subscribe(res => {
          console.log(res);
        }, error => {
          console.log(error);
        });
      } else {
        this.v2SchemaService.getDid().pipe(switchMap((did: string) => {
          this.schemaList[this.activeMenuNo].schema.id = did;
          return this.v2SchemaService.createSchema(this.schemaList[this.activeMenuNo]);
        })).subscribe(res => {
          console.log(res);
          this.toastMsgService.success('', this.generalService.translateString('SCHEMA_CREATED_SUCCESSFULLY'));
          this.getSchemaList();
        }, error => {
          this.toastMsgService.error('', this.generalService.translateString('UNABLE_TO_CREATE_SCHEMA'));
          console.log(error);
        });
      }
    }
  }

}
