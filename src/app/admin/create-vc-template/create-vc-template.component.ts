import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SchemaService } from '../../services/data/schema.service';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'create-vc-template',
  templateUrl: './create-vc-template.component.html',
  styleUrls: ['./create-vc-template.component.scss']
})
export class CreateVcTemplateComponent implements OnInit {
  thumbnailItems: any = []
  params: any;
  entityName: any;
  usecase: any;
  vcObject: any;
  schemaName: string;
  isShow1: boolean;
  isShow2: boolean;
  res2: any;
  items:any = []
  userHtml1;
  credTemp : any = []
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public location: Location,
    public schemaService: SchemaService,
    public generalService: GeneralService
  ) { }

  ngOnInit() {

    this.generalService.getData('/Schema').subscribe((res) => {
      this.readSchema(res);
      console.log(this.items);
      this.getCredTemplate();
      
      this.injectHTML();
     });
    this.activeRoute.params.subscribe(params => {
      this.params = params;
      console.log({ params });

      if (this.params.hasOwnProperty('usecase')) {
        this.usecase = params.usecase;
        this.usecase = params.usecase;
        if (this.usecase == 'issuance') {
          this.isShow1 = true;
          this.isShow2 = true;
        }
        else if (this.usecase == 'atstandclaim') {
          this.isShow1 = false;
          this.isShow2 = true;
        }
        else if (this.usecase == 'divoc') {
          this.isShow1 = true;
          this.isShow2 = false;
        }
        else if (this.usecase == 'education') {
          this.isShow1 = true;
          this.isShow2 = false;
        }
      }

      if (this.params.hasOwnProperty('entity')) {
        this.entityName = params.entity;
      } else {
        let temp = window.location.href.split('/');
        this.entityName = temp[temp.length - 1]
      }
      
      
      let schemaVc = localStorage.getItem('schemaVc');
      if (schemaVc != undefined) {
        schemaVc = JSON.parse(schemaVc);
        let self = this;
        Object.keys(schemaVc).forEach(function (key) {
          if (key !== 'title') {

            self.schemaName = key;
            self.vcObject = schemaVc[key];         
            self.thumbnailItems.push({
              "thumbnailUrl": "/assets/images/thumbnail2.png",
              "title": self.vcObject.name,
              "description": self.vcObject.description,
              "html": self.vcObject.html,
            })
          }
        });

      }
    });
  }

  readSchema(res)
  {
    for(let i =0; i < res.length; i++)
    {
      if(typeof(res[i].schema)== 'string')
      {
        res[i].schema = JSON.parse(res[i].schema);

        if( !res[i].schema.hasOwnProperty('isRefSchema') &&  !res[i].schema.isRefSchema){
          this.items.push(res[i]);
        }
       
      }
     
    }
  }

  getCredTemplate(){
   
    console.log(this.entityName);

   
    for(let i =0; i < this.items.length; i++)
    {
      if(this.items[i]["name"] == this.entityName)
      {
        let a = this.items[i]["schema"]["_osConfig"]["certificateTemplates"];
        let b = Object.values(a);
        let c = b.toString();
        let d = c.split("Schema/");

        let nUrl =  "http://localhost:4200/registry/api/v1/Schema/"+ d[1];
         fetch(nUrl)
         .then(response => response.text())
         .then(data => {
          this.userHtml1 = data; 
         });

         this.credTemp.push({
         
          "title":Object.keys(a),    
          "html": this.userHtml1,
        })
       
      }

    }
   
  }

 
  injectHTML() {

    setTimeout(() => {
      const iframe: HTMLIFrameElement = document.getElementById('iframe1') as HTMLIFrameElement;
      var iframedoc;
     
      if (iframe.contentDocument) {
        iframedoc = iframe.contentDocument;
        
      }
      else if (iframe.contentWindow) {
        iframedoc = iframe.contentWindow.document;
  
      }

      if (iframedoc) {
        // Put the content in the iframe
        iframedoc.open();
        iframedoc.writeln(this.userHtml1);
        iframedoc.close();
      } else {
        alert('Cannot inject dynamic contents into iframe.');
      }
    }, 500)
  }



  openAddVc() {
    this.location.replaceState('/add-template/' + this.usecase + '/' + this.entityName);
  }



}
