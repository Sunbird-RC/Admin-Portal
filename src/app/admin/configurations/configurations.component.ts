import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {
  tenantConfigList:  Array<String>;
  @Input() schemaItems;
  constructor() { 
    this.tenantConfigList = ['Schema','Workflow','VC Template','Ownership','Roles','Theme']
  }

  ngOnInit(): void {
  }

}
