import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.scss']
})
export class OwnershipComponent implements OnInit, OnChanges {
  @Input() usecaseSchema;
  params: any;
  isSettingMenu: boolean = false;
  ownershipForm: FormGroup;
  items: any = [];
  entityName: any;
  propertyList = [];
  propertyNames = [];
  selectedProperty: any;
  entityList: any[];
  schemaStatus: any;

  constructor(
    private activeRoute: ActivatedRoute,
    public translate: TranslateService,
    private fb: FormBuilder,
    public generalService: GeneralService
  ) {
    this.ownershipForm = this.fb.group({
      primaryLogin: this.fb.group({
        userIDCheckbox : false,
        userIDField : '',
        emailCheckbox: false,
        emailField: '',
        mobilenumberCheckbox: false,
        mobilenumberField: '',
        passwordCheckbox:false,
        passwordField: ''
      }),
      issuer: 'anonymous',
      issuerRole: '',
      invitee:'anonymous',
      inviteRole:''
    })
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.params = params;

      if (params.hasOwnProperty('page') && params.page)
        this.isSettingMenu = true;
      this.entityName = params.entity;
    });

    this.generalService.getData('/Schema').subscribe((res) => {
      this.readSchema(res);

      this.populateFields();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const latestRequest = changes['usecaseSchema'];
    if (latestRequest.currentValue) {
      this.entityName = latestRequest.currentValue;
      this.populateFields();
    }
  }

  readSchema(res) {
    for (let i = 0; i < res.length; i++) {
      if (typeof (res[i].schema) == 'string') {
        res[i].schema = JSON.parse(res[i].schema);
        if (!res[i].schema.hasOwnProperty('isRefSchema') && !res[i].schema.isRefSchema) {
          this.items.push(res[i]);
        }
      }
    }
  }

  populateFields() {
    this.propertyList = [];
    this.propertyNames = [];
    this.entityList = [];
    for (let i = 0; i < this.items.length; i++) {
      this.entityList.push(this.items[i].name);
      if (this.items[i]["name"] == this.entityName) {
        this.schemaStatus = this.items[i].status;
        let properties = this.items[i]["schema"]["definitions"][this.entityName]["properties"];
        let requiredProperties = this.items[i]["schema"]["definitions"][this.entityName]["required"];
        for(let j=0; j< requiredProperties.length; j++){
          this.propertyNames.push(requiredProperties[j]);
        }
        const keys = Object.keys(properties);
        keys.forEach((key, index) => {
          properties[key] = {
            ...properties[key],
            "key": key
          }
          this.propertyList.push(properties[key]);          
        });
        
      }
    }
  }

  submitOwnershipForm() {
    if (this.ownershipForm.value.uniqueField == undefined || this.ownershipForm.value.uniqueField.length === 0) {
      return;
    }

    for (let i = 0; i < this.propertyNames.length; i++) {
      if (this.ownershipForm.value.uniqueField === this.propertyNames[i]) {
        this.selectedProperty = this.propertyList[i];
      }
    }

    for (let i = 0; i < this.items.length; i++) {
      if (this.entityName === this.items[i].name) {
        let ownershipObj = {};
        let alternateOwnershipObj = {};
        let editSchema = this.items[i]["schema"];
        editSchema["_osConfig"]["ownershipAttributes"] = [];
        editSchema["_osConfig"]["uniqueIndexFields"] = [];

        if (this.ownershipForm.value.primaryLogin['userIDCheckbox']) {
          ownershipObj = {
            ...ownershipObj,
            "userID": "/" + this.selectedProperty?.key + "/userID"
          }
        }
        if (this.ownershipForm.value.primaryLogin['emailCheckbox']) {
          ownershipObj = {
            ...ownershipObj,
            "email": "/" + this.selectedProperty?.key + "/email"
          }
        }
        if (this.ownershipForm.value.primaryLogin['mobilenumberCheckbox']) {
          ownershipObj = {
            ...ownershipObj,
            "mobile": "/" + this.selectedProperty?.key + "/contact"
          }
        }
        if (this.ownershipForm.value.primaryLogin['passwordCheckbox']) {
          ownershipObj = {
            ...ownershipObj,
            "password": "/" + this.selectedProperty?.key + "/password"
          }
        }

        if (Object.keys(ownershipObj).length !== 0) {
          editSchema["_osConfig"]["ownershipAttributes"].push(ownershipObj);
          editSchema["_osConfig"]["uniqueIndexFields"].push(this.selectedProperty.key);
        }

        if (this.ownershipForm.value.alternateLoginCheckbox && this.ownershipForm.value.alternateLogin['emailCheckbox']) {
          alternateOwnershipObj = {
            ...alternateOwnershipObj,
            "email": "/" + this.selectedProperty?.key + "/email"
          }
        }
        if (this.ownershipForm.value.alternateLoginCheckbox && this.ownershipForm.value.alternateLogin['mobilenumberCheckbox']) {
          alternateOwnershipObj = {
            ...alternateOwnershipObj,
            "mobile": "/" + this.selectedProperty?.key + "/contact"
          }
        }
        if (Object.keys(alternateOwnershipObj).length !== 0) {
          editSchema["_osConfig"]["ownershipAttributes"].push(alternateOwnershipObj);
          editSchema["_osConfig"]["uniqueIndexFields"].push(this.selectedProperty.key);
        }

        let payload = {
          ...this.items[i],
          "schema": JSON.stringify(editSchema)
        }
        this.generalService.putData('/Schema', this.items[i].osid, payload).subscribe((res) => {
          console.log("Post data in ownership", res);
        })
      }
    }
    console.log(this.ownershipForm);
  }

}
