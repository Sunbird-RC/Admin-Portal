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
  attestationCheckbox: boolean =true;
  verifiableCredentialCheckbox: boolean = true;
  ownershipCheckbox: boolean = false;
  chooseEntity: string;
  attestationCheckboxBorder: string;
  vcCheckboxBorder: string;
  ownershipCheckboxBorder: string;

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    localStorage.setItem("schemaParams", "");
      
    if (this.attestationCheckbox == true && this.verifiableCredentialCheckbox == true) {
      this.attestationCheckboxBorder = "border-color-sec";
      this.vcCheckboxBorder = "border-color-sec";

      this.checkEntity();
    }
  }

  status: boolean = false;

  changeEvent1() {
    this.attestationCheckbox = !this.attestationCheckbox;
    if (this.attestationCheckbox) {
      this.attestationCheckboxBorder = "border-color-sec";
    } else {
      this.attestationCheckboxBorder = "border-color-pri";
    }
    this.checkEntity();
  }

  changeEvent2() {
    this.verifiableCredentialCheckbox = !this.verifiableCredentialCheckbox;
    if (this.verifiableCredentialCheckbox) {
      this.vcCheckboxBorder = "border-color-sec";
    } else {
      this.vcCheckboxBorder = "border-color-pri";
    }
    this.checkEntity();
  }

  changeEvent3() {
    this.ownershipCheckbox = !this.ownershipCheckbox;
    if (this.ownershipCheckbox) {
      this.ownershipCheckboxBorder = "border-color-sec";
    } else {
      this.ownershipCheckboxBorder = "border-color-pri";
    }
    this.checkEntity();
  }

   checkEntity(){
    return this.attestationCheckbox ? this.chooseEntity = "attestmodule"
         : this.verifiableCredentialCheckbox && !this.ownershipCheckbox ? this.chooseEntity = "vcmodule"
         : this.ownershipCheckbox && !this.verifiableCredentialCheckbox ? this.chooseEntity = "ownershipmodule" 
         : this.verifiableCredentialCheckbox && this.ownershipCheckbox ? this.chooseEntity = "vcownershipmodule"
         : this.chooseEntity = "newmodule" ;
  }
}
