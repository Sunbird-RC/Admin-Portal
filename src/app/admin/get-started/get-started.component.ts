import { Component, OnInit } from "@angular/core";
import { WithProperties } from "@angular/elements";
import { Route } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "get-started",
  templateUrl: "./get-started.component.html",
  styleUrls: ["./get-started.component.scss"],
})
export class GetStartedComponent implements OnInit {
  checkbox1: boolean;
  checkbox2: boolean;
  checkbox3: boolean;
  chooseEntity: string;
  colorBorder: string;
  colorBorder2: string;
  colorBorder3: string;

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    localStorage.setItem("schemaParams", "");
    this.checkbox1 = true;
    this.checkbox2 = true;
    this.checkbox3 = false;
    this.colorBorder = "border2";
    this.colorBorder2 = "border2";
    this.colorBorder3 = "border2";

    if (this.checkbox1 == true && this.checkbox2 == true) {
      this.colorBorder = "border-color-sec";
      this.colorBorder2 = "border-color-sec";
      // this.colorBorder3 = "border1";

      this.checkEntity();
    }
  }

  status: boolean = false;

  changeEvent1() {
    this.checkbox1 = !this.checkbox1;
    if (this.checkbox1) {
      this.colorBorder = "border-color-sec";
    } else {
      this.colorBorder = "border2";
    }
    this.checkEntity();
  }

  changeEvent2() {
    this.checkbox2 = !this.checkbox2;
    if (this.checkbox2) {
      this.colorBorder2 = "border-color-sec";
    } else {
      this.colorBorder2 = "border2";
    }
    this.checkEntity();
  }

  changeEvent3() {
    this.checkbox3 = !this.checkbox3;
    if (this.checkbox3) {
      this.colorBorder3 = "border-color-sec";
    } else {
      this.colorBorder3 = "border2";
    }
    this.checkEntity();
  }

  checkthebox() {
    console.log("checked")
  }

  checkEntity() {
    if (this.checkbox1 == true) {
      this.chooseEntity = "attestmodule";
    } else if (this.checkbox1 == false && this.checkbox2 == true && this.checkbox3 == false) {
      this.chooseEntity = "vcmodule";
    } else if (this.checkbox1 == false && this.checkbox2 == false && this.checkbox3 == true) {
      this.chooseEntity = "ownershipmodule";
    }  else if (this.checkbox1 == false && this.checkbox2 == true && this.checkbox3 == true) {
      this.chooseEntity = "vcownershipmodule";
    } else if (this.checkbox1 == false && this.checkbox2 == false && this.checkbox3 == false) {
      this.chooseEntity = "newmodule";
    }
  }
}
