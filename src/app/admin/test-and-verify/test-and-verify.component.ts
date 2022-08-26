import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'test-and-verify',
  templateUrl: './test-and-verify.component.html',
  styleUrls: ['./test-and-verify.component.scss']
})
export class TestAndVerifyComponent implements OnInit {
  linkImage: string ="assets/images/linkImage.jpeg";
  constructor() { }

  ngOnInit(): void {
  }

  
}
