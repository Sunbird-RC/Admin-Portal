import { Component, Input, OnInit } from '@angular/core';
import { editorConfig } from './form-editor-config';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'add-field-form',
  templateUrl: './add-field-form.component.html',
  styleUrls: ['./add-field-form.component.scss']
})
export class AddFieldFormComponent implements OnInit {
  public myForm: Object = { components: [] };
  public options = editorConfig;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() backEvent = new EventEmitter<any>();


  @Input() jsonSchema;


  entityFieldList: any = [
    {
      "type": "string",
      "title": "Plot",
      "required": true
    },
    {
      "type": "string",
      "title": "Street"
    }
  ]

  entityFields: any;
  propertyArr: any;
  jsonFields: any;
  jsonTitle: any;

  constructor() { }

  ngOnInit(): void {
    // this.formioJsonBuild(this.jsonSchema);
  }

  onSubmit(event) { }

  formioJsonBuild(jsonFields) {


    this.jsonFields = jsonFields;
    this.jsonTitle = jsonFields['title'];
    let jsonSchema = jsonFields.definitions[this.jsonTitle].properties;

    this.propertyArr = [];
    let _self = this;
    Object.keys(jsonSchema).forEach(function (key) {
      let resultJson;
      _self.propertyArr.push(key);

      if (jsonSchema[key].type == 'array') {
        resultJson = _self.nastedJsonSep(jsonSchema, key, jsonFields.definitions[_self.jsonTitle]);
      } else if (jsonSchema[key].type == 'object') {
        resultJson = _self.objectJsonSchema(jsonSchema, key, jsonFields.definitions[_self.jsonTitle]);
      } else {
        resultJson = _self.plainJson(jsonSchema, key, jsonFields.definitions[_self.jsonTitle]);
      }

      _self.myForm['components'].push(resultJson);

    });

    for (let j = 0; j < jsonFields.definitions[this.jsonTitle].required.length; j++) {
      this.options.disabled.push(jsonFields.definitions[this.jsonTitle].required[j]);
    }

  }

  nastedJsonSep(jsonSchema, key, definationName) {
    if (jsonSchema[key].type == 'array') {
      if (jsonSchema[key].items.hasOwnProperty('properties')) {
        let containerJson = { components: [] };
        containerJson['label'] = key.charAt(0).toUpperCase() + key.slice(1);
        containerJson['input'] = true;
        containerJson['type'] = 'container';
        containerJson['key'] = key;

        let subProField = jsonSchema[key].items.properties;

        let _self = this;
        Object.keys(subProField).forEach(function (key1) {
          _self.propertyArr.push(key1);

          let tempField;

          if (subProField[key1].type == 'array') {
            tempField = _self.nastedJsonSep(subProField, key1, jsonSchema[key]);
          } else if (subProField[key1].type == 'object') {
            let tempField = _self.objectJsonSchema(subProField, key1, jsonSchema[key]);
          } else {
            tempField = _self.plainJson(subProField, key1, jsonSchema[key]);
          }
          containerJson['components'].push(tempField);
        });

        return containerJson;
      }
    }
  }

  objectJsonSchema(jsonSchema, key, definationName) {

    if (jsonSchema[key].type == 'object') {
      if (jsonSchema[key].hasOwnProperty('properties')) {
        let containerJson = { components: [] };
        containerJson['label'] = (jsonSchema[key].hasOwnProperty('properties')) ? jsonSchema[key].title : key.charAt(0).toUpperCase() + key.slice(1);
        containerJson['input'] = true;
        containerJson['type'] = 'container';
        containerJson['key'] = key;
        containerJson['required'] = jsonSchema[key].required;

        for (let j = 0; j < jsonSchema[key].required.length; j++) {
          this.options.disabled.push(jsonSchema[key].required[j]);
        }

        let subProField = jsonSchema[key].properties;

        let _self = this;
        Object.keys(subProField).forEach(function (key1) {
          _self.propertyArr.push(key1);

          let tempField;

          if (subProField[key1].type == 'array') {
            tempField = _self.nastedJsonSep(subProField, key1, jsonSchema[key]);
          } else if (subProField[key1].type == 'object') {
            let tempField = _self.objectJsonSchema(subProField, key1, jsonSchema[key]);
          } else {
            tempField = _self.plainJson(subProField, key1, jsonSchema[key]);
          }

          containerJson['components'].push(tempField);
          // console.log({ containerJson });
        });

        return containerJson;
      }
    }
  }

  plainJson(jsonSchema, key, definationName) {

    var tempField = {};
    tempField['key'] = key;
    tempField['input'] = true;

    if (jsonSchema[key].hasOwnProperty('type')) {
      if (jsonSchema[key].type == 'string') {
        tempField['type'] = 'textfield';
        tempField['inputType'] = 'text';
      } else if (jsonSchema[key].type == 'number') {
        tempField['type'] = 'number';
      }

    }

    if (jsonSchema[key].hasOwnProperty('title')) {
      tempField['label'] = jsonSchema[key].title;
    } else {
      tempField['label'] = key.charAt(0).toUpperCase() + key.slice(1);
    }


    if (definationName.hasOwnProperty('required') && definationName.required.includes(key)) {
      tempField['validate'] = {
        "required": true
      };
    }

    if (jsonSchema[key].hasOwnProperty('format') && jsonSchema[key].format == 'date') {
      tempField['type'] = 'datetime';
      tempField['enableDate'] = true;
      tempField['enableTime'] = false;
    }

    return tempField;
  }

  onChange(event) {

    console.log({ event });

    if (event.type == 'saveComponent' || event.type == "addComponent" || event.type == 'deleteComponent') {
      this.entityFields = this.formioJsonToPlainJSONSchema(event, event.form.components);
      let _self = this;
      Object.keys(this.entityFields).forEach(function (key) {
        console.log({ key });
        _self.entityFieldList.push({
          'key': key,
          'title': _self.entityFields[key].title,
          'type': _self.entityFields[key].type,
          'required': _self.entityFields[key].required,

        })
      })

      console.log(this.entityFieldList);
    }
  }

  viewField() {
    //alert('view');
  }

  formioJsonToPlainJSONSchema(event, components) {
    let tempFjson = {};

    components.forEach(element => {

      if ((event.type == "addComponent" || event.type == 'saveComponent')) {
        let temp = element.label.replaceAll(/\s/g, '');

        element.key = temp.charAt(0).toLowerCase() + temp.slice(1);
        if (element.type == 'container') {
          // jsonDefination.properties[element.key] = { 'type': 'object' };
        }
      }

      tempFjson[element.key] = this.signleFieldData(element);
      if (element.hasOwnProperty('validate') && element.validate.required == true) {
        tempFjson[element.key]['required'] = true;
        // this.jsonFields.definitions[this.jsonTitle].required.push(element.key);
      }

      if (element.type == 'container') {

        let containerType = '' //type;
        if (containerType == 'object') {
          tempFjson[element.key] = this.objectTypeFieldData(event, element);
        } else {
          tempFjson[element.key] = this.arrayTypeFieldData(element);
        }

      } if (element.type == 'select') {
        tempFjson[element.key] = {
          "type": "string",
          "title": element.label,
          "widget": {
            "formlyConfig": {
              "type": "enum",
              "templateOptions": {
                "options": element['data']['values']
              }
            }
          }
        }
        console.log({ tempFjson });
      }
      if (element.type == 'checkbox') {
        tempFjson[element.key] = {
          "type": "boolean",
          "title": element.label,
          "default": false
        }
      } if (element.type == 'selectboxes') {
        tempFjson[element.key] = {
          type: 'select',
          templateOptions: {
            label: element.label,
            multiple: true,
            options: element['values']
          }
          //   tempFjson[element.key] = {
          //     "type": "array",
          //   "title": element.label,
          //   "uniqueItems": true,
          //   "items": {
          //     "type": "string",
          //     "enum": element['values']
          //   }
          // }
        }
      } if (element.type == 'radio') {
        /*  tempFjson[element.key] = {
            "type": "radio",
            "title": element.label,
            "templateOptions": {
              "options": element['values']
            }
          }*/

        tempFjson[element.key] = {
          "enum": element['values'],
          "title": element.label,
          "widget": {
            "formlyConfig": {
              "type": "radio"
            }
          }
        }
      }
    });
    console.log({ tempFjson });
    return tempFjson;
  }

  objectTypeFieldData(event, jsonObj) {

    let fieldContainer = {
      "type": "object",
      "properties": {},
      "required": [],
    }

    fieldContainer['label'] = jsonObj.label;
    fieldContainer['input'] = true;

    if (jsonObj.hasOwnProperty('components') && jsonObj.components.length) {
      jsonObj.components.forEach(element => {

        if ((event.type == "addComponent" || event.type == 'saveComponent')) {
          let temp = element.label.replaceAll(/\s/g, '');

          element.key = temp.charAt(0).toLowerCase() + temp.slice(1);

        }

        if (element.type == 'container') {

          let containerType = jsonObj.components[element.key].type;
          if (containerType == 'object') {
            fieldContainer.properties[element.key] = this.objectTypeFieldData(event, element);
          } else {
            fieldContainer.properties[element.key] = this.arrayTypeFieldData(element);
          }


        } else {
          fieldContainer.properties[element.key] = this.signleFieldData(element);
          if (element.hasOwnProperty('validate') && element.validate.required == true) {
            fieldContainer['required'].push(element.key);
          }
        }
      });
    }

    return fieldContainer;
  }

  arrayTypeFieldData(arrayJson) {

    let fieldContainer = {
      "type": "array",
      "title": arrayJson.label,
      "items": {
        "type": "object",
        "properties": {},
        "required": [],
      }
    }

    if (arrayJson.hasOwnProperty('components') && arrayJson.components.length) {
      arrayJson.components.forEach(element => {
        if (element.type == 'container') {

          let containerType = arrayJson.components[element.key].type;
          if (containerType == 'object') {
            fieldContainer.items.properties[element.key] = this.objectTypeFieldData(event, element);
          } else {
            fieldContainer.items.properties[element.key] = this.arrayTypeFieldData(element);
          }


        } else {
          fieldContainer.items.properties[element.key] = this.signleFieldData(element);
          if (element.hasOwnProperty('validate') && element.validate.required == true) {
            fieldContainer.items['required'].push(element.key);
          }
        }
      });
    }

    return fieldContainer;
  }

  signleFieldData(fieldObj) {
    let tempFjson = {};

    let fType = (fieldObj.type == 'number') ? 'number' : 'string';
    tempFjson[fieldObj.key] = {
      'type': fType
    };

    if (fieldObj.label) {
      tempFjson[fieldObj.key]['title'] = fieldObj.label
    }

    if (fieldObj.hasOwnProperty('placeholder')) {
      tempFjson[fieldObj.key]['placeholder'] = fieldObj.placeholder
    }

    if (fieldObj.hasOwnProperty('description')) {
      tempFjson[fieldObj.key]['description'] = fieldObj.description
    }


    if (fieldObj.type == 'datetime') {
      tempFjson[fieldObj.key]['format'] = 'date'
    }

    return tempFjson[fieldObj.key];

  }

  saveAdvance(data) {
    this.newItemEvent.emit(data);
  }

  cancel() {
    this.backEvent.emit();

  }


}
