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
  VerifiableCredentialCheckbox: boolean = true;
  OwnershipCheckbox: boolean = false;
  chooseEntity: string;
  attestationCheckboxBorder: string;
  VCcheckboxBorder: string;
  OwnershipCheckboxBorder: string;

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    localStorage.setItem("schemaParams", "");
      
    if (this.attestationCheckbox == true && this.VerifiableCredentialCheckbox == true) {
      this.attestationCheckboxBorder = "border-color-sec";
      this.VCcheckboxBorder = "border-color-sec";

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
    this.VerifiableCredentialCheckbox = !this.VerifiableCredentialCheckbox;
    if (this.VerifiableCredentialCheckbox) {
      this.VCcheckboxBorder = "border-color-sec";
    } else {
      this.VCcheckboxBorder = "border-color-pri";
    }
    this.checkEntity();
  }

  changeEvent3() {
    this.OwnershipCheckbox = !this.OwnershipCheckbox;
    if (this.OwnershipCheckbox) {
      this.OwnershipCheckboxBorder = "border-color-sec";
    } else {
      this.OwnershipCheckboxBorder = "border-color-pri";
    }
    this.checkEntity();
  }

   checkEntity(){
    return this.attestationCheckbox ? this.chooseEntity = "attestmodule"
         : this.VerifiableCredentialCheckbox && !this.OwnershipCheckbox ? this.chooseEntity = "vcmodule"
         : this.OwnershipCheckbox && !this.VerifiableCredentialCheckbox ? this.chooseEntity = "ownershipmodule" 
         : this.VerifiableCredentialCheckbox && this.OwnershipCheckbox ? this.chooseEntity = "vcownershipmodule"
         : this.chooseEntity = "newmodule" ;
  }
}
