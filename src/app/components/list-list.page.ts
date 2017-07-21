import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ListService, List } from '../services/list.service';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';

@Component({
  selector: 'if-list-list',
  templateUrl: './list-list.page.html'
})

export class ListListComponent implements OnInit {
  lists: Observable<List[]>;
  isLoading = false;

  constructor(private listService: ListService, private router: Router) {
    console.log('list-list: constructor');
  }

  ngOnInit() {
    console.log('list-list: ngOnInit');
    this.getLists();
  }

  getLists() {
    console.log('list-list: getLists');
    this.isLoading = true;
    this.lists = this.listService.getLists().finally(() => this.isLoading = false);
  }
}
