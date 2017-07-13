import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { User, UserService } from '../services/user.service';
import { Role } from '../services/roles-resolver.service';

@Component({
  selector: 'if-user-detail',
  templateUrl: './user-detail.page.html'
})
export class UserDetailComponent implements OnInit {
  isNew = false;
  feedback = '';
  user: User;
  allRoles: Role[];
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.userForm = this.fb.group({
      id: [''],
      userName: ['', Validators.required],
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
            userName: '',
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
          return this.userService.getUser(params['id']);
        }
      })
      .subscribe(user => {
        this.setFormData(user);
      });
  }

  get roles(): FormArray {
    return this.userForm.get('roles') as FormArray;
  };

  setRoles(roles: string[]) {
    const roleFGs = roles.map(role => this.fb.control(role));
    this.userForm.setControl('roles', this.fb.array(roleFGs));
  }

  setFormData(user: User) {
    this.user = user;
    this.userForm.reset(user);
    this.setRoles(this.user.roles);
  }

  onSubmit() {
    this.userForm.disable();
    this.feedback = '';
    this.userService.saveUser(this.userForm.value)
      .subscribe(user => {
        if (this.isNew) {
          this.router.navigate(['/users', user.id]);
        } else {
          this.setFormData(user);
        }
        this.userForm.enable();
        this.feedback = 'SUCCESS';
      }, response => {
        this.userForm.enable();
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
      for (let key in this.userForm.controls) {
        if (errors[key]) {
          this.userForm.get(key).setErrors({'server_validation': errors[key][0]});
        }
      }
    }
  }

  getError(key: string) {
    const control = this.userForm.get(key);
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
    this.setFormData(this.user);
    this.feedback = '';
  }
}
