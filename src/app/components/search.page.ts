import {Injectable, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()

@Component({
  selector: 'search',
  templateUrl: './search.page.html',
  styleUrls: [
      './search.page.css'
  ]
})

export class SearchComponent {

  componentName: 'SearchComponent';

  searchForm: FormGroup;

  constructor(private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router) {
    this.searchForm = this.fb.group({
      search_string: ['', Validators.required]
    });
  }

  onSubmit() {
    var search_string = this.searchForm.get('search_string').value;
    this.router.navigate(['/search/', search_string]);
  }
}
