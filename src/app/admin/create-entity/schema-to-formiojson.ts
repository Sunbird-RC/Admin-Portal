import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class FormioJsonService {

  constructor() {
  }


  convertSchemaToFormioJson(viewSchemaField) {
    let newArr: any = [];
    viewSchemaField = (viewSchemaField.length) ? viewSchemaField : (viewSchemaField.hasOwnProperty('propertyKey') ? viewSchemaField.data : viewSchemaField)
    for (let i = 0; i < viewSchemaField.length; i++) {
      if (viewSchemaField[i].type != 'object' && viewSchemaField[i].type != 'array') {
        let compJson = {
          "label": viewSchemaField[i].data.title,
          "tableView": true,
          "validate": {
            "required": viewSchemaField[i].required
          },
          "$id": "#/properties/" + viewSchemaField[i].key,
          "type": (viewSchemaField[i].type == 'string') ? "textfield" : viewSchemaField[i].type,
          "input": true
        }

        if (viewSchemaField[i].data.hasOwnProperty('enum') && viewSchemaField[i].data.enum) {
          compJson["data"] = {
            values: []
          };
          for (let k = 0; k < viewSchemaField[i].data.enum.length; k++) {
            compJson["data"]['values'].push({
              "label": viewSchemaField[i].data.enum[k],
              "value": viewSchemaField[i].data.enum[k]
            })
          }

          compJson['type'] = 'select';

        }


        compJson['key'] = (viewSchemaField[i].key == 'textfield') ? (viewSchemaField[i].key + i) : viewSchemaField[i].key;


        if (viewSchemaField[i].data.description) {
          compJson['description'] = viewSchemaField[i].data.description;
        }

        if (viewSchemaField[i].data.placeholder) {
          compJson['placeholder'] = viewSchemaField[i].data.placeholder;
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

        if (fieldData.description) {
          compJson['description'] = fieldData.description;
        }

        if (fieldData.placeholder) {
          compJson['placeholder'] = fieldData.placeholder;
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

            if (fieldData.data[i].data.hasOwnProperty('enum') && fieldData.data[i].data.enum) {
              compJsonS["data"] = {
                values: []
              };
              for (let k = 0; k < fieldData.data[i].data.enum.length; k++) {
                compJsonS["data"]['values'].push({
                  "label": fieldData.data[i].data.enum[k],
                  "value": fieldData.data[i].data.enum[k]
                })
              }

              compJsonS['type'] = 'select';
            }

            if (fieldData.data[i].data.description) {
              compJsonS['description'] = fieldData.data[i].data.description;
            }

            if (fieldData.data[i].data.placeholder) {
              compJsonS['placeholder'] = fieldData.data[i].data.placeholder;
            }

            compJson.components.push(compJsonS);
          }else{
            let compJsonS = {
              "label": fieldData.data[i].propertyName,
              "tableView": false,
              "key": fieldData.data[i].propertyKey,
              "type": "container",
              "input": true,
              "components": []
            }

            compJsonS.components = this.convertSchemaToFormioJson(fieldData.data[i]);

            compJson.components.push(compJsonS);
          }
        }

        newArr.push(compJson);

      }

    }

    return newArr;

  }


}
