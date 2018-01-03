import { Injectable, Component, ViewChild, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table';

import { Thing, MyListService } from '../services/myList.service';

@Component({
  selector: 'search-result',
  templateUrl: './search-result.page.html',
  styleUrls: [
      './search-result.page.css'
  ]
})

export class SearchResultComponent {

  componentName: 'SearchResultComponent';

  isNew = false;
  thing: Thing;

  things = [];
  thingCount = 0;

  @ViewChild(DataTable) thingsTable;

  constructor(private myListService: MyListService, private route: ActivatedRoute, private router: Router) {
  }

  reloadThings(event) {
    var search_string = this.route.params['_value'].search_string;

    this.myListService.search(search_string)
    .valueChanges
    .subscribe(
      ({data}) => {
        var obj = JSON.parse(JSON.stringify(data));
        var thingsArray = [];
        obj.search.map(thing => {
          thingsArray.push({"id_list": thing.id_list, "id": thing.id, "name": thing.name, "thingType": thing.thingType});
        });
        this.thingCount = thingsArray.length;
        this.things = thingsArray;
      },
      err => console.log('ERROR', err)
    );
  }

  cellColor(car) {
    //return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7)/1.3)*100)) + ')';
    return 'rgb(255, 255, 255)';
  };

  translations = <DataTableTranslations>{
    indexColumn: 'Index column',
    expandColumn: 'Expand column',
    selectColumn: 'Select column',
    paginationLimit: 'Max results',
    paginationRange: 'Result range'
  };
}
