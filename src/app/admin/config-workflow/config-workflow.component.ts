import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GeneralService } from "src/app/services/general/general.service";
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: "config-workflow",
  templateUrl: "./config-workflow.component.html",
  styleUrls: ["./config-workflow.component.scss"],
})
export class ConfigWorkflowComponent implements OnInit {
  @Input() usecaseSchema;
  entityName: any;
  schemaName = [];
  schemaName_data = [];
  entityList = [];
  fieldList = [];
  fieldList_data = [];
  propertyName = [];
  feildNameList = [];
  selectedMenuFields = [];
  global_properties = [];
  global_tempName = "";
  fieldtype = ["String", "Boolean", "Number"]
  global_properties_student = [];
  global_tempName_student = "";
  workflowForm: FormGroup;
  attestationForm: FormGroup;
  values = [];
  tname = "add fields";
  ftype = "";
  onAddFields: boolean = false;
  compFieldJson: string;
  privateFieldsName: string;
  temp_arr: string[];
  additionInputArr: any = [];
  conditionSelectOptions: any = [];
  saveModalWorkflowIndex: number;
  modalSelectedAttributes: any = [];
  fullSchemas: any = [];
  javaspelMethods = [
    { name: "EQUAL_TO", value: "equals" },
    { name: "NOT_EQUAL_TO", value: "not_equals" },
    { name: "GREATER_THAN", value: "greater_than" },
    { name: "LESS_THAN", value: "less_than" },
    { name: "GREATER_THAN_EQUAL_TO", value: "greater_than_equal_to" },
    { name: "LESS_THAN_EQUAL_TO", value: "less_than_equal_to" },
    { name: "CONTAINS", value: "contains" },
    { name: "NOT_CONTAINS", value: "not_contains" },
  ]

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    public generalService: GeneralService,
    private fb: FormBuilder
  ) {

    this.workflowForm = this.fb.group({
      workflowItems: this.fb.array([
      ])
    });

  }

  patchValueData() {

    var data = {
      workflowItems: [
        {
          workflowname: '',
          issuancesystem: '',
          attestation_type: 'auto_attestation',
          attestorConditions: [
            {
              selectEntity: '', anyOrAllCondition: '', fieldConditions: [{
                selectConditionOne: '',
                method: 'equals',
                selectConditionTwo: ''
              }]
            }
          ],
          additionalInput: {},
          attestationProperties: []
        }
      ]
    }


    data.workflowItems.forEach(t => {

      var workflow: FormGroup = this.newWorkflowItems();
      this.workflowItems().push(workflow);

      t.attestorConditions.forEach(b => {
        var attest = this.newAttestCondition();

        (workflow.get("attestorConditions") as FormArray).push(attest)

        b.fieldConditions.forEach(s => {
          (attest.get("fieldConditions") as FormArray).push(this.newFieldCondition())
        })

      });
    });

    console.log({ data });
    this.workflowForm.patchValue(data);
  }

  ngOnInit(): void {

   // this.patchValueData();


    this.entityName = this.activeRoute.snapshot.params.entity;

    let selectedMenuList: any;
    this.generalService.getData("/Schema").subscribe((res) => {
      this.fullSchemas = res;
      for (let i = 0; i < res.length; i++) {
        this.schemaName.push(JSON.parse(res[i]["schema"]));

        if (!this.schemaName[i].hasOwnProperty('isRefSchema') && !this.schemaName[i]['isRefSchema']) {
          this.entityList.push(this.schemaName[i]["title"]);
        }

        this.fieldList.push(this.schemaName[i]["definitions"]);
        selectedMenuList = this.fieldList.find((e) => e[this.entityName]);
      }

    this.onChangeSelect(this.entityName);
    });
  }

  //------------------------------------Start: dynamic form ---------------------

  //------------Start - workflowItems----------------------

  workflowItems(): FormArray {
    return this.workflowForm.get("workflowItems") as FormArray
  }

  newWorkflowItems(): FormGroup {
    return this.fb.group({
      workflowname: '',
      issuancesystem: '',
      attestation_type: 'MANUAL',  // Currently only support for MANUAL
      attestorConditions: this.fb.array([]),
      additionalInput: {},
      attestationProperties: []
    })
  }

  addWorkflowItems() {
    this.workflowItems().push(this.newWorkflowItems());
    this.conditionSelectOptions.push({ "workflow": [] });
  }

  removeWorkflowItems(wIndex) {
    this.workflowItems().removeAt(wIndex);
    this.conditionSelectOptions.splice(wIndex, 1);
  }

  //------------End - workflowItems----------------------


  //------------Start - Attest Conditions----------------------
  attestConditions(wIndex): FormArray {
    return this.workflowItems().at(wIndex).get("attestorConditions") as FormArray;
  }

  newAttestCondition(): FormGroup {
    return this.fb.group({
      selectEntity: '',
      anyOrAllCondition: '',
      fieldConditions: this.fb.array([])
    })
  }

  addNewAttestCondition(wIndex) {
    this.attestConditions(wIndex).push(this.newAttestCondition());
    this.conditionSelectOptions[wIndex]?this.conditionSelectOptions[wIndex]['workflow'].push({ "attestor": [] }):this.conditionSelectOptions[wIndex] = { "workflow": [{ "attestor": [] }] };
  }

  removeAttestCondition(wIndex: number, aIndex: number) {
    this.attestConditions(wIndex).removeAt(aIndex);
    this.conditionSelectOptions[wIndex]['workflow'].splice(aIndex, 1);
  }



  //------------Start - fieldConditions----------------------
  fieldConditions(aIndex, fIndex): FormArray {
    return this.attestConditions(aIndex).at(fIndex).get("fieldConditions") as FormArray
  }

  newFieldCondition(): FormGroup {
    return this.fb.group({
      selectConditionOne: '',
      method: 'equals',
      selectConditionTwo: ''
    })
  }

  addFieldCondition(wIndex, aIndex) {
    this.fieldConditions(wIndex, aIndex).push(this.newFieldCondition());
  }

  removeFieldCondition(wIndex, aIndex, fIndex) {
    this.fieldConditions(wIndex, aIndex).removeAt(fIndex);
  }
  //------------Start - fieldConditions----------------------


  onSubmit() {
    console.log(this.workflowForm.value);
  }

  //------------------------------------End - dynamic form ---------------------


  ngOnChanges(changes: SimpleChanges): void {
    const latestRequest = changes['usecaseSchema'];
    if (latestRequest.currentValue) {
      this.entityName = latestRequest.currentValue;
      this.global_properties_student = [];

      this.onChangeSelect(this.entityName);
    }
  }

  onChangeSelect(item: any) {
    let arr = [];
    this.selectedMenuFields = [];
    const attest = this.fieldList.find((e) => e[item]);
    arr = this.getPropertiesStudent(attest?.[item], attest);

    this.selectedMenuFields.push(arr);


    console.log( this.selectedMenuFields[0]);
    for(let i = 0; i < this.selectedMenuFields[0].length; i++){

    let fieldName =  this.selectedMenuFields[0][i].split(".");
    fieldName = fieldName[fieldName.length - 1];
    let fieldFullPath = this.findPath(attest, fieldName);
   // this.ObjectbyString(attest, this.findPath(attest, fieldName))

    console.log(fieldFullPath);


      //want key
      // find key path , call findPath()
      // pass key and fieldArr to ObjectbyString()

      console.log(this.ObjectbyString(attest, fieldFullPath + '.' + fieldName));
     this.additionInputArr.push(this.ObjectbyString(attest, fieldFullPath + '.' + fieldName));
     console.log(this.additionInputArr);

     // add key in additionInputArr - todo
    }
  }

  ObjectbyString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  };

  getPropertiesStudent(item: any, main_item: any) {
    this.global_properties_student = [];
    this.getSchemaPropertiesName(item, "", Object.keys(main_item), 0);
    return this.global_properties_student;
  }

  getSchemaPropertiesName(
    item: any,
    key_name: any,
    main_item: any,
    index: any
  ) {
    if (!key_name.includes(this.global_tempName_student) && key_name !== "") {
      key_name = this.global_tempName_student + "." + key_name;
    }
    if (item?.properties) {
      let temp_arr = Object.keys(item?.properties);
      let temp_mykey = main_item[index]; //Object.getOwnPropertyNames(main_item)[0];

      for (let i = 0; i < temp_arr.length; i++) {
        if (item?.properties?.[temp_arr[i]]?.properties) {
          this.getSchemaPropertiesName(
            item?.properties?.[temp_arr[i]],
            key_name + temp_mykey + ".",
            Object.keys(item?.properties),
            i
          );
        } else {
          this.global_properties_student.push(
            key_name === temp_mykey
              ? key_name + "." + temp_arr[i]
              : key_name + temp_mykey + "." + temp_arr[i]
          );
        }
      }
    }
  }

  // Set options for attestation conditions dropdown with properties and nested properties of selected attestor
  setSelectOptions(wIndex: number, aIndex: number, key: string) {
    this.conditionSelectOptions[wIndex]['workflow'][aIndex]['attestor'] = [];
    const attest = this.fieldList.find((e) => e[key]);
    let arr = this.getPropertiesStudent(attest?.[key], attest);
    this.conditionSelectOptions[wIndex]['workflow'][aIndex]['attestor'] = arr;
  }

  onSelect(item: any) {
    let arr = [];
    this.feildNameList = [];
    this.global_properties = [];
    const attest = this.fieldList.find((e) => e[item]);
    arr = this.getProperties(attest?.[item], attest);

    this.feildNameList.push(arr);
  }

  getProperties(item: any, main_item: any) {
    this.global_tempName = Object.keys(main_item)[0];
    this.getPropertiesName(item, "", Object.keys(main_item), 0);
    return this.global_properties;
  }
  getPropertiesName(item: any, key_name: any, main_item: any, index: any) {
    if (!key_name.includes(this.global_tempName) && key_name !== "") {
      key_name = this.global_tempName + "." + key_name;
    }
    if (item?.properties) {
      let temp_arr = Object.keys(item?.properties);
      let temp_mykey = main_item[index];

      for (let i = 0; i < temp_arr.length; i++) {
        if (item?.properties?.[temp_arr[i]]?.properties) {
          this.getPropertiesName(
            item?.properties?.[temp_arr[i]],
            key_name + temp_mykey + ".",
            Object.keys(item?.properties),
            i
          );
        }
        if (item?.properties?.[temp_arr[i]]?.["items"]?.["$ref"]) {
          let myArray = "";
          let feild_name = "";
          let commonSchema_name =
            item?.properties?.[temp_arr[i]]?.["items"]?.["$ref"];
          myArray = commonSchema_name.split("/")[0].split(".")[0];
          feild_name = commonSchema_name.split("/")[3];
          const temp_data_array = this.schemaName?.filter(
            (val) => val.title == myArray
          );
          if (temp_data_array) {
            for (let j = 0; j <= temp_data_array.length; j++) {
              if (
                temp_data_array[j]?.["definitions"]?.[feild_name]?.[
                "properties"
                ]
              ) {
                this.getPropertiesName(
                  temp_data_array[j]?.["definitions"]?.[feild_name],
                  key_name + [temp_arr[i]] + ".",
                  Object.keys(
                    temp_data_array[j]?.["definitions"][feild_name][
                    "properties"
                    ]
                  ),
                  j
                );
              }
            }
          }
        }
        if (item?.properties?.[temp_arr[i]]?.["$ref"]) {
          let myArray = "";
          let feild_name = "";
          let commonSchema_name = item?.properties?.[temp_arr[i]]?.["$ref"];
          console.log(commonSchema_name);
          myArray = commonSchema_name.split("/")[0].split(".")[0];
          feild_name = commonSchema_name.split("/")[3];

          const temp_data_array = this.schemaName?.filter(
            (val) => val.title == myArray
          );

          if (temp_data_array) {
            for (let j = 0; j <= temp_data_array.length; j++) {
              if (temp_data_array[j]?.["definitions"]) {
                this.getPropertiesName(
                  temp_data_array[j]?.["definitions"][feild_name],
                  key_name + temp_mykey + ".",
                  Object.keys(
                    temp_data_array[j]?.["definitions"][feild_name][
                    "properties"
                    ]
                  ),
                  j
                );
              }
            }
          }
        }
        this.global_properties.push(
          key_name === temp_mykey
            ? key_name + "." + temp_arr[i]
            : key_name + temp_mykey + "." + temp_arr[i]
        );
      }
    }
  }

  //-----------------------start -Attestatation Edit Modal ---------------------

  setModalValues(workflowIndex: number) {
    // set the initial values of additionalInput and attestationProperties to be visible in the workflow modal
    this.saveModalWorkflowIndex = workflowIndex; // save the workflowIndex working upon in modal

    let additionalInputs = this.workflowForm.value.workflowItems[workflowIndex].additionalInput;
    let keys = Object.keys(additionalInputs);
    this.values = [];
    for(let i = 0; i < keys.length; i++){
      this.values.push({ value: keys[i], select: additionalInputs[keys[i]]['type'] });
    }

    this.modalSelectedAttributes = this.workflowForm.value.workflowItems[workflowIndex].attestationProperties 
                                    ? this.workflowForm.value.workflowItems[workflowIndex].attestationProperties : [];
  }

  checks = false;
  checkAll(x, val) {
    if (x.target.id === 'form-check-input-select-all' && x.target.checked == true) {
      this.modalSelectedAttributes = [...this.selectedMenuFields[0]];
    } 
    else if (x.target.id === 'form-check-input-select-all' && x.target.checked == false) {
      this.modalSelectedAttributes = [];
    }
    else if (x.target.checked == true) {
      this.checks = true;
      if(!this.modalSelectedAttributes?.includes(val)){
        this.modalSelectedAttributes?.push(val);
      }
    }
    else {
      this.checks = false;
      for (var i = this.modalSelectedAttributes.length - 1; i >= 0; i--) {
        if (this.modalSelectedAttributes[i] === val) {
          this.modalSelectedAttributes.splice(i, 1);
        }
      }
    }
  }

  removefield(i) {
    this.values.splice(i, 1);
  }

  addfield() {
    this.values.push({ value: "", select: "" });
  }

  saveModaldata(){
    
    this.workflowForm.controls['workflowItems']['controls'].at(this.saveModalWorkflowIndex).controls['additionalInput'].setValue({})
    let attestationProperties = []
    for(let i = 0; i < this.values.length; i++){
      if(this.values[i].value === "" || this.values[i].select === ""){
        continue;
      }
      else{
        this.workflowForm.controls['workflowItems']['controls'].at(this.saveModalWorkflowIndex).controls['additionalInput'].setValue({
          ...this.workflowForm.value.workflowItems[this.saveModalWorkflowIndex].additionalInput,
          [this.values[i].value]: { type: this.values[i].select }
        })
        if(!attestationProperties.includes(this.values[i].value)){
          attestationProperties.push(this.values[i].value);
        }
      }
    }

    for(let i=0; i<this.modalSelectedAttributes.length; i++){
      if(!attestationProperties.includes(this.modalSelectedAttributes[i])){
        attestationProperties.push(this.modalSelectedAttributes[i]);
      }
    }
    this.workflowForm.controls['workflowItems']['controls'].at(this.saveModalWorkflowIndex).controls['attestationProperties'].setValue(attestationProperties)
  }

   findPath = (ob, key) => {
    const path = [];
    const keyExists = (obj) => {
      if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
        return false;
      }
      else if (obj.hasOwnProperty(key)) {
        return true;
      }
      else if (Array.isArray(obj)) {
        let parentKey = path.length ? path.pop() : "";
  
        for (let i = 0; i < obj.length; i++) {
          path.push(`${parentKey}[${i}]`);
          const result = keyExists(obj[i]);const findPath = (ob, key) => {
            const path = [];
            const keyExists = (obj) => {
              if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
                return false;
              }
              else if (obj.hasOwnProperty(key)) {
                return true;
              }
              else if (Array.isArray(obj)) {
                let parentKey = path.length ? path.pop() : "";
          
                for (let i = 0; i < obj.length; i++) {
                  path.push(`${parentKey}[${i}]`);
                  const result = keyExists(obj[i]);
                  if (result) {
                    return result;
                  }const findPath = (ob, key) => {
                    const path = [];
                    const keyExists = (obj) => {
                      if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
                        return false;
                      }
                      else if (obj.hasOwnProperty(key)) {
                        return true;
                      }
                      else if (Array.isArray(obj)) {
                        let parentKey = path.length ? path.pop() : "";
                  
                        for (let i = 0; i < obj.length; i++) {
                          path.push(`${parentKey}[${i}]`);
                          const result = keyExists(obj[i]);
                          if (result) {
                            return result;
                          }const findPath = (ob, k) => {
                            const path = [];
                            const keyExists = (obj) => {
                              if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
                                return false;
                              }
                              else if (obj.hasOwnProperty(key)) {
                                return true;
                              }
                              else if (Array.isArray(obj)) {
                                let parentKey = path.length ? path.pop() : "";
                          
                                for (let i = 0; i < obj.length; i++) {
                                  path.push(`${parentKey}[${i}]`);
                                  const result = keyExists(obj[i]);
                                  if (result) {
                                    return result;
                                  }
                                  path.pop();
                                }const findPath = (ob, key) => {
                                  const path = [];
                                  const keyExists = (obj) => {
                                    if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
                                      return false;
                                    }
                                    else if (obj.hasOwnProperty(key)) {
                                      return true;
                                    }
                                    else if (Array.isArray(obj)) {
                                      let parentKey = path.length ? path.pop() : "";
                                
                                      for (let i = 0; i < obj.length; i++) {
                                        path.push(`${parentKey}[${i}]`);
                                        const result = keyExists(obj[i]);
                                        if (result) {
                                          return result;
                                        }
                                        path.pop();
                                      }const findPath = (ob, key) => {
                                        const path = [];
                                        const keyExists = (obj) => {
                                          if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
                                            return false;
                                          }
                                          else if (obj.hasOwnProperty(key)) {
                                            return true;
                                          }
                                          else if (Array.isArray(obj)) {
                                            let parentKey = path.length ? path.pop() : "";
                                      
                                            for (let i = 0; i < obj.length; i++) {
                                              path.push(`${parentKey}[${i}]`);
                                              const result = keyExists(obj[i]);
                                              if (result) {
                                                return result;
                                              }
                                              path.pop();
                                            }
                                          }
                                          else {
                                            for (const k in obj) {
                                              path.push(k);
                                              const result = keyExists(obj[k]);
                                              if (result) {
                                                return result;
                                              }
                                              path.pop();
                                            }
                                          }
                                          return false;
                                        };
                                      
                                        keyExists(ob);
                                      
                                        return path.join(".");
                                      }
                                    }
                                    else {
                                      for (const k in obj) {
                                        path.push(k);
                                        const result = keyExists(obj[k]);
                                        if (result) {
                                          return result;
                                        }
                                        path.pop();
                                      }
                                    }
                                    return false;
                                  };
                                
                                  keyExists(ob);
                                
                                  return path.join(".");
                                }
                              }
                              else {
                                for (const k in obj) {
                                  path.push(k);
                                  const result = keyExists(obj[k]);
                                  if (result) {
                                    return result;
                                  }
                                  path.pop();
                                }
                              }
                              return false;
                            };
                          
                            keyExists(ob);
                          
                            return path.join(".");
                          }
                          path.pop();
                        }
                      }
                      else {
                        for (const k in obj) {
                          path.push(k);
                          const result = keyExists(obj[k]);
                          if (result) {
                            return result;
                          }
                          path.pop();
                        }
                      }
                      return false;
                    };
                  
                    keyExists(ob);
                  
                    return path.join(".");
                  }
                  path.pop();
                }
              }
              else {
                for (const k in obj) {
                  path.push(k);
                  const result = keyExists(obj[k]);
                  if (result) {
                    return result;
                  }
                  path.pop();
                }
              }
              return false;
            };
          
            keyExists(ob);
          
            return path.join(".");
          }
          if (result) {
            return result;
          }
          path.pop();
        }
      }
      else {
        for (const k in obj) {
          path.push(k);
          const result = keyExists(obj[k]);
          if (result) {
            return result;
          }
          path.pop();
        }
      }
      return false;
    };
  
    keyExists(ob);
  
    return path.join(".");
  }

  fromConditionToString = (condition) => {
    let conditionOneArr = condition.selectConditionOne.split(".");
    let conditionTwoArr = condition.selectConditionTwo.split(".");
    let conditionString = "";
    // Converting the selected condition to string according to the respective java spel method
    if (condition.method === "equals") {
      conditionString = "(ATTESTOR#$."+conditionOneArr[conditionOneArr.length - 1]+"#.equals(REQUESTER#$."+conditionTwoArr[conditionTwoArr.length - 1]+"#))";
    }
    else if (condition.method === "not_equals") {
      conditionString = "(!ATTESTOR#$."+conditionOneArr[conditionOneArr.length - 1]+"#.equals(REQUESTER#$."+conditionTwoArr[conditionTwoArr.length - 1]+"#))";
    }
    else if (condition.method === "greater_than") {
      conditionString = "(ATTESTOR#$."+conditionOneArr[conditionOneArr.length - 1]+">REQUESTER#$."+conditionTwoArr[conditionTwoArr.length - 1]+"#)"
    }
    else if (condition.method === "less_than") {
      conditionString = "(ATTESTOR#$."+conditionOneArr[conditionOneArr.length - 1]+"<REQUESTER#$."+conditionTwoArr[conditionTwoArr.length - 1]+"#)"
    }
    else if (condition.method === "greater_than_equal_to") {
      conditionString = "(ATTESTOR#$."+conditionOneArr[conditionOneArr.length - 1]+">=REQUESTER#$."+conditionTwoArr[conditionTwoArr.length - 1]+"#)"
    }
    else if (condition.method === "less_than_equal_to") {
      conditionString = "(ATTESTOR#$."+conditionOneArr[conditionOneArr.length - 1]+"<=REQUESTER#$."+conditionTwoArr[conditionTwoArr.length - 1]+"#)"
    }
    else if (condition.method === "contains") {
      conditionString = "(ATTESTOR#$."+conditionOneArr[conditionOneArr.length - 1]+"#.contains(REQUESTER#$."+conditionTwoArr[conditionTwoArr.length - 1]+"#))";
    }
    else if (condition.method === "not_contains") {
      conditionString = "(!ATTESTOR#$."+conditionOneArr[conditionOneArr.length - 1]+"#.contains(REQUESTER#$."+conditionTwoArr[conditionTwoArr.length - 1]+"#))";
    }
    return conditionString;
  }

  submitConfigWorkflowForm() {
    let submittedWorkflowData = this.workflowForm.value.workflowItems;
    let attestationPolicies = [];

    if(submittedWorkflowData.length === 0){
      return;
    }
    console.log("submittedWorkflowData", submittedWorkflowData)
    for(let i = 0; i < submittedWorkflowData.length; i++) { // loop through each workflow in the array of workflows

      // validation for empty workflow name and attestation type
      if(submittedWorkflowData[i].workflowname === "" || submittedWorkflowData[i].attestation_type === ""){
        console.log("empty workflow name or attestation type");
        continue;
      }

      let setAttestationProperties = {}
      let setAdditionalInput = submittedWorkflowData[i].additionalInput; // additional Input field of the workflow
      let additionalInputKeys = Object.keys(setAdditionalInput); 
      
      // Loop to change the attestationProperties to the desired format according to the schema
      for(let j=0; j<submittedWorkflowData[i].attestationProperties?.length; j++){ 
        if(!additionalInputKeys.includes(submittedWorkflowData[i].attestationProperties[j])){

          let entityProperty = submittedWorkflowData[i].attestationProperties[j];
          let keys = entityProperty.split(".");
          entityProperty = entityProperty.replace(keys[0], "$");
          setAttestationProperties = {
            ...setAttestationProperties,
            [keys[keys.length - 1]]: entityProperty
          }
        }
      }

      // Forming the conditions string using attestatorConditions
      let attestorConditions = submittedWorkflowData[i].attestorConditions;
      let attestorConditionsString = "";
      for(let j=0; j<attestorConditions.length; j++){
        let fieldConditions = attestorConditions[j].fieldConditions;

        for(let k=0; k<fieldConditions.length; k++){
          let fieldConditionString = this.fromConditionToString(fieldConditions[k]);
          if(attestorConditionsString === ""){
            attestorConditionsString = fieldConditionString;
          } else {
            attestorConditions[j].anyOrAllCondition === "any" ? attestorConditionsString += " || " + fieldConditionString : attestorConditionsString += " && " + fieldConditionString;
          }
        }
      }
      if(attestorConditions.length > 1)
        attestorConditionsString = "(" + attestorConditionsString + ")";

      // Validation for empty attestorConditions
      if(attestorConditionsString === "" || Object.keys(setAttestationProperties).length === 0){
        console.log("empty attestorConditions or attestationProperties");
        continue;
      }

      let attestationPolicyItem = {
        "name": submittedWorkflowData[i].workflowname,
        "type": submittedWorkflowData[i].attestation_type,
        "attestationProperties": setAttestationProperties,
        "conditions": attestorConditionsString,
        "attestorPlugin": `did:internal:ClaimPluginActor?entity=${attestorConditions[0]?.selectEntity}`  // Currently only support for internal
      }

      if(Object.keys(setAdditionalInput).length > 0){
        attestationPolicyItem["additionalInput"] = setAdditionalInput;
      }

      attestationPolicies.push(attestationPolicyItem);
    }
    console.log("attestationPolicies", attestationPolicies);
    let payload = {};
    let osidOfSchema = "";
    for(let i = 0; i < this.fullSchemas?.length; i++){
      if(this.fullSchemas[i].name === this.entityName){
        if (this.schemaName[i]["_osConfig"]) {
          this.schemaName[i]["_osConfig"].attestationPolicies = attestationPolicies;
        } else {
          this.schemaName[i] = {
            ...this.schemaName[i],
            _osConfig: {
              "attestationPolicies": attestationPolicies
            }
          }
        }
        
        // Updated payload of schema to be sent to backend
        payload = {
          "name": this.fullSchemas[i].name,
          "description": this.fullSchemas[i].description,
          "schema": JSON.stringify(this.schemaName[i]),
          "referedSchema": this.fullSchemas[i].referedSchema,
          "status": this.fullSchemas[i].status
        }
        osidOfSchema = this.fullSchemas[i].osid;
      }
    }

    this.generalService.putData('/Schema', osidOfSchema, payload).subscribe((res) => {
      console.log(res)
    }, (err) => {
      console.log(err)
    })
  }
}

