import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table-bootstrap-4';

import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { MyList, Item, MyListService }from '../services/myList.service';

import { Observable }from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  selector: 'if-myList-detail-client',
  templateUrl: './myList-detail-client.page.html',
  styleUrls: [
      './myList-detail-client.page.css'
  ]
})

export class MyListDetailClientComponent {

    headers = new HttpHeaders();

    isNew = false;
    myList: MyList;

    image: SafeResourceUrl;

    items = [];
    itemCount = 0;

    @ViewChild(DataTable) itemsTable;

    constructor(private http: HttpClient,
      private sanitizer: DomSanitizer,
      private myListService: MyListService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    reloadItems(event) {
        var id = this.route.params['_value'].id;
        var view = this.route.params['_value'].view;
        var sortBy = this.route.params['_value'].sortBy;
        var sortAsc = this.route.params['_value'].sortAsc;

        this.myListService.getMyList(id, sortBy, sortAsc)
          .valueChanges
          .subscribe(({data}) => {
            var obj = JSON.parse(JSON.stringify(data));
            var itemsArray = [];
            obj.myList[0].items.map(item => {
              itemsArray.push({"id_list": obj.myList[0].id, "id": item.id, "name": item.name, "description": item.description, "order": item.order, "quantity": item.quantity});
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

      let url = "http://rest-qr-code-generator.herokuapp.com/generateAndGetString";
      this.http.post(url,
        {name:"name", url:"url"},
        {headers: this.headers})
        .subscribe(res => {
          var obj = JSON.parse(JSON.stringify(res));
          this.image = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + obj._body);
        });
    }
}
