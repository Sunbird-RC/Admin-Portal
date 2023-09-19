import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { V2schemaService } from 'src/app/services/v2schema.service';
declare var grapesjs: any;
import 'grapesjs-preset-webpage';
import { sampleV2Template } from './sample-v2-template';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-create-v2-templates',
  templateUrl: './create-v2-templates.component.html',
  styles: [
    `.active: {
      background-color: var(--primary-color);
      color: #fff;
    }
    .gjs-cv-canvas {
      top: 0;
      width: 100%;
      height: 100%;
    }
    .gjs-block {
      width: auto;
      height: auto;
      min-height: auto;
    }
    .w-10 {
      width: 10%;
    }
    .flex-item {
      flex: 1;
      text-align: center;
      padding: 10px;
      border: 1px solid #ccc;
    }
    .left {
      order: -1;
    }
    .box-overflow {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }`
  ]
})
export class CreateV2TemplatesComponent implements OnInit {

  schemaId: string;
  editor: any = null
  templates: any[] = [];
  templateHtml;
  selectedTemplate: any
  isLoading = false;
  defaultV2Template = sampleV2Template;
  templateType: string = '';
  showAddTemplate = false;
  isNewTemplate = false;
  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly v2schemaService: V2schemaService,
    private readonly sanitizer: DomSanitizer,
    private readonly toastMessageService: ToastMessageService,
    private readonly generalService: GeneralService
  ) { }

  ngOnInit(): void {
    // this.initializeGrapesJS();
    this.activateRoute.params.subscribe((params: any) => {
      if (params.schemaId) {
        console.log("schemaId", params.schemaId);
        this.schemaId = params.schemaId;
        this.getTemplates(this.schemaId);
      }
    });
  }

  getTemplates(schemaId: string) {
    this.isLoading = true;
    this.v2schemaService.getTemplatesBySchemaId(schemaId).subscribe(templates => {
      this.templates = templates;
      if (templates.length) {
        this.showTemplate(this.templates[0]);
      }
      console.log("templates", templates);
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log("error", error);
    });
  }

  showTemplate(template: any) {
    this.selectedTemplate = template;
    // this.addNewTemplate(template.template);
    this.templateHtml = this.sanitizer.bypassSecurityTrustHtml(template.template);
    console.log(this.selectedTemplate)
  }

  editTemplate(template) {
    this.addNewTemplate(template.template);
  }

  deleteTemplate() {
    this.v2schemaService.deleteTemplate(this.selectedTemplate.templateId).subscribe(res => {
      console.log("res", res);
      this.showAddTemplate = false;
      this.toastMessageService.success('', this.generalService.translateString('TEMPLATE_DELETED_SUCCESSFULLY'));
      this.getTemplates(this.schemaId);
    }, error => {
      console.log("error", error);
      this.toastMessageService.error('', this.generalService.translateString('UNABLE_TO_DELETE_TEMPLATE'));
    });
  }

  initializeGrapesJS() {
    this.editor = grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: '#gjs',
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      fromElement: false,
      // Size of the editor
      height: '700px',
      width: 'auto',
      // components: '<h1> Hello </h1>',
      components: this.defaultV2Template,
      // Disable the storage manager for the moment
      storageManager: false,
      // Avoid any default panel
      panels: { defaults: [] },
      plugins: [
        'gjs-preset-webpage',
        'grapesjs-component-code-editor',
        // 'gjs-preset-newsletter'
      ],
      pluginsOpts: {
        'gjs-preset-webpage': {
          navbarOpts: false,
          countdownOpts: false,
          formsOpts: false,
          blocksBasicOpts: {
            blocks: ['link-block', 'quote', 'column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
            flexGrid: false,
          },
        },
        // 'gjs-preset-newsletter': {}
      },
      onComponentChange: () => {
        const generatedHtml = this.editor.getHtml();
        console.log(generatedHtml);
      }
    });
  }

  saveTemplate() {
    const template = this.getTemplatePlaceholder();
    if (this.isNewTemplate) {
      this.v2schemaService.addTemplate(this.schemaId, template, this.templateType).subscribe(res => {
        console.log("res", res);
        this.showAddTemplate = false;
        this.getTemplates(this.schemaId);
        this.toastMessageService.success('', this.generalService.translateString('TEMPLATE_CREATED_SUCCESSFULLY'));
      }, error => {
        console.log("error", error);
        this.toastMessageService.error('', this.generalService.translateString('UNABLE_TO_CREATE_TEMPLATE'));
      });
    } else {
      this.v2schemaService.updateTemplate(template, this.templateType, this.selectedTemplate.templateId).subscribe(res => {
        console.log("res", res);
        this.showAddTemplate = false;
        this.toastMessageService.success('', this.generalService.translateString('TEMPLATE_UPDATED_SUCCESSFULLY'));
      }, error => {
        console.log("error", error);
        this.toastMessageService.error('', this.generalService.translateString('UNABLE_TO_UPDATE_TEMPLATE'));
      });
    }
  }

  getTemplatePlaceholder() {
    // let htmlWithCss = this.editor.runCommand('gjs-get-inlined-html'); //Works with plugin gjs-preset-newsletter only
    // let parser = new DOMParser();
    // let htmlDoc = parser.parseFromString(htmlWithCss, 'text/html');
    // this.defaultV2Template = htmlDoc.documentElement.innerHTML;
    const generatedHtml = this.editor.getHtml();
    const generatedCss = this.editor.getCss()
    let htmlCode = `<!DOCTYPE html><html lang="en"><head><style>${generatedCss}</style></head>${generatedHtml}</html>`;
    htmlCode = htmlCode.replace(/"/g, "'");
    this.defaultV2Template = htmlCode;
    console.log("defaultV2Template", this.defaultV2Template);
    return this.defaultV2Template;
  }

  addNewTemplate(template) {
    this.isNewTemplate = !template;
    if (template) {
      this.defaultV2Template = template;
      this.templateType = this.selectedTemplate.type;
    } else {
      this.defaultV2Template = sampleV2Template;
      this.templateType = '';
    }

    this.showAddTemplate = true;
    this.editor = null;
    this.initializeGrapesJS();
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
    this.editor = null
    this.showAddTemplate = false;
  }
}
