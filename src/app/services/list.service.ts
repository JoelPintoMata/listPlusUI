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
  {
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
  }

  // by default, this client will send queries to `/graphql` (relative to the URL of your app)
  provideClient(): ApolloClient {
    console.log('list.service: provideClient');
    return new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: 'http://localhost:8080'
      }),
    });
  }

  getLists(): Observable<List[]> {
    console.log('list.service: this.apollo ' + this.apollo);
    var result = this.apollo.watchQuery({
      query: QueryList
    }).subscribe((data) => {
        console.log(data);
    }, (err) => alert(err));

    console.log("result " + result);

    var convertedString=JSON.stringify(result)
    console.log("convertedString " + convertedString);

    console.log("convertedString " + String(result));
    console.log("convertedString " + String(convertedString));
    console.log("convertedString " + JSON.stringify(result));
    console.log("convertedString " + JSON.stringify(convertedString));

    return this.http.get(`${this.BASE_URL}/lists`).map((res: Response) => <List[]>res.json());
  }

  getList(id: string): Observable<List> {
    console.log('list.service: getList ' + QueryList + ' id ' + id);
    console.log('list.service: QueryList');
    var result = this.apollo.watchQuery<QueryResponse>({
      query: QueryList
    });
    console.log("result " + result);
    return this.http.get(`${this.BASE_URL}/lists/${id}`).map((res: Response) => <List>res.json());
  }

  addList(list: List): Observable<List> {
    return this.http.post(`${this.BASE_URL}/lists`, list).map((res: Response) => <List>res.json());
  }

  updateList(list: List): Observable<List> {
    return this.http.put(`${this.BASE_URL}/lists/${list.id}`, list).map((res: Response) => <List>res.json());
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
