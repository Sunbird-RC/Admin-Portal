import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
@Component({
  selector: 'get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit {
  
  checkbox1:boolean;
  checkbox2: boolean;
  chooseEntity :string;
 

  constructor() { }

  ngOnInit(): void {
    localStorage.setItem('schemaParams', "");
    this.checkbox1 = true;
      this.checkbox2 = true;
      if(this.checkbox1 == true && this.checkbox2 == true){
        this.checkEntity();
      }
  }

  status: boolean = false;

  changeEvent1() {
    this.checkbox1 = !this.checkbox1;
    this.checkEntity();
   
  }

  changeEvent2() {
    this.checkbox2 = !this.checkbox2;
    this.checkEntity();

  }

  checkEntity(){
    if(this.checkbox1 == true && this.checkbox2 == false){
      this.chooseEntity = "atstandclaim";
    }
   else if(this.checkbox1 == false && this.checkbox2 == true){
      this.chooseEntity = "issuance";
    }
    else if(this.checkbox1 == false && this.checkbox2 == false){
      this.chooseEntity = "new";
    }
    else if(this.checkbox1 == true && this.checkbox2 == true){
      this.chooseEntity = "newcombination";
    }
  }
   
  



  }
