import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'test-and-verify',
  templateUrl: './test-and-verify.component.html',
  styleUrls: ['./test-and-verify.component.scss']
})
export class TestAndVerifyComponent implements OnInit {
  linkImage: string ="assets/images/thumbnail.png";
  vaccinationStatus : Array<String>;
  formdata : any;

  issuerName: String;
  beneficiaryName : String;
  vaccDate : Date;
  vaccStatus : String;

  objectKeys = Object.keys;
  constructor() { 
    this.vaccinationStatus = [ "Fully vaccinated", "Partially Vaccinated", "Not Vaccinated" ]
  }

  ngOnInit(): void {
  }


  getValues(){
    console.log(this.issuerName);
    console.log(this.beneficiaryName);
    console.log(this.vaccDate);
    console.log(this.vaccStatus);
  }
  
}
