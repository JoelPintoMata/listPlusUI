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

  myList: MyList;
  myLists: MyList[];
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

      var obj = JSON.parse(JSON.stringify(this.myLists));
      alert(obj);
      obj.map((item, i) => {
        alert(item);
        alert(i);
        this.myList = new MyList("aaa", "aaa");
        console.log(this.myList);
        alert(this.myList);
        this.myLists.push(this.myList);
      });

//      alert(obj.list[0].id);
//      alert(obj.list[0].name);
//      alert(obj.list[1].id);
//      alert(obj.list[1].name);

//      this.myLists.push(obj);
//      this.myLists = JSON.stringify(this.myLists);
    });
  }
}
