import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { MyList, Item, MyListService } from '../services/myList.service';

import { ApolloQueryObservable } from 'apollo-angular';

import { Pipe } from '@angular/core';

@Component({
  selector: 'if-myList-detail',
  templateUrl: './myList-detail.page.html',
  styleUrls: [
      './myList-detail.page.css'
  ]
})

export class MyListDetailComponent implements OnInit {
  private _lipsum: any;
  private _start: DateTime;
  private _end: DateTime;
  private _isSorting: bool = false;

  @Input() options: CustomTableOptions;

  isNew = false;
  feedback = '';
  myList: MyList;
  myListForm: FormGroup;

  constructor(private fb: FormBuilder, private myListService: MyListService, private route: ActivatedRoute, private router: Router) {
    console.log('myList-detail: constructor');
    this.myListForm = this.fb.group({
      id: [''],
      name: [''],
      items: this.fb.array([
        this.fb.group({
          id: [''],
          name: [''],
          quantity: [''],
        })
      ])
    });
  }

  ngOnInit() {
    console.log('myList-detail: ngOnInit');
    this.route.params
      .switchMap((params: Params) => {
        this.isNew = params['id'] === 'new';
        if (this.isNew) {
          return null;
        } else {
          return this.myListService.getMyList(params['id']);
        }
      })
      .subscribe(({data}) => {
        var obj = JSON.parse(JSON.stringify(data));
        this.setFormData(obj.myList[0]);
      });
  }

  getMyList(id: string) {
    return this.myListService.getMyList(id).subscribe(({data}) => {
      var obj = JSON.parse(JSON.stringify(data));
      this.myList = obj.myList.data[0];
    });
  }

  addRowItem() {
    const control = <FormArray>this.myListForm.controls['items'];
    control.push(this.fb.group(['', '', '', '']));
  };

  get items(): FormArray {
    return this.myListForm.get('items') as FormArray;
  };

  setItems(items: Item[]) {
    let itemFGs = items.map(item => {
      return this.fb.group(item);
    });
    this.myListForm.setControl('items', this.fb.array(itemFGs));
  }

  setFormData(myList: MyList) {
    this.myList = myList;
    this.myListForm.reset(myList);
    this.setItems(this.myList.items);
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

  sortHeaderClick(headerName: string) {
    if (headerName) {
      if (this.options.config.sortBy === headerName) {
        this.options.config.sortDirection = this.options.config.sortDirection === 'asc' ? 'desc' : 'asc';
      }
      this.options.config.sortBy = headerName;
      // Get the matching column
      var column: CustomTableColumnDefinition = this.options.columns.filter((column) => column.value === this.options.config.sortBy)[0];
      var isNumeric: bool = (column.filter && column.filter.indexOf("currency") != -1) || (column.isNumeric === true);
      this.sort(this.filteredData, this.options.config.sortBy, this.options.config.sortDirection, isNumeric);
    }
  }

  isSorting(name: string) {
    return this.options.config.sortBy !== name && name !== '';
  };

  isSortAsc(name: string) {
    console.log('isSortASc ' + name)
    var isSortAsc: bool = this.options.config.sortBy === name && this.options.config.sortDirection === 'asc';
    return isSortAsc;
  };

  isSortDesc(name: string) {
    var isSortDesc: bool = this.options.config.sortBy === name && this.options.config.sortDirection === 'desc';
    return isSortDesc;
  };

  private sort(array: Array<any>, fieldName: string, direction: string, isNumeric: bool)
  {
    var sortFunc = function (field, rev, primer) {
        // Return the required a,b function
        return function (a, b) {
            // Reset a, b to the field
            a = primer(pathValue(a, field)), b = primer(pathValue(b, field));
            // Do actual sorting, reverse as needed
            return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
        }
    };

    // Have to handle deep paths
    var pathValue = function (obj, path) {
        for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
            obj = obj[path[i]];
        };
        return obj;
    };

    var primer = isNumeric ?
        function (a) {
            var retValue = parseFloat(String(a).replace(/[^0-9.-]+/g, ''));
            return isNaN(retValue) ? 0.0 : retValue;
        } :
        function (a) { return String(a).toUpperCase(); };

    this._isSorting = true;
    this._start = new Date().getTime();
    array.sort(sortFunc(fieldName, direction === 'desc', primer));
    this._end = new Date().getTime();
    var time = this._end - this._start;
    console.log('Sort time: ' + time);
    this._isSorting = false;
  }
}
