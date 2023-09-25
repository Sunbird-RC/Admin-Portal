import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { AppConfig } from '../app.config';
import { DataService } from './data/data-request.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class V2schemaService {
  baseUrl = this.config.getEnv('baseUrl');
  bffUrl = this.config.getEnv('bffUrl');
  constructor(
    private readonly config: AppConfig,
    private readonly dataService: DataService
  ) { }

  getSchemaTemplate(details) {
    return {
      schema: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1",
          "https://playground.chapi.io/examples/alumni/alumni-v1.json",
          "https://w3id.org/security/suites/ed25519-2020/v1",
        ],
        type: "https://w3c-ccg.github.io/vc-json-schemas/",
        version: details.version || "1.0.0",
        id: "",
        name: details.title,
        author: details.issuer,
        authored: new Date().toISOString(),
        schema: {
          $id: details.title.replace(" ", "-"),
          type: "object",
          $schema: "https://json-schema.org/draft/2019-09/schema",
          required: [],
          properties: {},
          description: details.description || "",
          additionalProperties: true,
        },
        proof: {
          type: "object",
          properties: {
            created: "",
            verificationMethod: "",
            proofPurpose: "",
            proofValue: "",
          },
          required: [],
        },
      },
      tags: details.tag || [],
    };
  }

  getIssuerList(): Observable<any> {
    const payload = {
      url: `${this.bffUrl}/v1/issuerlist`
    }
    return this.dataService.get(payload).pipe(map(res => res.result));
  }

  getSchemaList(): Observable<any> {
    const payload = {
      url: `${this.bffUrl}/v1/credential/schema/list`,
      data: {
        taglist: 'test' //q2ulp test
      }
    }
    return this.dataService.post(payload).pipe(map(res => res.result));
  }

  getSchema(schemaId: string): Observable<any> {
    const payload = {
      url: `${this.bffUrl}/v1/credentials/schema/json/${schemaId}`
    }

    return this.dataService.get(payload).pipe(map(res => res.result));
  }

  getSchemaListDetails(): Observable<any> {
    return this.getSchemaList().pipe(
      switchMap((schemas: any) => {
        if (schemas.length) {
          return forkJoin(
            schemas.map((schema: any) => {
              return this.getSchema(schema.schema_id);
            })
          )
        }
        return of([]);
      })
    );
  }

  getDid(): Observable<any> {
    const payload = {
      url: `${this.bffUrl}/v1/getdid`,
      data: {
        uniquetext: "issuer_credentials_schema",
      }
    }
    return this.dataService.post(payload).pipe(map(res => res.result));
  }

  createSchema(schemaObj: any): Observable<any> {
    const payload = {
      url: `${this.bffUrl}/v1/credential/schema/create`,
      data: schemaObj
    }
    return this.dataService.post(payload).pipe(map(res => res.result));
  }

  updateSchema(schemaObj: any, schemaId: string, version: string): Observable<any> {
    const baseUrl = new URL(this.bffUrl).origin;
    const payload = {
      url: `${baseUrl}/credential-schema/${schemaId}/${version}`,
      data: schemaObj
    }
    return this.dataService.put(payload);
  }

  deleteSchema(schemaId: string, version: string): Observable<any> {
    const baseUrl = new URL(this.bffUrl).origin;
    const payload = {
      url: `${baseUrl}/credential-schema/revoke/${schemaId}/${version}`,
    }
    return this.dataService.put(payload);
  }

  convertSchemaToFormioJson(schema) {
    let newArr: any = [];
    const properties = schema.properties;
    let keyIndex = 1;
    for (let key in properties) {

      let compJson = {
        label: schema?.label ? schema.label : key,
        tableView: true,
        key,
        type: (properties[key].type == 'string') ? "textfield" : properties[key].type,
        validate: {
          required: schema.required.includes(key)
        },
        input: true,
      }


      if (properties[key].description) {
        compJson['description'] = properties[key].description;
      }

      if (properties[key].placeholder) {
        compJson['placeholder'] = properties[key].placeholder;
      }


      if (properties[key]?.enum?.length) {
        compJson["data"] = {
          values: []
        };
        for (let k = 0; k < properties[key].enum.length; k++) {
          compJson["data"]['values'].push({
            "label": properties[key].enum[k],
            "value": properties[key].enum[k]
          })
        }
        compJson['type'] = 'select';
      }

      newArr.push(compJson);
    }
    return newArr;
  }

  getTemplatesBySchemaId(schemaId: string) {
    const payload = {
      url: `${this.bffUrl}/v1/credential/schema/template/list`,
      data: {
        schema_id: schemaId
      }
    }
    return this.dataService.post(payload).pipe(map(res => res.result));
  }

  addTemplate(schemaId: string, template: string, type: string = 'handlebar') {
    const payload = {
      url: `${this.bffUrl}/v1/credential/schema/template/create`,
      data: {
        schemaId,
        template,
        type,
        schemaVersion: "1.0.0"
      }
    }

    return this.dataService.post(payload).pipe(map(res => res.result));
  }

  updateTemplate(templateId: string, data: any) {
    const payload = {
      url: `${this.bffUrl}/v1/credential/schema/template/update/${templateId}`,
      data
    }
    return this.dataService.put(payload);
  }

  deleteTemplate(templateId: string) {
    const payload = {
      url: `${this.bffUrl}/v1/credential/schema/template/delete/${templateId}`
    }
    return this.dataService.delete(payload);
  }
}


