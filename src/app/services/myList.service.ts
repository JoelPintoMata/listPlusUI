import { Injectable, Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environment';
import 'rxjs/add/operator/map';

import { Apollo } from 'apollo-angular';
import { ApolloModule, ApolloQueryObservable } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

import gql from 'graphql-tag';


interface QueryResponse{
  list
  loading
}

const QueryMyLists = gql`
  query QueryMyLists {
    myList {
      _id
      id
      name
    }
  }
`;

const QueryMyList = gql`
  query QueryMyList($id: String!, $sortBy: String, $sortAsc: Boolean) {
    myList(id: $id, sortBy: $sortBy, sortAsc: $sortAsc) {
      _id
      id
      name
      items {
        id
        name
        quantity
        order
      }
    }
  }
`;

const QueryItem = gql`
  query QueryItem($_id: String!, $id_item: String!) {
    item(_id: $_id, id_item: $id_item) {
      _id
      id
      name
      quantity
      order
    }
  }
`;

@Injectable()
export class MyListService {

  list: any;
  loading: boolean;

  BASE_URL = environment.rest.apiUrlRoot;

  constructor(private http: Http, private apollo: Apollo) {
    console.log('myList.service: constructor');
    this.apollo = apollo;
  }

  getMyLists(): ApolloQueryObservable<MyList[]> {
    var result = this.apollo.watchQuery({
      query: QueryMyLists
    });
    return result;
  }

  getMyList(myListId: string, myListItemsOrderBy: string, myListItemsSortAsc: boolean): ApolloQueryObservable<MyList[]> {
    var result = this.apollo.watchQuery({
      query: QueryMyList,
//      check https://www.apollographql.com/docs/react/basics/queries.html#graphql-query-options for other fetch options
      fetchPolicy: 'network-only',
      variables: {
        id: myListId,
        sortBy: myListItemsOrderBy,
        sortAsc: myListItemsSortAsc
      }
    });
    return result;
  }

  getItem(_id: string, id_item: string): ApolloQueryObservable<Item[]> {
    var result = this.apollo.watchQuery({
      query: QueryItem,
      fetchPolicy: 'network-only',
      variables: {
        _id: _id,
        id_item: id_item
      }
    });
    return result;
  }

  addMyList(myList: MyList): Observable<MyList> {
    return this.http.post(`${this.BASE_URL}/myListsa`, myList).map((res: Response) => <MyList>res.json());
  }

  updateMyList(myList: MyList): Observable<MyList> {
    return this.http.put(`${this.BASE_URL}/myListsb/${myList.id}`, myList).map((res: Response) => <MyList>res.json());
  }

  addItem(item: Item): Observable<Item> {
    return this.http.post(`${this.BASE_URL}/itema`, item).map((res: Response) => <Item>res.json());
  }

  updateItem(item: Item): Observable<Item> {
    return this.http.put(`${this.BASE_URL}/itemb/${item.id}`, item).map((res: Response) => <Item>res.json());
  }

  saveMyList(myList: MyList): Observable<MyList> {
    if (myList.id) {
      return this.updateMyList(myList);
    } else {
      return this.addMyList(myList);
    }
  }

  saveItem(item: Item): Observable<Item> {
    if (item.id) {
      return this.updateItem(item);
    } else {
      return this.addItem(item);
    }
  }
}

export class MyList {
  _id: string;
  id: string;
  name: string;
  items: Item[];

  setMyList(id: string, name: string, items: Item[]) {
    this.id = id;
    this.name = name;
    this.items = items;
  }
}

export class Item {
  _id: string;
  id: string;
  name: string;
  order: string;
  quantity?: string;
}
