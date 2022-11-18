import { Component, OnInit } from "@angular/core";
import { GeneralService } from "src/app/services/general/general.service";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"],
})
export class PublishComponent implements OnInit {
  isShow = false;
  schemaOsid: any;
  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {}
  ngAfterViewInit() {}
  async changeVal() {
    this.isShow = !this.isShow;

    this.generalService.getData("/Schema").subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        this.changeStatus(res[i]);
      }
    });
  }

  async changeStatus(res) {
    await this.generalService
      .getData("/Schema/" + res.osid)
      .subscribe((data) => {
        data["status"] = "PUBLISHED";
        this.generalService
          .putData("/Schema", data.osid, data)
          .subscribe((data1) => {
            console.log(data1);
          });
      });
  }
}
