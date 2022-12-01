import { Component, Input, OnInit } from '@angular/core';
import { editorConfig } from './form-editor-config';
import { Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'add-field-form',
  templateUrl: './add-field-form.component.html',
  styleUrls: ['./add-field-form.component.scss']
})
export class AddFieldFormComponent implements OnInit {
  public myForm: Object = { components: [] };
  public options = editorConfig;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() backEvent = new EventEmitter<any>();

  @Input() jsonSchema = '';
  @Input() commonSchema;

  entityFieldList: any = []

  entityFields: any = [];
  propertyArr: any;
  jsonFields: any;
  jsonTitle: any;

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    this.myForm['components'] = [];
    this.options = editorConfig;

    if (!this.commonSchema) {
      this.commonSchema = JSON.parse(localStorage.getItem('commonSchema'));
    }

    if (this.commonSchema) {
      this.options['builder']['custom'] = {
        title: 'COMMON SCHEMA',
        weight: 10,
        components: {}
      }

      for (let i = 0; i < this.commonSchema.length; i++) {
        this.options['builder']['custom']['components'][this.commonSchema[i]['key']] = {
          title: this.commonSchema[i]['label'],
          key: this.commonSchema[i]['key'],
          schema: this.commonSchema[i]
        }
      }

    }

    if (this.jsonSchema) {
      this.myForm['components'] = this.jsonSchema;
    }
  }

  onSubmit(event) {
    console.log(event);
  }

  onChange(event) {

    if (event.type == 'saveComponent' || event.type == "addComponent" || event.type == 'deleteComponent') {
      if (event.isNew) {
        let data = this.formioJsonToPlainJSONSchema(event, event.form.components);
        this.entityFields.push(data);
      } else {
        this.entityFields[event.index] = this.formioJsonToPlainJSONSchema(event, event.form.components);
      }

    }
  }

  formioJsonToPlainJSONSchema(event, components) {
    console.log({ components });
    return components;
  }


  saveAdvance() {
    this.jsonSchema = '';
    this.newItemEvent.emit(this.entityFields[this.entityFields.length - 1]);
    this.cancel();
  }

  cancel() {
    this.backEvent.emit();
  }

}
