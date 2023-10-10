import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { map } from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general/general.service';
declare var grapesjs: any;
import { TranslateService } from '@ngx-translate/core'; 

import 'grapesjs-preset-webpage';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { SchemaService } from '../../services/data/schema.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent implements OnInit, OnDestroy {

  public editorOptions: JsonEditorOptions;
  public data: any;
  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  name1: string = 'pratik';
  sampleData: any;
  schemaContent: any;
  userJson: any;
  userHtml: any = '';
  templateName: any;
  issuerOsid: string;
  oldTemplateName: string;
  description: any;
  private editor: any = '';
  schemaDiv = false;
  htmlDiv = true;
  demoBaseConfig: {
    width: number; height: number; resize: boolean; autosave_ask_before_unload: boolean; codesample_dialog_width: number; codesample_dialog_height: number; template_popup_width: number; template_popup_height: number; powerpaste_allow_local_images: boolean; plugins: string[]; //removed:  charmap insertdatetime print
    external_plugins: { mentions: string; }; templates: { title: string; description: string; content: string; }[]; toolbar: string; content_css: string[];
  };
  certificateTemplate: any;
  certificateProperties: any;
  certificateTitle: any;
  propertyArr: any = [];
  params: any;
  entityName: any;
  usecase: any;
  schemaOsid: string;
  vcStep: string;
  isCreatingNewTemplate: boolean = true;
  certificateData: any;

  constructor(public router: Router, public route: ActivatedRoute, public toastMsg: ToastMessageService,public translate: TranslateService,
    public generalService: GeneralService, public schemaService: SchemaService) {

    this.editorOptions = new JsonEditorOptions()
  
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();

    this.userHtml = '';

    if (localStorage.getItem('sampleData')) {
      this.sampleData = JSON.parse(localStorage.getItem('sampleData'));
    } else {
      this.editor.runCommand('core:canvas-clear');

      this.sampleData = this.router.getCurrentNavigation().extras.state.item;
      localStorage.setItem('sampleData', JSON.stringify(this.sampleData));
    }
    if (localStorage.getItem('certificateTitle')) {
    this.oldTemplateName = localStorage.getItem('certificateTitle');
    this.isCreatingNewTemplate = false;
    }
    this.route.params.subscribe(params => {
      this.params = params;
  
      if (this.params.hasOwnProperty('usecase')) {
        this.usecase = params.usecase;
        this.entityName = params.entity;
      }

    });

  }


  async ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.params = params;
      if (this.params.hasOwnProperty('entity')) {
        this.entityName = params.entity;
        this.usecase = params.usecase.toLowerCase();
      }
    });
    
    this.schemaService.getEntitySchemaJSON().subscribe((data) => {
      let allSteps = data['usecase'][this.usecase]['steps'];
      for(let i=0; i<allSteps.length; i++){
        if(allSteps[i]['key'] === 'create-vc'){
          this.vcStep = i.toString();
        }
      }
    })
    
    await this.readHtmlSchemaContent(this.sampleData);
    this.grapesJSDefine();
    /* ------END-------------------------Advance Editor ----------------------- */
    
  }  //onInit();
  
  
  grapesJSDefine() {
    this.editor = this.initializeEditor();
    this.editor.on('load', () => {
      var panelManager = this.editor.Panels;
      
      panelManager.removePanel('devices-c');
      panelManager.removeButton('options', 'gjs-toggle-images');
      panelManager.removeButton('options', 'gjs-open-import-webpage');
      panelManager.removeButton('options', 'undo');
      const um = this.editor.UndoManager;
      um.clear();
      
      const iconsOptions = document.querySelector('.gjs-pn-options');
      if (iconsOptions) {
        iconsOptions.classList.add('custom-icons-margin-right');
      }
      
      const iconsViews = document.querySelector('.gjs-pn-views');
      if (iconsViews) {
        iconsViews.classList.add('custom-icons-margin-right');
      }
    })
    
    this.editor.on('asset:add', () => {
      this.editor.runCommand('open-assets');
    });
    
    
    // This will execute once asset manager will be open
    this.editor.on("run:select-assets", function () {
      var dateNow = 'img-' + Date.now();
      
      // Using below line i am changing the id of img tag on which user has clicked.
      this.editor.getSelected().setId(dateNow);

      // Store active asset manager image id and it's src
      localStorage.setItem('activeAssetManagerImageId', dateNow);
    })
    
    const pn = this.editor.Panels;
    const panelViews = pn.addPanel({
      id: "views"
    });
    
    
    panelViews.get("buttons").add([
      {
        attributes: {
          title: "Open Code"
        },
        className: "fa fa-file-code-o",
        command: "open-code",
        togglable: false, //do not close when button is clicked again
        id: "open-code"
      }
    ]);
    
    
    const panelOp1 = pn.addPanel({
      id: "options"
    });
    
    panelOp1.get("buttons").add([
      {
        attributes: {
          title: "preview"
        },
        className: "fa fa-eye",
        command: "preview",
        togglable: false, //do not close when button is clicked again
        id: "preview"
      }
    ]);
    
    
    /* ---------Start----------------------Advance Editor ----------------------- */
    
    
    const panelOp = pn.addPanel({
      id: "options"
    });
    
    
    let editPanel = null
    let self = this;
    pn.addButton('views', {
      id: 'advanceEditor',
      attributes: { class: 'fa fa-pencil-square-o', title: "Advance Editor" },
      active: false,
      togglable: false,
      command: {
        run: function (editor) {
          if (editPanel == null) {
            

            
            const editMenuDiv = document.createElement('div');
            
            const arr = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'alpha', 'bravo', 'charlie', 'delta', 'echo', 'alpha', 'bravo', 'charlie', 'delta', 'echo'];

            const cardDiv = document.createElement('div');
            cardDiv.className = 'pcard p-3';
            cardDiv.setAttribute('style', 'text-align: left; color:white');
            cardDiv.innerHTML = ` <div class="d-flex flex-justify-between py-2">
            <div class="heading-2">Preview</div>
            <div class="adv-btn-div">
            <button id="advanceBtn" (click)="editTemplate()"
            class="float-end adv-btn btn"><i
            class="fa fa-pencil-square-o" aria-hidden="true"></i>Advance Editor</button>
            </div>
            </div>
            <p style="color:white;font-size:12px"> <i class="fa fa-asterisk" style="color: #FFD965; font-size: 7px;" aria-hidden="true"></i>
            These propeties are mandatory to make it <org> complaint</p>`;
            
            const cardBContainer = document.createElement('div');
            cardBContainer.className = 'card-body-container p-3';
            cardDiv.appendChild(cardBContainer);
            
            // ul.setAttribute('id', 'theList');
            for (let i = 0; i <= self.propertyArr.length - 1; i++) {
              const cardBdiv = document.createElement('div');	// create li element.
              
              if (self.propertyArr[i].require) {
                cardBdiv.innerHTML = `<i class="fa fa-asterisk" style="color: red; font-size: 7px;" aria-hidden="true"></i> &nbsp` + self.propertyArr[i].propertyTag;
              } else {
                cardBdiv.innerHTML = `&nbsp &nbsp` + self.propertyArr[i].propertyTag;	                        // assigning text to li using array value.
              }
              cardBdiv.className = 'pcard-body  mt-4';
              cardBdiv.setAttribute('style', 'padding-bottom: 10px; border-bottom: 2px solid #000');	// remove the bullets.
              cardBContainer.appendChild(cardBdiv);		// append li to ul.
            }
            


            editMenuDiv.appendChild(cardDiv);
            


            const panels = pn.getPanel('views-container')
            panels.set('appendContent', editMenuDiv).trigger('change:appendContent')
            editPanel = editMenuDiv;
            
            const urlInputElemen = document.getElementById('advanceBtn');
            urlInputElemen.onclick = function () {
              
              
              // here is where you put your ajax logic
              self.editTemplate();
              
              
            };
          }
          editPanel.style.display = 'block';
          
          
          
        },
        stop: function (editor) {
          if (editPanel != null) {
            editPanel.style.display = 'none'
          }
        }
        
      }
    })
    
  }
  
  editTemplate() {
    this.schemaDiv = true;
    this.htmlDiv = false;
  }
  
  private initializeEditor(): any {
    
    return grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: '#gjs',
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      autorender: true,
      forceClass: false,
      height: '700px',
      width: 'auto',
      // components: '<h1> Hello </h1>',
      components: this.userHtml,
      // Avoid any default panel
      panels: { defaults: [] },
      deviceManager: {},
      storageManager: {},
      undoManager: {},
      plugins: [
        'gjs-preset-webpage',
        'grapesjs-component-code-editor',
        'gjs-preset-newsletter'
      ],
      pluginsOpts: {
        'gjs-preset-webpage': {
          navbarOpts: false,
          countdownOpts: false,
          formsOpts: false,
          blocksBasicOpts: {
            blocks: ['link-block', 'quote', 'column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
            // flexGrid: false,
          }
        },
        'gjs-preset-newsletter': {
          
        }
        
      },

      assetManager: {
        uploadText: 'Add image through link or upload image',
        modalTitle: 'Select Image',
        openAssetsOnDrop: 1,
        inputPlaceholder: 'http://url/to/the/image.jpg',
        addBtnText: 'Add image',
        showUrlInput: true,
        embedAsBase64: true,
        dropzone: 0, // Enable an upload dropzone on the entire editor (not document) when dragging files over it
        handleAdd: (textFromInput) => {
          this.editor.AssetManager.add(textFromInput);
        },
        assets: [
        ]
      },
    });
    
    var html = this.editor.getHtml();
  }

  dataChange() {
    window.location.reload();
  }
  
  back() {
    history.back();    //this.router.navigate(['/certificate']);
    this.editor.runCommand('core:canvas-clear')
  }
  
  backToHtmlEditor() {
    this.schemaDiv = false;
    this.htmlDiv = true;
  }
  
  cancel() {
    localStorage.setItem('sampleData', '');
    this.router.navigate(['/dashboard']);
  }

  async readHtmlSchemaContent(doc) {
    this.userHtml = doc;
    await this.generalService.getData('/Schema').subscribe((res) => {
      for(let i =0; i < res.length; i++)
      {
        if(res[i]["name"] == this.entityName)
        {
          
          this.schemaOsid = res[i].osid;
          this.generalService.getData('/Schema/' + this.schemaOsid).subscribe((response) => {
            let data = JSON.parse(response['schema']);
            this.certificateTitle = response['name'];
            this.userJson = response;              
          });
          
        }
      
          }
         
        });
      
  }

  addCrtTemplateFields111(userJson) {
    let url = this.userJson['_osConfig']['credentialTemplate'];

    this.userHtml = '';
    fetch(url)
      .then(response => response.text())
      .then(data => {
      });

  }

  getCrtTempFields(certificateSchema) {
    this.propertyArr = [];
    let temp = certificateSchema.definitions[this.certificateTitle].properties.hasOwnProperty('data') ? certificateSchema.definitions[this.certificateTitle].properties.data : certificateSchema.definitions[this.certificateTitle].properties;


    let required = certificateSchema.definitions[this.certificateTitle].required;
    let _self = this;
    let propertyName;
    Object.keys(temp).forEach(function (key) {

      if (temp[key].type == 'string' || temp[key].type == 'number') {
        propertyName = "{{credentialSubject." + key + "}}";
        let isRequire = required.includes(key) ? true : false;
      
        _self.propertyArr.push({ 'propertyTag': propertyName, 'require': isRequire });


      } else if (temp[key].type == 'object') {
        let objPro = temp[key].properties;
        let objProReq = temp[key].required;
        Object.keys(objPro).forEach(function (key2) {

          propertyName = "{{credentialSubject." + key2 + "}}";
          let isRequire = objProReq.includes(key2) ? true : false;
         
          _self.propertyArr.push({ 'propertyTag': propertyName, 'require': isRequire });
        })
      } else if (temp[key].type == 'array') {
        propertyName = "{{#each credentialSubject." + key + "}} {{this}} {{/each}}";
        _self.propertyArr.push({ 'propertyTag': propertyName, 'require': false });
      }
    });

    this.grapesJSDefine();

  }

  stringToHTML(str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };


  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }

  addCrtTemplateFields() {
    let certTmpJson = (this.schemaContent) ? this.schemaContent : this.userJson;
    certTmpJson = certTmpJson['_osConfig']['credentialTemplate'];
    if (typeof (certTmpJson) == 'string') {
      let jsonUrl = certTmpJson;

      fetch(jsonUrl)
        .then(response => response.text())
        .then(data => {
        });


    } else {

      certTmpJson = certTmpJson['credentialSubject'];
   
      if (this.schemaContent) {
        let _self = this;
        let propertyData = this.schemaContent.definitions[this.certificateTitle].properties;
        let contextJson = this.schemaContent._osConfig.credentialTemplate["@context"][1]["@context"];
        Object.keys(propertyData).forEach(function (key) {
       
          if (key != 'name') {
            if (propertyData[key].type == 'string' || propertyData[key].type == 'number') {
              certTmpJson[key] = "{{" + key + "}}";

              contextJson[key] = {
                "@id": "https://github.com/sunbird-specs/vc-specs#" + key,
                "@context": {
                  "name": "schema:Text"
                }
              }
            } else if (propertyData[key].type == 'object') {
              let objPro = propertyData[key].properties;
              Object.keys(objPro).forEach(function (key2) {
              
                certTmpJson[key2] = "{{" + key + "." + key2 + "}}";
              })
            }
          }
        });

        this.schemaContent['_osConfig']['credentialTemplate']['credentialSubject'] = certTmpJson;
        this.schemaContent._osConfig.credentialTemplate["@context"][1]["@context"] = contextJson;
      }
    }
  }

  async submit() {
    this.generalService.getData('/Schema/' + this.schemaOsid).subscribe((res) => {
       let data = JSON.parse(res['schema']);
       this.certificateTitle = res['name'];
       this.userJson = data;
       this.schemaContent = data;
     
     var htmlWithCss = this.editor.runCommand('gjs-get-inlined-html');
 
 
     var parser = new DOMParser();
     var htmlDoc = parser.parseFromString(htmlWithCss, 'text/html');
     this.userHtml = htmlDoc.documentElement.innerHTML;
  
    const { vcTemplate, formData } = this.createVCTemplateAndFormData();

     localStorage.setItem('schemaVc', JSON.stringify(vcTemplate));

     this.generalService.postData('/Schema/' + this.schemaOsid + '/certificateTemplate/documents', formData).subscribe((res) => {
      this.certificateData = res.documentLocations[0];     

      if(!this.oldTemplateName){
        this.schemaContent._osConfig['certificateTemplates'][this.templateName] = 'minio://' + this.certificateData;
       }
       if(this.oldTemplateName){
         delete this.schemaContent._osConfig['certificateTemplates'][this.oldTemplateName];
         this.schemaContent._osConfig['certificateTemplates'][this.templateName] = 'minio://' + this.certificateData;
       }
     
 
       console.log(this.schemaContent)

       let result = this.schemaContent;
       let payload = {
         "schema": JSON.stringify(result)
       }
      
      this.generalService.putData('/Schema/', this.schemaOsid, payload).subscribe((res) => {
         this.router.navigate(['/create/' + this.vcStep + '/' + this.usecase + '/' + this.entityName]);
       });
     });
    });
   }
 
   createVCTemplateAndFormData(): { vcTemplate: any, formData: FormData } {
    this.templateName = this.templateName.replace(/\s+/g, '');
    this.templateName = this.templateName.charAt(0).toUpperCase() + this.templateName.slice(1);
  
    const vcTemplate = {
      [this.entityName]: {
        'name': this.templateName,
        'description': this.description,
        'html': this.userHtml
      },
      'title': this.usecase
    };
  
    const fileObj = new File([this.userHtml], this.templateName + '.html');

    const formData = new FormData();
    formData.append("files", fileObj, fileObj.name);
  
    return { vcTemplate, formData };
  }

  injectHTML() {

    const iframe: HTMLIFrameElement = document.getElementById('iframe2') as HTMLIFrameElement;

    var iframedoc;
    if (iframe.contentDocument)
      iframedoc = iframe.contentDocument;
    else if (iframe.contentWindow)
      iframedoc = iframe.contentWindow.document;


    if (iframedoc) {
      // Put the content in the iframe
      iframedoc.open();
      iframedoc.writeln(this.userHtml);
      iframedoc.close();
    } else {
      alert('Cannot inject dynamic contents into iframe.');
    }
  }

  jsonSchemaData(jsonSchema) {
    this.schemaContent = jsonSchema._data;
    this.getCrtTempFields(this.schemaContent);
    this.schemaDiv = false;
    this.htmlDiv = true;
  }

  ngOnDestroy(){
    this.userHtml = '';
    this.editor.runCommand('core:canvas-clear');
  }
}