import { Component, OnInit } from "@angular/core";
import { Console, timeStamp } from "console";
import { GeneralService } from "src/app/services/general/general.service";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"],
})
export class PublishComponent implements OnInit {
  isShow = false;
  schemaOsid: any;
  publishData: any;
  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.generalService.getData("/Schema").subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        this.publishData = res;
      }
    });


    // this.generalService.getData("/Schema/").subscribe(
    //   (res)=>{
    //     for(let j=0; j<res.length; j++){
    //       this.publishData = res;


    //     }

    //   }
    // )

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
            }
          },
            (err) => {
              console.log(err)
            });
      });
  }
}
