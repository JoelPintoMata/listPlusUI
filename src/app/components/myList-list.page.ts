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

      var obj = JSON.parse(data);
//      var obj = JSON.parse(JSON.stringify(data));
//     alert(obj);

//      alert(obj.list[0].id);
//      alert(obj.list[0].name);
//      alert(obj.list[1].id);
//      alert(obj.list[1].name);

      for (var item in obj) {
         if (obj.hasOwnProperty(item)) {
            console.log(item.id);
            console.log(item.name);
            this.myList = new MyList(item.id, item.name);
            console.log(this.myList);
            this.myLists.push(this.myList);
         }
      };

//      this.myLists.push(obj);
//      this.myLists = JSON.stringify(this.myLists);
    });
  }
}
