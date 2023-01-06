import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class SchemaBodyService {

  constructor() {
  }

  newSchemaTemplate(key, data) {

    let entityTemplate = {
      "$schema": "http://json-schema.org/draft-07/schema",
      "type": "object",
      "status": "DRAFT",
      "properties": {
        [key]: {
          "$ref": "#/definitions/" + key
        }
      },
      "required": [
        key
      ],
      "title": key,
      "description": data.description,
      "definitions": {
        [key]: {
          "$id": "#/properties/" + key,
          "type": "object",
          "title": data.title,
          "description": data.description,
          "required": [],
          "properties": {}
        }
      },
      "_osConfig": this.getRawCredentials(key)
    }


    return entityTemplate;
  }

  getRawCredentials(key) {
    let rawCredentials = {
      "uniqueIndexFields": [],
      "ownershipAttributes": [],
      "privateFields": [],
      "internalFields": [],
      "roles": [],
      "inviteRoles": ["anonymous"],
      "enableLogin": false,
      "credentialTemplate": {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          {
            "@context": {
              "@version": 1.1,
              "@protected": true,
              key: {
                "@id": "https://github.com/sunbird-specs/vc-specs#" + key,
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
        },
        "issuer": "did:web:sunbirdrc.dev/vc/skill"
      },
      "certificateTemplates": {}
    }

    return rawCredentials;
  }

  commonSchemaBody() {
    let commonBody = {
      "$schema": "http://json-schema.org/draft-07/schema",
      "title": "Common",
      "isRefSchema": true,
      "type": 'object',
      "definitions": {}
    }

    return commonBody;
  }
}
