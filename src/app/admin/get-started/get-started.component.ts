import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
@Component({
  selector: 'get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  status: boolean = false;

  clickEvent() {
    this.status = !this.status;
  }

}
