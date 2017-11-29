import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MyListService, Item } from '../services/myList.service';
import 'rxjs/add/operator/finally';

import { ApolloQueryResult } from 'apollo-client';

@Component({
  selector: 'if-myList',
  templateUrl: './item-detail.page.html'
})

export class ItemDetailComponent implements OnInit {

  items: Item[];
  isLoading = false;

  constructor(private myListService: MyListService, private route: ActivatedRoute, private router: Router) {
    console.log('myList: constructor');
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
          return this.myListService.getItem(params['_id'], params['id']);
      })
      .subscribe(({data}) => {
        var obj = JSON.parse(JSON.stringify(data));
        var itemsArray = [];
        itemsArray.push({"_id": obj.item._id, "id": obj.item.id, "name": obj.item.name, "quantity": obj.item.quantity, "order": obj.item.order});
        this.items = itemsArray
        var obj = JSON.parse(JSON.stringify(data));
      });
  }
}
