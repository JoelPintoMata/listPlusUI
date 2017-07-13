import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { List, ListService } from '../services/list.service';
import { Role } from '../services/roles-resolver.service';

@Component({
  selector: 'if-list-detail',
  templateUrl: './list-detail.page.html'
})
export class ListDetailComponent implements OnInit {
  isNew = false;
  feedback = '';
  list: List;
  allRoles: Role[];
  listForm: FormGroup;

  constructor(private fb: FormBuilder, private listService: ListService, private route: ActivatedRoute, private router: Router) {
    this.listForm = this.fb.group({
      id: [''],
      listName: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', Validators.required],
      streetName: ['', Validators.required],
      houseNumber: ['', Validators.required],
      city: ['', Validators.required],
      birthDate: [null, Validators.required],
      roles: this.fb.array([])
    });
  }

  ngOnInit() {
    this.allRoles = this.route.snapshot.data['allRoles'];
    this.route.params
      .switchMap((params: Params) => {
        this.isNew = params['id'] === 'new';
        if (this.isNew) {
          return Observable.of({
            listName: '',
            firstName: '',
            lastName: '',
            emailAddress: '',
            streetName: '',
            houseNumber: null,
            city: '',
            birthDate: null,
            roles: []
          });
        } else {
          return this.listService.getList(params['id']);
        }
      })
      .subscribe(list => {
        this.setFormData(list);
      });
  }

  get roles(): FormArray {
    return this.listForm.get('roles') as FormArray;
  };

  setRoles(roles: string[]) {
    const roleFGs = roles.map(role => this.fb.control(role));
    this.listForm.setControl('roles', this.fb.array(roleFGs));
  }

  setFormData(list: List) {
    this.list = list;
    this.listForm.reset(list);
    this.setRoles(this.list.roles);
  }

  onSubmit() {
    this.listForm.disable();
    this.feedback = '';
    this.listService.saveList(this.listForm.value)
      .subscribe(list => {
        if (this.isNew) {
          this.router.navigate(['/lists', list.id]);
        } else {
          this.setFormData(list);
        }
        this.listForm.enable();
        this.feedback = 'SUCCESS';
      }, response => {
        this.listForm.enable();
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
      for (let key in this.listForm.controls) {
        if (errors[key]) {
          this.listForm.get(key).setErrors({'server_validation': errors[key][0]});
        }
      }
    }
  }

  getError(key: string) {
    const control = this.listForm.get(key);
    if(control.errors) {
      if(control.errors.server_validation) {
        return control.errors.server_validation;
      } else if(control.touched && control.errors.required) {
        return 'This field is required';
      }
    }
    return null;
  }

  revert() {
    this.setFormData(this.list);
    this.feedback = '';
  }
}
