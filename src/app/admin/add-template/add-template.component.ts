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

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {

  userHtml;
  userJson;
  form2: FormGroup;
  model = {};
  schemaloaded = false;
  template;

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
  isPreview = false;
  templateName: any;
  issuerOsid: any;
  documentTypeList: any;
  selectedDecType: any;
  description: any;
  schemaJson: Object;
  schemaContent: any;
  certificateContent: any;
  oldTemplateName;
  sampleData: any;
  constructor(public schemaService: SchemaService,
    public toastMsg: ToastMessageService,
    public router: Router,
    private route: ActivatedRoute,
    private formlyJsonschema: FormlyJsonschema,
    public generalService: GeneralService,
    public http: HttpClient) { }

  ngOnInit(): void {

    this.getDocument();

    this.generalService.getData('/Issuer').subscribe((res) => {
      console.log(res);
      this.issuerOsid = res[0].osid;
    });

  }


  dataChange() {
    window.location.reload();
  }

  cancel() {
    this.isPreview = false;
    localStorage.setItem('content', '');
  }

  previewScreen(doc) {
    console.log({ doc });
    this.sampleData = doc;


    fetch(doc.schemaUrl)
      .then(response => response.text())
      .then(data => {
        this.schemaContent = data;
        this.userJson = data;
        // Do something with your data
        console.log(this.userJson);
      });

    fetch(doc.certificateUrl)
      .then(response => response.text())
      .then(data => {
        this.certificateContent = data;
        this.userHtml = data;
        this.injectHTML();
      });

    //  this.isPreview = true;
    //  localStorage.setItem('isPreview', 'yes');
  }

  editTemplate() {
    localStorage.setItem('sampleData', JSON.stringify(this.sampleData));
   this.router.navigate(['/edit-template'], { state: { item: this.sampleData } });
  }


  getDocument() {
    let payout = {
      "filters": {}
    }

     this.documentTypeList = [{"osUpdatedAt":"2022-05-24T10:24:21.515Z","osCreatedAt":"2022-05-24T10:24:21.515Z","osUpdatedBy":"anonymous","name":"Proof of skill","osCreatedBy":"anonymous","samples":[{"osUpdatedAt":"2022-05-24T10:24:21.515Z","osCreatedAt":"2022-05-24T10:24:21.515Z","osUpdatedBy":"anonymous","osCreatedBy":"anonymous","certificateUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/SkillCertificate.html","osid":"1-cf863d16-c827-446b-93bf-8ce98cb92ece","schemaUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/SkillCertificate.json"}],"osid":"1-69ff3505-99b5-4271-9996-7c0e31624bb9","osOwner":["anonymous"]},{"osUpdatedAt":"2022-05-24T10:06:42.920Z","osCreatedAt":"2022-05-24T10:06:42.920Z","osUpdatedBy":"anonymous","name":"Proof of Work","osCreatedBy":"anonymous","samples":[{"osUpdatedAt":"2022-05-24T10:06:42.920Z","osCreatedAt":"2022-05-24T10:06:42.920Z","osUpdatedBy":"anonymous","osCreatedBy":"anonymous","certificateUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/TrainingCertificate.html","osid":"1-93537196-1a5f-4fd2-bbc9-8934b451b2e6","schemaUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/TrainingCertificate.json","thumbnailUrl":"https://i.ibb.co/7n2pjt6/A4-Template-5.png"}],"osid":"1-0f708c3f-1430-47ea-a107-55bb22c7a225","osOwner":["anonymous"]}];
      this.selectedDecType = [{"osUpdatedAt":"2022-05-24T10:24:21.515Z","osCreatedAt":"2022-05-24T10:24:21.515Z","osUpdatedBy":"anonymous","name":"Proof of skill","osCreatedBy":"anonymous","samples":[{"osUpdatedAt":"2022-05-24T10:24:21.515Z","osCreatedAt":"2022-05-24T10:24:21.515Z","osUpdatedBy":"anonymous","osCreatedBy":"anonymous","certificateUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/SkillCertificate.html","osid":"1-cf863d16-c827-446b-93bf-8ce98cb92ece","schemaUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/SkillCertificate.json"}],"osid":"1-69ff3505-99b5-4271-9996-7c0e31624bb9","osOwner":["anonymous"]},{"osUpdatedAt":"2022-05-24T10:06:42.920Z","osCreatedAt":"2022-05-24T10:06:42.920Z","osUpdatedBy":"anonymous","name":"Proof of Work","osCreatedBy":"anonymous","samples":[{"osUpdatedAt":"2022-05-24T10:06:42.920Z","osCreatedAt":"2022-05-24T10:06:42.920Z","osUpdatedBy":"anonymous","osCreatedBy":"anonymous","certificateUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/TrainingCertificate.html","osid":"1-93537196-1a5f-4fd2-bbc9-8934b451b2e6","schemaUrl":"https://raw.githubusercontent.com/Sunbird-RC/demo-certificate-issuance/main/samples/TrainingCertificate.json","thumbnailUrl":"https://i.ibb.co/7n2pjt6/A4-Template-5.png"}],"osid":"1-0f708c3f-1430-47ea-a107-55bb22c7a225","osOwner":["anonymous"]}];
   
  }

  onChange(index) {
    console.log(index);
    this.selectedDecType = [];
    this.selectedDecType = [this.documentTypeList[index]];
  }

  injectHTML() {

    setTimeout(() => {
      const iframe: HTMLIFrameElement = document.getElementById('iframe1') as HTMLIFrameElement;
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


}
