import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { GeneralService } from 'src/app/services/general/general.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { SchemaService } from '../../services/data/schema.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Console } from 'console';
import { ElementRef, ViewChild } from '@angular/core';
import { Formio } from 'formiojs';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'test-and-verify',
  templateUrl: './test-and-verify.component.html',
  styleUrls: ['./test-and-verify.component.scss']
})
export class TestAndVerifyComponent implements OnInit {
  linkImage: string ="assets/images/thumbnail.png";
  vaccinationStatus : Array<String>;
  formdata : any;
  data:any;
  issuerName: String;
  beneficiaryName : String;
  vaccDate : Date;
  vaccStatus : String;
  documentTypeList: any;
  selectedDecType: any;
  description: any;
  schemaJson: Object;
  schemaContent: any;
  certificateContent: any;
  oldTemplateName;
  userHtml;
  userJson;
  sampleData: any;
  myJSON;
  isPreview = false;
  template;
  //@Input() jsonSchema;
  @ViewChild('json') jsonElement?: ElementRef;
  public editorOptions: JsonEditorOptions;
  public vcEditorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent) jsonEditor: JsonEditorComponent;
  @ViewChild(JsonEditorComponent) vcEditor: JsonEditorComponent;

  @Output() newItemEvent = new EventEmitter<any>();

  public myForm: Object = { components: [] };
  //public options = editorConfig;
  eventForm: any;
  jsonFields: any;
  vcFields: any;
  jsonTitle: any;
  propertyArr: any;
  vcFieldsText: any;
  isShowLessJson = false;
  isShowLessVc = false;
  isVcString = false;
  orders = ["", "Proof of work",
    "Proof of skill",
    "Proof of Education"]
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  schema: JSONSchema7 = {
    "type": "object",
    "title": "",
    "definitions": {},
    "properties": {},
    "required": []
  };
  form: string;
  formSchema: any;
  responseData: any;
  definations: any;
  property: any;
  htmlFile = "/assets/template/first.html";
  templatePath: any;
  data2;
  templateName: any;
  objectKeys = Object.keys;
 
  params: any;
  entityName: any;
  usecase: any;
 

  constructor(public router: Router, public route: ActivatedRoute, public translate: TranslateService) { 
    this.vaccinationStatus = [ "Fully vaccinated", "Partially Vaccinated", "Not Vaccinated" ]
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();

    this.vcEditorOptions = new JsonEditorOptions();
    this.vcEditorOptions.mode = 'text';
    this.vcEditorOptions.history = true;
    this.vcEditorOptions.onChange = () => this.vcEditor.get();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.params = params;
      console.log({params});

      if (this.params.hasOwnProperty('entity')) {
        this.entityName = params.entity;
        this.usecase = params.usecase.toLowerCase();

      }
  });
    this.getDocument();
    
  }
  
  
  getValues(){
    console.log(this.vaccStatus);
     this.data2 = {issuerName:this.issuerName, beneficiaryName:this.beneficiaryName, vaccDate:this.vaccDate, vaccinationStatus:this.vaccStatus};
    console.log(this.data2);
    this.myJSON = JSON.stringify(this.data2);
   
  }

  getDocument()
  {
    this.documentTypeList = [{"osUpdatedAt":"2022-05-24T10:24:21.515Z","osCreatedAt":"2022-05-24T10:24:21.515Z","osUpdatedBy":"anonymous","name":"Proof of skill","osCreatedBy":"anonymous","samples":[{"osUpdatedAt":"2022-05-24T10:24:21.515Z","osCreatedAt":"2022-05-24T10:24:21.515Z","osUpdatedBy":"anonymous","osCreatedBy":"anonymous","certificateUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/SkillCertificate.html","osid":"1-cf863d16-c827-446b-93bf-8ce98cb92ece","schemaUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/SkillCertificate.json"}],"osid":"1-69ff3505-99b5-4271-9996-7c0e31624bb9","osOwner":["anonymous"]},{"osUpdatedAt":"2022-05-24T10:06:42.920Z","osCreatedAt":"2022-05-24T10:06:42.920Z","osUpdatedBy":"anonymous","name":"Proof of Work","osCreatedBy":"anonymous","samples":[{"osUpdatedAt":"2022-05-24T10:06:42.920Z","osCreatedAt":"2022-05-24T10:06:42.920Z","osUpdatedBy":"anonymous","osCreatedBy":"anonymous","certificateUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/TrainingCertificate.html","osid":"1-93537196-1a5f-4fd2-bbc9-8934b451b2e6","schemaUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/TrainingCertificate.json","thumbnailUrl":"https://i.ibb.co/7n2pjt6/A4-Template-5.png"}],"osid":"1-0f708c3f-1430-47ea-a107-55bb22c7a225","osOwner":["anonymous"]}];
    this.selectedDecType = [this.documentTypeList[1]];
  }

  previewScreen(doc) {
    console.log({ doc });
    this.sampleData = doc;


    fetch(doc[0].samples[0].schemaUrl)
      .then(response => response.text())
      .then(data => {
        this.schemaContent = data;
        this.userJson = data;
        let jsonObject = JSON.parse(data);
        console.log(jsonObject);
        // Do something with your data
        console.log(this.userJson);
      });

    fetch(doc[0].samples[0].certificateUrl)
      .then(response => response.text())
      .then(data => {
        this.certificateContent = data;
      //  this.userHtml = data;
        this.userHtml = `<html lang="en">
  <head>
    <style>
      .line {
        text-align: center;
        font-family: 'Imperial Script';
        font-size: 2em;
      }
    </style>
  </head>
  <body style="width: 900px">
    <div style="margin: 1em;border: 3px solid darkgoldenrod;border-radius: 5px;background-color: bisque;height: 600px">
      <div style="padding:1em;text-align:center;font-family: Canterbury;font-size: 4em;">Vaccination Certificate</div>
      <table width="100%">
        <tr>
          <td valign="bottom">
            <img style="float:left;padding-left: 2em;" src="{{qrCode}}" alt="qr_code" />
          </td>
          <td>
            <div class="line">
              <div>This is to certify that</div>
              <div>
                <b>${this.data2.issuerName}</b>
              </div>
              <div>has been vaccinated </div>
              <div style="padding: 1em;font-family: 'Open Sans', sans-serif">
              <i>${this.data2.vaccinationStatus} </i> under
                  <b>${this.data2.beneficiaryName}</b>
                {{/each}}
              </div>
              <div>and is awarded this certificate on </div>
              <div>${this.data2.vaccDate}</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div></div>
  </body>
</html>`


        this.injectHTML();
      });
//       <html lang="en">
//   <head>
//     <style>
//       .line {
//         text-align: center;
//         font-family: 'Imperial Script';
//         font-size: 2em;
//       }
//     </style>
//   </head>
//   <body style="width: 900px">
//     <div style="margin: 1em;border: 3px solid darkgoldenrod;border-radius: 5px;background-color: bisque;height: 600px">
//       <div style="padding:1em;text-align:center;font-family: Canterbury;font-size: 4em;">Skill Certificate</div>
//       <table width="100%">
//         <tr>
//           <td valign="bottom">
//             <img style="float:left;padding-left: 2em;" src="{{qrCode}}" alt="qr_code" />
//           </td>
//           <td>
//             <div class="line">
//               <div>This is to certify that</div>
//               <div>
//                 <b>{{credentialSubject.name}}</b>
//               </div>
//               <div>has successfully gained skills for</div>
//               <div style="padding: 1em;font-family: 'Open Sans', sans-serif">
//                 {{#each credentialSubject.skills}}
//                   <b>{{this}}</b>
//                 {{/each}}
//               </div>
//               <div>and is awarded this certificate on </div>
//               <div>{{dateFormat proof.created "dddd, MMMM Do YYYY"}}</div>
//             </div>
//           </td>
//         </tr>
//       </table>
//     </div>
//     <div></div>
//   </body>
// </html>


    //  this.isPreview = true;
    //  localStorage.setItem('isPreview', 'yes');
  }

  injectHTML() {

    setTimeout(() => {
      const iframe: HTMLIFrameElement = document.getElementById('responsive-iframe') as HTMLIFrameElement;
      var iframedoc;

      if (iframe.contentDocument) {
        iframedoc = iframe.contentDocument;
      }
      else if (iframe.contentWindow) {
        iframedoc = iframe.contentWindow.document;
      }

      if (iframedoc) {
        // Put the content in the iframe
        iframedoc.open();
        iframedoc.writeln(this.userHtml);
        iframedoc.close();
      } else {
        alert('Cannot inject dynamic contents into iframe.');
      }
    }, 500)
  }

  testAndVerify(){
    this.router.navigate(['/create/2/' + this.usecase + '/' + this.entityName]);
  }



}
