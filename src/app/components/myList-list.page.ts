import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SearchResultComponent } from '../components/search-result.page';
import { MyListService, MyList } from '../services/myList.service';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';

import { ApolloQueryResult } from 'apollo-client';


@Component({
  selector: 'if-myList',
  templateUrl: './myList-list.page.html'
})

export class MyListListComponent implements OnInit {

  myLists: MyList[];
  isLoading = false;

  constructor(private myListService: MyListService,
      private router: Router) {
  }

  ngOnInit() {
    console.log('myList-list: ngOnInit');
    this.getMyLists();
  }

  getMyLists() {
    this.isLoading = true;
    this.myListService.getMyLists()
    .valueChanges
    .subscribe(({data}) => {
      this.isLoading = false;

      var obj = JSON.parse(JSON.stringify(data));

      this.myLists = obj.myList;
    });
  }
}
