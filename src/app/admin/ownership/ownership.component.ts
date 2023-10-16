import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';
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
  useCaseSchema: any = [];
  entityName: any;
  propertyList = [];
  propertyNames = [];
  selectedProperty: any;
  entityList: any[];
  schemaStatus: any;
  passwordCheck: boolean;
  issuerCheck: string;
  inviteCheck: string;
  email: any;
  emailCheck: boolean;
  userID: any;
  userIDCheck: boolean;
  mobile: any;
  mobileCheck: boolean;
  password: any;
  issuerRole: any;
  inviteRole: any;
  defaultOptionValue: string = '';

  constructor(
    private activeRoute: ActivatedRoute,
    public translate: TranslateService,
    public toastMsg: ToastMessageService,
    private fb: FormBuilder,
    public generalService: GeneralService
  ) {
    this.ownershipForm = this.fb.group({
      primaryLogin: this.fb.group({
        userIDCheckbox: false,
        userIDField: '',
        emailCheckbox: false,
        emailField: '',
        mobilenumberCheckbox: false,
        mobilenumberField: '',
        passwordCheckbox: false,
        passwordField: ''
      }),
      issuer: 'anonymous',
      issuerRole: '',
      invitee: 'anonymous',
      inviteRole: '',
      newRole: ''
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
      for (let i = 0; i < res.length; i++) {
        if (typeof (res[i].schema) == 'string') {
          res[i].schema = JSON.parse(res[i].schema);
          if (!res[i].schema.hasOwnProperty('isRefSchema') && !res[i].schema.isRefSchema) {
            this.useCaseSchema.push(res[i]);
          }
        }
      }
      this.populateFields();
      this.readSchema();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const latestRequest = changes['usecaseSchema'];
    if (latestRequest.currentValue) {
      this.entityName = latestRequest.currentValue;
      this.populateFields();
      this.readSchema();
    }
  }

  readSchema() {
    for (let i = 0; i < this.useCaseSchema.length; i++) {
      if (this.useCaseSchema[i]["name"] == this.entityName) {
        if (this.useCaseSchema[i].schema._osConfig['ownershipAttributes'].length || this.useCaseSchema[i].schema._osConfig['roles'].length || this.useCaseSchema[i].schema._osConfig['inviteRoles'] != 'anonymous') {
          if (this.useCaseSchema[i].schema._osConfig['ownershipAttributes'].length) {
            this.email = this.useCaseSchema[i].schema._osConfig['ownershipAttributes'][0].email;
            this.email = this.email.substring(1);
            this.email == '' ? this.emailCheck = false : this.emailCheck = true;

            this.userID = this.useCaseSchema[i].schema._osConfig['ownershipAttributes'][0].userID;
            this.userID = this.userID.substring(1);
            this.userID == '' ? this.userIDCheck = false : this.userIDCheck = true;

            this.mobile = this.useCaseSchema[i].schema._osConfig['ownershipAttributes'][0].mobile;
            this.mobile = this.mobile.substring(1);
            this.mobile == '' ? this.mobileCheck = false : this.mobileCheck = true;

            this.password = this.useCaseSchema[i].schema._osConfig['ownershipAttributes'][0].password ? this.useCaseSchema[i].schema._osConfig['ownershipAttributes'][0].password : '';
            this.password = this.password.substring(1);
            this.password == '' ? this.passwordCheck = false : this.passwordCheck = true;
          }
          if (this.useCaseSchema[i].schema._osConfig['roles'] && this.useCaseSchema[i].schema._osConfig['roles'].length) {
            this.issuerRole = this.useCaseSchema[i].schema._osConfig['roles'][0];
            this.issuerRole ? this.issuerCheck = 'role' : this.issuerCheck = 'anonymous';
            if(!this.entityList.includes(this.issuerRole)){
              this.entityList.push(this.issuerRole);
            }
          }

          if (this.useCaseSchema[i].schema._osConfig['inviteRoles'] && this.useCaseSchema[i].schema._osConfig['inviteRoles'].length) {
            this.inviteRole = this.useCaseSchema[i].schema._osConfig['inviteRoles'][0];
            this.inviteRole ? this.inviteCheck = 'inviteRoles' : this.issuerCheck = 'anonymous'
            if(!this.entityList.includes(this.inviteRole)){
              this.entityList.push(this.inviteRole);
            }
          }

          this.ownershipForm.patchValue({
            primaryLogin: {
              userIDCheckbox: this.userIDCheck,
              userIDField: this.userID,
              emailCheckbox: this.emailCheck,
              emailField: this.email,
              mobilenumberField: this.mobile,
              mobilenumberCheckbox: this.mobileCheck,
              passwordCheckbox: this.passwordCheck,
              passwordField: this.password
            },
            issuer: this.issuerCheck,
            issuerRole: this.issuerRole,
            invitee: this.inviteCheck,
            inviteRole: this.inviteRole
          });
        }
        if (!this.useCaseSchema[i].schema._osConfig['ownershipAttributes'].length && !this.useCaseSchema[i].schema._osConfig['roles'].length && this.useCaseSchema[i].schema._osConfig['inviteRoles'] == 'anonymous') {
          this.ownershipForm.patchValue({
            primaryLogin: {
              userIDCheckbox: false,
              userIDField: '',
              emailCheckbox: false,
              emailField: '',
              mobilenumberCheckbox: false,
              mobilenumberField: '',
              passwordCheckbox: false,
              passwordField: ''
            },
            issuer: 'anonymous',
            issuerRole: '',
            invitee: 'anonymous',
            inviteRole: ''
          });
        }


      }
    }

  }

  populateFields() {
    this.propertyList = [];
    let propertyName = new Set();
    this.entityList = [];
    for (let i = 0; i < this.useCaseSchema.length; i++) {
      let entityListItem = this.useCaseSchema[i].name;
      if (!this.entityList.includes(entityListItem)) {
        this.entityList.push(entityListItem);
      }
      if (this.useCaseSchema[i]["name"] == this.entityName) {
        this.schemaStatus = this.useCaseSchema[i].status;
        let properties = this.useCaseSchema[i]["schema"]["definitions"][this.entityName]["properties"];
        let requiredProperties = this.useCaseSchema[i]["schema"]["definitions"][this.entityName]["required"];
        if (this.useCaseSchema[i]["schema"]["definitions"][this.entityName]?.properties) {
          var nestedFields = this.useCaseSchema[i]["schema"]["definitions"][this.entityName].properties;
          for (let c in nestedFields) {
            if (nestedFields.hasOwnProperty(c)) {
              if (nestedFields[c].required) {
                for (let k = 0; k < nestedFields[c].required.length; k++) {
                  requiredProperties.push(nestedFields[c].required[k])
                }
              }
            }
          }
        }
        for (let j = 0; j < requiredProperties.length; j++) {
          propertyName.add(requiredProperties[j]);
        }
        this.propertyNames = Array.from(propertyName);
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

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const controlName = checkbox.id;
    if (!checkbox.checked) {
      switch (controlName) {
        case 'flexCheckUserID':
          this.ownershipForm.get('primaryLogin.userIDField').setValue(this.defaultOptionValue);
          break;
        case 'flexCheckEmail':
          this.ownershipForm.get('primaryLogin.emailField').setValue(this.defaultOptionValue);
          break;
        case 'flexCheckMobile':
          this.ownershipForm.get('primaryLogin.mobilenumberField').setValue(this.defaultOptionValue);
          break;
        case 'flexCheckPassword':
          this.ownershipForm.get('primaryLogin.passwordField').setValue(this.defaultOptionValue);
          break;
      }
    }
  }

  onIssuerRadioChange(event: Event) {
    const radio = event.target as HTMLInputElement;
    radio.id !='customRadio2'? this.ownershipForm.get('issuerRole').setValue(this.defaultOptionValue) : null;            
  }

  onInviteRadioChange(event: Event) {
    const radio = event.target as HTMLInputElement;
    radio.id !='inviteCustomRadio2'? this.ownershipForm.get('inviteRole').setValue(this.defaultOptionValue) : null;            
  }

  createRole() {
    if (this.ownershipForm.value['newRole']) {
      if (!this.entityList.includes(this.ownershipForm.value['newRole'])) {
        this.entityList.push(this.ownershipForm.value['newRole']);
      }
      this.toastMsg.success('success', this.ownershipForm.value['newRole'] + ' Role is created Sucessfully!');
      this.ownershipForm.patchValue({ newRole: '' });
    }
  }

  submitOwnershipForm(toMoveNext) {
    for (let i = 0; i < this.useCaseSchema.length; i++) {
      if (this.entityName === this.useCaseSchema[i].name) {
        let ownershipObj = {};
        let entitySchema = this.useCaseSchema[i]["schema"];
        entitySchema["_osConfig"]["ownershipAttributes"] = [];
        entitySchema["_osConfig"]["roles"] = [];
        entitySchema["_osConfig"]["inviteRoles"] = [];

        if (this.ownershipForm.value.primaryLogin['userIDCheckbox']) {
          ownershipObj = {
            ...ownershipObj,
            "userID": "/" + this.ownershipForm.value.primaryLogin['userIDField']
          }
        }
        if (this.ownershipForm.value.primaryLogin['emailCheckbox']) {
          ownershipObj = {
            ...ownershipObj,
            "email": "/" + this.ownershipForm.value.primaryLogin['emailField']
          }
        }
        if (this.ownershipForm.value.primaryLogin['mobilenumberCheckbox']) {
          ownershipObj = {
            ...ownershipObj,
            "mobile": "/" + this.ownershipForm.value.primaryLogin['mobilenumberField']
          }
        }
        if (this.ownershipForm.value.primaryLogin['passwordCheckbox']) {
          ownershipObj = {
            ...ownershipObj,
            "password": "/" + this.ownershipForm.value.primaryLogin['passwordField']
          }
        }

        if (this.ownershipForm.value.primaryLogin['userIDField'] == '' || this.ownershipForm.value.primaryLogin['emailField'] == '' || this.ownershipForm.value.primaryLogin['mobilenumberField'] == '') {
          const emptyFields = [];
          this.ownershipForm.value.primaryLogin['userIDField'] === '' ? emptyFields.push('User ID') : null;
          this.ownershipForm.value.primaryLogin['emailField'] === '' ? emptyFields.push('Email') : null;
          this.ownershipForm.value.primaryLogin['mobilenumberField'] === '' ? emptyFields.push('Mobile Number') : null;
          var mandatoryFields = emptyFields.join(', ');
          this.toastMsg.error('Error', mandatoryFields + ' is Mandatory!');
          toMoveNext = false;
        } else {
          if (Object.keys(ownershipObj).length !== 0) {
            entitySchema["_osConfig"]["ownershipAttributes"].push(ownershipObj);
          }
          if (this.ownershipForm.value['issuerRole']) {
            entitySchema["_osConfig"]["roles"].push(this.ownershipForm.value['issuerRole'])
          }
          if (this.ownershipForm.value['inviteRole']) {
            entitySchema["_osConfig"]["inviteRoles"].push(this.ownershipForm.value['inviteRole'])
          }


          let schemaOsid = this.useCaseSchema[i].osid;
          let payload = {
            "schema": JSON.stringify(entitySchema)
          }
          this.generalService.putData('/Schema', schemaOsid, payload).subscribe((res) => {
            console.log("Post data in ownership", res);
          });
          toMoveNext = true;
        }
      }
    }
    return toMoveNext;
  }
}
