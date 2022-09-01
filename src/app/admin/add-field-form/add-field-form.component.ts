import { Component, Input, OnInit } from '@angular/core';
import { editorConfig } from './form-editor-config';
import { Output, EventEmitter } from '@angular/core';

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


  @Input() jsonSchema;


  entityFieldList: any = []

  entityFields: any = [];
  propertyArr: any;
  jsonFields: any;
  jsonTitle: any;

  constructor() { }

  ngOnInit(): void {
    
   // this.entityFields = this.jsonSchema;

    if (this.jsonSchema) {
      this.myForm['components'].push(this.jsonSchema);
      // delete editorConfig.builder['basic'];
      // this.options = editorConfig;
      //  this.options.builder.basic = false;
    }

    // this.formioJsonBuild(this.jsonSchema);
  }

  onSubmit(event) {
    console.log(event);
  }







  onChange(event) {

    console.log({ event });

    if (event.type == 'saveComponent' || event.type == "addComponent" || event.type == 'deleteComponent') {
      if(event.isNew){
      let data = this.formioJsonToPlainJSONSchema(event, event.form.components);
      this.entityFields.push(data);
      }else{
        this.entityFields[event.index] = this.formioJsonToPlainJSONSchema(event, event.form.components);
      }
    

     // let _self = this;
      // Object.keys(this.entityFields).forEach(function (key) {
      //   console.log({ key });
      //   _self.entityFieldList.push({
      //     'key': key,
      //     'title': _self.entityFields[key].title,
      //     'type': _self.entityFields[key].type,
      //     'required': _self.entityFields[key].required,

      //   })
      // })

     // console.log(this.entityFieldList);
    }
  }

  formioJsonToPlainJSONSchema(event, components) {
    console.log({ components });
    return components;
  }

  viewField() {
    //alert('view');
  }

  saveAdvance() {
    this.newItemEvent.emit(this.entityFields[this.entityFields.length - 1]);
    this.cancel();
  }

  cancel() {
    this.backEvent.emit();

  }


}
