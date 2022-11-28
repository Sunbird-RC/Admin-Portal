import { Component, OnInit } from "@angular/core";
import { WithProperties } from "@angular/elements";
import { Route } from "@angular/router";
@Component({
  selector: "get-started",
  templateUrl: "./get-started.component.html",
  styleUrls: ["./get-started.component.scss"],
})
export class GetStartedComponent implements OnInit {
  checkbox1: boolean;
  checkbox2: boolean;
  chooseEntity: string;
  colorBorder: string;
  colorBorder2: string;

  constructor() {}

  ngOnInit(): void {
    localStorage.setItem("schemaParams", "");
    this.checkbox1 = true;
    this.checkbox2 = true;
    this.colorBorder = "border2";
    this.colorBorder2 = "border2";

    if (this.checkbox1 == true && this.checkbox2 == true) {
      this.colorBorder = "border1";
      this.colorBorder2 = "border1";

      this.checkEntity();
    }
  }

  status: boolean = false;

  changeEvent1() {
    this.checkbox1 = !this.checkbox1;
    if (this.checkbox1) {
      this.colorBorder = "border1";
    } else {
      this.colorBorder = "border2";
    }
    this.checkEntity();
  }

  changeEvent2() {
    this.checkbox2 = !this.checkbox2;
    if (this.checkbox2) {
      this.colorBorder2 = "border1";
    } else {
      this.colorBorder2 = "border2";
    }
    this.checkEntity();
  }

  checkthebox(){
    console.log("checked")
  }

  checkEntity() {
    if (this.checkbox1 == true && this.checkbox2 == false) {
      this.chooseEntity = "atstandclaim";
    } else if (this.checkbox1 == false && this.checkbox2 == true) {
      this.chooseEntity = "issuance";
    } else if (this.checkbox1 == false && this.checkbox2 == false) {
      this.chooseEntity = "new";
    } else if (this.checkbox1 == true && this.checkbox2 == true) {
      this.chooseEntity = "newcombination";
    }
  }
}
