import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'test-and-launch',
  templateUrl: './test-and-launch.component.html',
  styleUrls: ['./test-and-launch.component.scss']
})
export class TestAndLaunchComponent implements OnInit {
  linkImage: string = "assets/images/linkImage.jpeg";
  fixedImage: string = "assets/images/fixedImage.jpeg"

  constructor() { }

  ngOnInit(): void {
  }

}
