import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GeneralService } from "src/app/services/general/general.service";
import { TranslateService } from '@ngx-translate/core'; 

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
  studentFieldList = [];
  global_properties = [];
  global_tempName = "";

  global_properties_student = [];
  global_tempName_student = "";

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    public generalService: GeneralService
  ) {
  }

  ngOnInit(): void {

    this.entityName = this.activeRoute.snapshot.params.entity;

    let selectedMenuList: any;
    this.generalService.getData("/Schema").subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        this.schemaName.push(JSON.parse(res[i]["schema"]));

        if(!this.schemaName[i].hasOwnProperty('isRefSchema') && !this.schemaName[i]['isRefSchema'])
        {
          this.entityList.push(this.schemaName[i]["title"]);
        }
      
        this.fieldList.push(this.schemaName[i]["definitions"]);
        selectedMenuList = this.fieldList.find((e) => e[this.entityName]);
      }

      this.onChangeSelect(this.entityName);
    });
  }

  
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
    this.studentFieldList = [];
    const attest = this.fieldList.find((e) => e[item]);
    arr = this.getPropertiesStudent(attest?.[item], attest);

    this.studentFieldList.push(arr);
  }

  getPropertiesStudent(item: any, main_item: any) {
    this.getPropertiesNameStudent(item, "", Object.keys(main_item), 0);
    return this.global_properties_student;
  }

  getPropertiesNameStudent(
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
          this.getPropertiesNameStudent(
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
}
