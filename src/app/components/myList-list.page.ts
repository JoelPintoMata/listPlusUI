import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MyListService, MyList } from '../services/myList.service';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';

import { ApolloQueryResult } from 'apollo-client';

@Component({
  selector: 'if-myList',
  templateUrl: './myList-list.page.html'
})

export class MyListListComponent implements OnInit {

  myLists = [];
  myListsAux: MyList[];
  isLoading = false;

  constructor(private myListService: MyListService, private router: Router) {
    console.log('myList: constructor');
  }

  ngOnInit() {
    console.log('myList: ngOnInit');
    this.getMyLists();
  }

  getMyLists() {
    console.log('myList: getMyLists');
    this.isLoading = true;
    this.myListService.getMyLists().subscribe(({data}) => {
      console.log(data);
//      .data unwraps a ApolloQueryResult
      console.log("data " + data);
      this.isLoading = false;
      this.myListsAux = data;
      this.myLists.push(data);
    });
  }
}
