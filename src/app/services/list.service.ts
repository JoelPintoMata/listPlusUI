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
  currentUser
  loading
}

const queryList = gql`
  query list {
    currentUser {
      login
      avatar_url
    }
  }
`;

@Injectable()
export class ListService {

  BASE_URL = environment.rest.apiUrlRoot;

  constructor(private http: Http, private apollo: Apollo) {
  }

  // by default, this client will send queries to `/graphql` (relative to the URL of your app)
  provideClient(): ApolloClient {
    return new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: 'http://localhost:8080'
      }),
    });
  }

  getLists(): Observable<List[]> {
    var xxx = this.apollo.watchQuery<QueryResponse>({
      query: queryList
    });
    console.warn("xxx " + xxx);
    return this.http.get(`${this.BASE_URL}/lists`).map((res: Response) => <List[]>res.json());
  }

  getList(id: string): Observable<List> {
    var xxx = this.apollo.watchQuery<QueryResponse>({
      query: queryList
    });
    console.warn("xxx " + xxx);
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
