import { Injectable, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { environment } from '../../environment';
import 'rxjs/add/operator/map';

import { Apollo } from 'apollo-angular';
import { ApolloModule } from 'apollo-angular';
import { ApolloClient, ApolloQueryResult } from 'apollo-client';

import gql from 'graphql-tag';

interface QueryResponse{
  list
  loading
}

const Search = gql`
  query Search($search_string: String!) {
    search(search_string: $search_string) {
      id
      _id
      id_list
      id_item
      name
      thingType
    }
  }
`;

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
  query QueryMyList($id_list: String!, $sortBy: String, $sortAsc: Boolean) {
    myList(id_list: $id_list, sortBy: $sortBy, sortAsc: $sortAsc) {
      _id
      id
      name
      items {
        id
        name
        description
        quantity
        order
      }
    }
  }
`;

const QueryItem = gql`
  query QueryItem($id_list: String!, $id_item: String!) {
    item(id_list: $id_list, id_item: $id_item) {
      id_list
      id
      images
      name
      description
      quantity
      order
    }
  }
`;

const UpdateItem = gql`
  mutation UpdateItem($id_list: String!, $id: String!, $name: String!, $description: String!, $quantity: Int!, $order: Int!) {
    updateItem(id_list: $id_list, id_item: $id, name: $name, description: $description, quantity: $quantity, order: $order) {
      id
      images
      name
      description
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

  constructor(private http: HttpClient, private apollo: Apollo) {
    console.log('myList.service: constructor');
    this.apollo = apollo;
  }

  getMyLists() {
    return this.apollo.watchQuery({
      query: QueryMyLists
    });
  }

  getMyList(myListId: string, myListItemsOrderBy: string, myListItemsSortAsc: boolean) {
    return this.apollo.watchQuery({
      query: QueryMyList,
//      check https://www.apollographql.com/docs/react/basics/queries.html#graphql-query-options for other fetch options
      fetchPolicy: 'network-only',
      variables: {
        id_list: myListId,
        sortBy: myListItemsOrderBy,
        sortAsc: myListItemsSortAsc
      }
    });
  }

  getItem(id_list: string, id: string) {
    return this.apollo.watchQuery({
      query: QueryItem,
      fetchPolicy: 'network-only',
      variables: {
        id_list: id_list,
        id_item: id
      }
    });
  }

  updateItem(item: Item): Observable<ApolloQueryResult<Item>> {
    return this.apollo.mutate({
      mutation: UpdateItem,
      variables: {
        id_list: item.id_list,
        id: item.id,
        images: item.images,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        order: item.order
      }
    })
  }

  saveItem(item: Item): Observable<ApolloQueryResult<Item>> {
    if (item.id) {
      return this.updateItem(item);
//    } else {
//      return this.addItem(item);
    }
  }

  search(search_string: string): Observable<ApolloQueryResult<Thing>> {
    return this.apollo.query({
      query: Search,
      fetchPolicy: 'network-only',
      variables: {
        search_string: search_string
      }
    });
  }
}

export class Thing {
  id: string;
  _id: string;
  id_list: string;
  id_item: string;
  name: string;
  thingType: string;
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
  id_list: string;
  id: string;
  images: string[];
  name: string;
  description: string;
  quantity?: string;
  order: string;
}
