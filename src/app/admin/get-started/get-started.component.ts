import { Component, OnInit } from '@angular/core';
import { getAllReferenceSchemas } from '../../../schemas';
import { Route } from '@angular/router';
@Component({
  selector: 'get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log(getAllReferenceSchemas());
  }

  status: boolean = false;

  clickEvent() {
    this.status = !this.status;
  }

}
