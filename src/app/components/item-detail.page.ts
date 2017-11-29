import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApolloModule, ApolloQueryObservable } from 'apollo-angular';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Item, MyListService } from '../services/myList.service';
import { Role } from '../services/roles-resolver.service';

@Component({
  selector: 'if-item-detail',
  templateUrl: './item-detail.page.html'
})
export class ItemDetailComponent implements OnInit {
  isNew = false;
  feedback = '';
  item: Item;
  allRoles: Role[];
  itemForm: FormGroup;

  constructor(private fb: FormBuilder, private myListService: MyListService, private route: ActivatedRoute, private router: Router) {
    this.itemForm = this.fb.group({
      _id: [''],
      id: [''],
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      order: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
//        this.isNew = params['id'] === 'new';
//        if (this.isNew) {
//          return new ApolloQueryObservable<Item[]>([{
//            _id: '',
//            id: '',
//            name: '',
//            quantity: '',
//            order: ''
//          });
//        } else {
          return this.myListService.getItem(params['_id'], params['id']);
//        }
      })
      .subscribe(({data}) => {
        var item = JSON.parse(JSON.stringify(data));
        this.setFormData(item);
      });
  }

  setFormData(item: Item) {
    this.item = item;
    this.itemForm.reset(item);
  }

  onSubmit() {
    this.itemForm.disable();
    this.feedback = '';
    this.myListService.saveItem(this.itemForm.value)
      .subscribe(item => {
        if (this.isNew) {
          this.router.navigate(['/items', item.id]);
        } else {
          this.setFormData(item);
        }
        this.itemForm.enable();
        this.feedback = 'SUCCESS';
      }, response => {
        this.itemForm.enable();
        if (response.status == 400) {
          this.feedback = 'INVALID';
          this.setValidationErrors(response.json());
        } else {
          this.feedback = 'ERROR';
        }
      });
  }

  setValidationErrors(errors: any) {
    if (errors) {
      for (let key in this.itemForm.controls) {
        if (errors[key]) {
          this.itemForm.get(key).setErrors({'server_validation': errors[key][0]});
        }
      }
    }
  }

  getError(key: string) {
//    const control = this.itemForm.get(key);
//    if(control.errors) {
//      if(control.errors.server_validation) {
//        return control.errors.server_validation;
//      } else if(control.touched && control.errors.required) {
//        return 'This field is required';
//      }
//    }
    return null;
  }

  revert() {
    this.setFormData(this.item);
    this.feedback = '';
  }
}
