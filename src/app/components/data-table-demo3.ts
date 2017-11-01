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
    }

    reloadFilms(params) {
        this.films[0] = null;
        this.films = null;

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
            console.log("DataTableDemo3: reloadFilms, obj.myList[0].id : " + obj.myList[0].id);
            console.log("DataTableDemo3: reloadFilms, obj.myList[0].name : " + obj.myList[0].name);
            console.log("DataTableDemo3: reloadFilms, obj.myList[0].items[0].id : " + obj.myList[0].items[0].id);
            console.log("DataTableDemo3: reloadFilms, obj.myList[0].items[0].name : " + obj.myList[0].items[0].name);
            console.log("DataTableDemo3: reloadFilms, obj.myList[0].items[1].id : " + obj.myList[0].items[1].id);
            console.log("DataTableDemo3: reloadFilms, obj.myList[0].items[1].name : " + obj.myList[0].items[1].name);

            var dataTableDemo3Data = this.filmResource.query(params).then(films => this.films = films);
            console.log("DataTableDemo3: reloadFilms, dataTableDemo3Data : " + dataTableDemo3Data);
            console.log("DataTableDemo3: reloadFilms, dataTableDemo3Data[0] : " + dataTableDemo3Data[0]);
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
