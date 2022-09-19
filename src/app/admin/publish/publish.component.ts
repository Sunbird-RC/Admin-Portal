import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  isShow =false;
  constructor() { }

  ngOnInit(): void {
  }


  changeVal(){
    this.isShow = !this.isShow;
  }
}
