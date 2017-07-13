import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  selector: 'if-checkbox-list',
  templateUrl: './checkbox-list.component.html'
})
export class CheckboxListComponent {
  @Input() elements: Item[];
  @Input() formArray: FormArray;

  constructor(private fb: FormBuilder) {
  }

  hasId(id: string): boolean {
    return this.formArray.value.indexOf(id) >= 0;
  }

  update(id: string, event) {
    if (event.target.checked) {
      this.formArray.push(this.fb.control(id));
    } else {
      this.formArray.removeAt(this.formArray.value.indexOf(id));
    }
    this.formArray.markAsDirty();
  }
}

export class Item {
  id: string;
  description: string;
}
