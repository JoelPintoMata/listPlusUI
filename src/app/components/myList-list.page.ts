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

  myLists: ApolloQueryResult<MyList[]>;
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
      data.map(x => {
        alert("data" + x);
        alert("data" + x.id);
        alert("data" + x.name);
      });
      this.isLoading = false;
    });
  }
}
