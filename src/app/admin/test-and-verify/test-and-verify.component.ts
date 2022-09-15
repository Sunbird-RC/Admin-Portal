import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  params: any;
  entityName: any;
  usecase: any;
  constructor(public router: Router, public route: ActivatedRoute,) { 
    this.vaccinationStatus = [ "Fully vaccinated", "Partially Vaccinated", "Not Vaccinated" ]
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.params = params;
      console.log({params});

      if (this.params.hasOwnProperty('entity')) {
        this.entityName = params.entity;
        this.usecase = params.usecase.toLowerCase();

      }
  });

  }


  getValues(){
    console.log(this.issuerName);
    console.log(this.beneficiaryName);
    console.log(this.vaccDate);
    console.log(this.vaccStatus);
  }

  testAndVerify(){
    this.router.navigate(['/create/2/' + this.usecase + '/' + this.entityName]);
  }
  
}
