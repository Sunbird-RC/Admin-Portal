import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  isShow =false;
  schemaOsid: any;
  constructor(private generalService:GeneralService) { }

  ngOnInit(): void {
  }


  changeVal(){
    this.isShow = !this.isShow;
    let draftSchemaOsid = JSON.parse(localStorage.getItem('draftSchemaOsid'));
    console.log({ draftSchemaOsid });

    this.schemaOsid = draftSchemaOsid[0].osid;
    this.generalService.getData('/Schema/' + draftSchemaOsid[0].osid).subscribe((res) => {
      res['status'] = "PUBLISHED";
      res['schema'] = JSON.stringify(res['schema']);

      this.generalService.putData('/Schema', this.schemaOsid, res).subscribe((res) => {
        console.log(res);
        
      });
    })
  }
}
