import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'test-and-launch',
  templateUrl: './test-and-launch.component.html',
  styleUrls: ['./test-and-launch.component.scss']
})
export class TestAndLaunchComponent implements OnInit {
  linkImage: string = "assets/images/thumbnail.png";
  fixedImage: string = "assets/images/thumbnail.png"

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  testAndVerify(){
    this.router.navigate(['/test-and-verify'], { skipLocationChange:true});
  }
}
