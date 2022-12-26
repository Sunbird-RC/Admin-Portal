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
  name = 'Angular';
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
          workflowname: 'Transfer Certificate',
          issuancesystem: '',
          attestation_type: 'auto_attestation',
          attestorConditions: [
            {
              selectEntity: '', anyOrAllCondition: '', fieldConditions: [{
                selectConditionOne: '',
                equalTo: 'equalTo',
                selectConditionTwo: ''
              }]
            }
          ]
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

    this.patchValueData();


    this.entityName = this.activeRoute.snapshot.params.entity;

    let selectedMenuList: any;
    this.generalService.getData("/Schema").subscribe((res) => {
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
      workflowname: 'Transfer Certificate',
      issuancesystem: '',
      attestation_type: 'auto_attestation',
      attestorConditions: this.fb.array([])
    })
  }

  addWorkflowItems() {
    this.workflowItems().push(this.newWorkflowItems());
  }

  removeWorkflowItems(wIndex) {
    this.workflowItems().removeAt(wIndex);
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
  }

  removeAttestCondition(wIndex: number, aIndex: number) {
    this.attestConditions(wIndex).removeAt(aIndex);
  }



  //------------Start - fieldConditions----------------------
  fieldConditions(aIndex, fIndex): FormArray {
    return this.attestConditions(aIndex).at(fIndex).get("fieldConditions") as FormArray
  }

  newFieldCondition(): FormGroup {
    return this.fb.group({
      selectConditionOne: '',
      equalTo: 'equalTo',
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

  checks = false;
  checkAll(x) {
    if (x.target.checked == true) {
      this.checks = true;
    }
    else {
      this.checks = false;
    }
  }

  removefield(i) {
    this.values.splice(i, 1);
  }

  addfield() {
    this.values.push({ value: "", select: "" });

  }

  saveModaldata(){
    
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
}

