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
  objectKeys = Object.keys;
  constructor() { 
    this.vaccinationStatus = [ "Fully vaccinated", "Partially Vaccinated", "Not Vaccinated" ]
    this.formdata = {
      'Issuer Name' : [{'type':'text', 'placeholder':'Issuer Name', 'id':'issuerName'}],
      'Beneficiary Name' : [{'type':'text', 'placeholder':'Beneficiary Name', 'id':'beneficiaryName'}],
      'Vaccination Date' : [{'type':'date', 'placeholder':'Vacciantion Date', 'id':'vaccDate'}],
      'Vaccination Status' : [{'type':'option', 'placeholder':'Vaccination Status', 'id':'vaccStatus'}]
    }
  }

  ngOnInit(): void {
  }

  
}
