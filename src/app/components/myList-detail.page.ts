import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { MyList, MyListService } from '../services/myList.service';
import { Role } from '../services/roles-resolver.service';

@Component({
  selector: 'if-myList-detail',
  templateUrl: './myList-detail.page.html'
})
export class MyListDetailComponent implements OnInit {
  isNew = false;
  feedback = '';
  myList: MyList;
  allRoles: Role[];
  myListForm: FormGroup;

  constructor(private fb: FormBuilder, private myListService: MyListService, private route: ActivatedRoute, private router: Router) {
    this.myListForm = this.fb.group({
      id: [''],
      myListName: ['', Validators.required],
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
  }

  get roles(): FormArray {
    return this.myListForm.get('roles') as FormArray;
  };

  setRoles(roles: string[]) {
    const roleFGs = roles.map(role => this.fb.control(role));
    this.myListForm.setControl('roles', this.fb.array(roleFGs));
  }

  setFormData(myList: MyList) {
    this.myList = myList;
    this.myListForm.reset(myList);
    this.setRoles(this.myList.roles);
  }

  onSubmit() {
    this.myListForm.disable();
    this.feedback = '';
    this.myListService.saveMyList(this.myListForm.value)
      .subscribe(myList => {
        if (this.isNew) {
          this.router.navigate(['/myLists', myList.id]);
        } else {
          this.setFormData(myList);
        }
        this.myListForm.enable();
        this.feedback = 'SUCCESS';
      }, response => {
        this.myListForm.enable();
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
      for (let key in this.myListForm.controls) {
        if (errors[key]) {
          this.myListForm.get(key).setErrors({'server_validation': errors[key][0]});
        }
      }
    }
  }

  getError(key: string) {
    const control = this.myListForm.get(key);
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
    this.setFormData(this.myList);
    this.feedback = '';
  }
}
