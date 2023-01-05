import { Component, OnInit } from "@angular/core";
import { Console, timeStamp } from "console";
import { GeneralService } from "src/app/services/general/general.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"],
})
export class PublishComponent implements OnInit {
  isShow = false;
  schemaOsid: any;
  publishData: any = [];
  count: number;
  constructor(private generalService: GeneralService, 
    public translate: TranslateService) { }

  ngOnInit(): void {
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
}
