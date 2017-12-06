import { Component, ViewChild, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table';

import { ApolloQueryObservable } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';

import { Thing, MyListService } from '../services/myList.service';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


@Component({
  selector: 'if-search',
  templateUrl: './search.page.html',
  styleUrls: [
      './search.page.css'
  ]
})

export class SearchComponent {

    isNew = false;
    thing: Thing;

    things = [];
    thingCount = 0;

    @ViewChild(DataTable) thingsTable;

    constructor(private myListService: MyListService, private route: ActivatedRoute, private router: Router) {
    }

    reloadThings(event) {
        this.route.params
          .switchMap((params: Params) => {
              return this.myListService.search(params['search_string']);
          })
          .subscribe(({data}) => {
            var obj = JSON.parse(JSON.stringify(data));
            var thingsArray = [];
            obj.search.map(thing => {
              thingsArray.push({"id_list": thing.id_list, "id": thing.id, "name": thing.name, "thingType": thing.thingType});
            });
            this.thingCount = thingsArray.length;
            this.things = thingsArray;
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
