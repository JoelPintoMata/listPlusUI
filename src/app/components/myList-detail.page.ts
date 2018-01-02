import{Component, ViewChild, OnInit}from '@angular/core';

import {ActivatedRoute, Params, Router}from '@angular/router';

import {DataTable, DataTableTranslations, DataTableResource} from 'angular-4-data-table';

import {ApolloQueryObservable }from 'apollo-angular';
import {Observable }from 'rxjs/Observable';

import {MyList, Item, MyListService}from '../services/myList.service';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import {Http, Response, Headers}from '@angular/http';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'if-myList-detail',
  templateUrl: './myList-detail.page.html',
  styleUrls: [
      './myList-detail.page.css'
  ]
})

export class MyListDetailComponent {

    headers = new Headers();

    isNew = false;
    myList: MyList;

    image: SafeResourceUrl;

    items = [];
    itemCount = 0;

    @ViewChild(DataTable) itemsTable;

    constructor(private http: Http,
      private sanitizer: DomSanitizer,
      private myListService: MyListService,
      private route: ActivatedRoute,
      private router: Router) {

      this.getQRCode();
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

    getQRCode() {
      console.log('myList-detail: getQRCode');
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Access-Control-Allow-Origin', '*');

      let url = "http://localhost:8080/generateAndGetString";
      this.http.post(url,
        {name:"name", url:"url"},
        {headers: this.headers})
        .subscribe(res => {
          var obj = JSON.parse(JSON.stringify(res));
//          this.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL('data:image/png;base64,' + obj._body))

          this.image = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + obj._body);
        });
    }
}
