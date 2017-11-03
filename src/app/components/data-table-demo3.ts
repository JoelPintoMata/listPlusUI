import { Component, ViewChild, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table';
import { films } from './data-table-demo3-data';

import { ApolloQueryObservable } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';

import { MyList, Item, MyListService } from '../services/myList.service';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


@Component({
  selector: 'data-table-demo-3',
  templateUrl: './data-table-demo3.html',
  styleUrls: ['./data-table-demo3.css']
})

export class DataTableDemo3 {

    isNew = false;
    myList: MyList;

    filmResource = new DataTableResource(films);
    films = [];
    filmCount = 0;

    @ViewChild(DataTable) filmsTable;

    constructor(private myListService: MyListService, private route: ActivatedRoute, private router: Router) {
        this.filmResource.count().then(count => this.filmCount = count);
    }

    reloadFilms(params) {
        console.log("DataTableDemo3: reloadFilms");
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
            console.log("DataTableDemo3: reloadFilms.subscribe");
            var obj = JSON.parse(JSON.stringify(data));

            this.filmCount = obj.myList[0].items.length;
            var itemsArray = [];
            var items = obj.myList[0].items.map(item => {
              itemsArray.push({"id": item.id, "name": item.name, "order": item.order, "quantity": item.quantity});
              return itemsArray;
            });
            this.films = items[0];
          });
    }

    cellColor(car) {
        return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7)/1.3)*100)) + ')';
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
