import { Component, ViewChild, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table';

import { ApolloQueryObservable } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';

import { MyList, Item, MyListService } from '../services/myList.service';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


@Component({
  selector: 'if-myList-detail',
  templateUrl: './myList-detail.page.html',
  styleUrls: [
      './myList-detail.page.css'
  ]
})

export class MyListDetailComponent {

    isNew = false;
    myList: MyList;

    items = [];
    itemCount = 0;

    @ViewChild(DataTable) itemsTable;

    constructor(private myListService: MyListService, private route: ActivatedRoute, private router: Router) {
    }

    reloadItems(event) {
        this.route.params
          .switchMap((params: Params) => {
//            this.isNew = params['id'] === 'new';
//            if (this.isNew) {
//              return null;
//            } else {
              return this.myListService.getMyList(params['id'], event['sortBy'], event['sortAsc']);
//            }
          })
          .subscribe(({data}) => {
            var obj = JSON.parse(JSON.stringify(data));
            var itemsArray = [];
            obj.myList[0].items.map(item => {
              itemsArray.push({"id_list": obj.myList[0].id, "id": item.id, "name": item.name, "order": item.order, "quantity": item.quantity});
            });
            this.itemCount = itemsArray.length;
            this.items = itemsArray;
          });
    }

    cellColor(car) {
        //return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7)/1.3)*100)) + ')';
        return 'rgb(255, 255, 255)';
    };

    // special params:

    translations = <DataTableTranslations>{
        indexColumn: 'Index column',
        expandColumn: 'Expand column',
        selectColumn: 'Select column',
        paginationLimit: 'Max results',
        paginationRange: 'Result range'
    };
}
