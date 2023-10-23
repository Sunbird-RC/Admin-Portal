import { Component, OnInit, ViewChild } from "@angular/core";
import { Console, timeStamp } from "console";
import { GeneralService } from "src/app/services/general/general.service";
import { TranslateService } from '@ngx-translate/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"],
})
export class PublishComponent implements OnInit {
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent) jsonEditor: JsonEditorComponent;

  isShow = false;
  schemaOsid: any;
  publishData: any = [];
  count: number;
  isShowJson: boolean = false;
  properties: any;
  jsonToCopy: string = '';
  constructor(private generalService: GeneralService, 
              public translate: TranslateService, 
              private clipboard: Clipboard, 
              public toastMsg: ToastMessageService) { }

  ngOnInit(): void {

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();

    this.generalService.getData("/Schema").subscribe((res) => {
      this.count = 0;
      for (let i = 0; i < res.length; i++) {
        if (res[i]["status"] == 'PUBLISHED') {
          this.count++;
        }
        res[i].schema = JSON.parse(res[i].schema);
        
        if (!res[i].schema.hasOwnProperty('isRefSchema') && !res[i].schema.isRefSchema) {
          this.publishData.push(res[i]);
        }
      }
    });

  }
  ngAfterViewInit() { }
  async changeVal() {
    this.isShow = !this.isShow;
  }

  changeStatus(osid, i) {
    this.generalService
      .getData("/Schema/" + osid)
      .subscribe((data) => {
        data["status"] = "PUBLISHED";
        this.generalService
          .putData("/Schema", data.osid, data)
          .subscribe((res) => {
            console.log(res);
            if (res["params"]["status"] = "SUCCESSFUL") {
              this.publishData[i]["status"] = 'PUBLISHED';
              this.count++
            }
          },
            (err) => {
              console.log(err)
            });
      });
  }

  showJson(i) {
    this.isShowJson = !this.isShowJson;
    this.properties = this.removeSpacesFromKeys(this.publishData[i]['schema']);
  }

  removeSpacesFromKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj; 
    }  
    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeSpacesFromKeys(item));
    }
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = key.replace(/\s/g, ''); 
        result[newKey] = this.removeSpacesFromKeys(obj[key]);
      }
    }
    return result;
  }

  showTable() {
    this.isShowJson = !this.isShowJson;
  }

  copyToClipboard() {
    this.jsonToCopy = JSON.stringify(this.properties, null, 2);
    this.clipboard.copy(this.jsonToCopy);
    this.toastMsg.success('success', 'Json Copied!');
  }
}
