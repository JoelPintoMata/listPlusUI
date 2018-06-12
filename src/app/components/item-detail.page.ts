import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApolloModule } from 'apollo-angular';

import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';

import { Item, MyListService } from '../services/myList.service';
import { Role } from '../services/roles-resolver.service';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  selector: 'if-item-detail',
  templateUrl: './item-detail.page.html'
})

export class ItemDetailComponent implements OnInit {

    headers = new HttpHeaders();

    image: SafeResourceUrl;

  isNew = false;
  role = '';
  mode = '';
  feedback = '';
  item: Item;
  allImages: String[];
  itemForm: FormGroup;
  id_list;

  constructor(private fb: FormBuilder,
    private myListService: MyListService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.itemForm = this.fb.group({
      id_list: [''],
      id: [''],
      images: this.fb.array([]),
      name: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      order: ['', Validators.required],
      mode: ['']
    });

    this.getQRCode();
  }

  ngOnInit() {
    this.allImages = [];

    var id = this.route.params['_value'].id;
    var id_list = this.route.params['_value'].id_list;
    this.role = this.route.params['_value'].role;
    this.mode = this.route.params['_value'].mode;

    this.myListService.getItem(id_list, id)
      .valueChanges
      .subscribe(({data}) => {
        var item = JSON.parse(JSON.stringify(data))["item"];
        this.id_list = item.id_list;
        if(this.mode == 'view') {
          this.itemForm.disable();
        }
        this.setFormData(item);
      });
  }

  get images(): FormArray {
    return this.itemForm.get('images') as FormArray;
  };

  setFormData(item: Item) {
    this.item = item;
    this.itemForm.reset(item);
    this.setImages(item.images);
  }

  setImages(images: string[]) {
    if(images != null) {
      const imageFGs = images.map(image => image);
      this.itemForm.setControl('images', this.fb.array(imageFGs));
    }
  }

  onSubmit() {
    this.feedback = '';
    this.myListService.saveItem(this.itemForm.value)
      .subscribe(({data}) => {
        if (this.isNew) {
          this.router.navigate(['/myList/'+data.id_list+'/item/'+data.id]);
        // } else {
        //   this.setFormData(data);
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

  getValue(key: string) {
    const control = this.itemForm.get(key);
//    if(control.errors) {
//      if(control.errors.server_validation) {
//        return control.errors.server_validation;
//      } else if(control.touched && control.errors.required) {
//        return 'This field is required';
//      }
//    }
    return control.value;
  }

  revert() {
    this.setFormData(this.item);
    this.feedback = '';
  }

    getQRCode() {
      console.log('myList-detail: getQRCode');
      this.headers.append('Content-Type', 'application/json');

      let url = "http://rest-qr-code-generator.herokuapp.com/generateAndGetString";
      //let url = "http://localhost:8080/generateAndGetString";
      this.http.post(url,
        {name:"name", url:"url"},
        {headers: this.headers})
        .subscribe(res => {
          var obj = JSON.parse(JSON.stringify(res));
          this.image = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + obj.body);
        });
    }
}
