import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'test-and-launch',
  templateUrl: './test-and-launch.component.html',
  styleUrls: ['./test-and-launch.component.scss']
})
export class TestAndLaunchComponent implements OnInit {
  linkImage: string = "assets/images/thumbnail.png";
  fixedImage: string = "assets/images/thumbnail.png"

  constructor() { }

  ngOnInit(): void {
  }

}
