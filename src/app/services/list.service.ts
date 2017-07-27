import { Injectable, Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environment';
import 'rxjs/add/operator/map';

import { Apollo } from 'apollo-angular';
import { ApolloModule } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

import gql from 'graphql-tag';


interface QueryResponse{
  hero
  loading
}

const QueryList = gql`
  query QueryList {
    hero {
      id
    }
  }
`;

@Injectable()
export class ListService {

  BASE_URL = environment.rest.apiUrlRoot;

  constructor(private http: Http, private apollo: Apollo) {
    console.log('list.service: constructor');
    this.apollo = apollo;
  }

  getLists(): Observable<List[]> {
    console.log('list.service: getLists');
    var result = this.apollo.watchQuery({
      query: QueryList
    }).subscribe((data) => {
        console.log(data);
    }, (err) => alert(err));

    return this.http.get(`${this.BASE_URL}/listsc`).map((res: Response) => <List[]>res.json());
  }

  getList(id: string): Observable<List> {
    return null;
  }

  addList(list: List): Observable<List> {
    return this.http.post(`${this.BASE_URL}/listsa`, list).map((res: Response) => <List>res.json());
  }

  updateList(list: List): Observable<List> {
    return this.http.put(`${this.BASE_URL}/listsb/${list.id}`, list).map((res: Response) => <List>res.json());
  }

  saveList(list: List): Observable<List> {
    if (list.id) {
      return this.updateList(list);
    } else {
      return this.addList(list);
    }
  }
}

export class List {
  id?: string;
  items: Item[];
  listName: string;
  password?: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  streetName: string;
  houseNumber: number;
  city: string;
  birthDate: Date;
  roles: string[];
}

export class Item {
  id?: string;
  name: string;
  order?: string;
  quantity?: string;
}

export class Hero {
  id: string;
  name: string;
}
