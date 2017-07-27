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

const QueryHeros = gql`
  query QueryHeros {
    hero {
      id
    }
  }
`;


const QueryMyLists = gql`
  query QueryMyLists {
    list {
      id
      name
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

  getMyLists(): ApolloQueryObservable<MyList> {
    console.log('myList.service: getMyLists');

    var result = this.apollo.watchQuery<QueryResponse>({
      query: QueryMyLists
    }).subscribe(({data}) => {
      this.loading = data.loading;
      this.list = data.list;
      alert(this.list)
    });

    return this.list;
  }

  getMyList(id: string): Observable<MyList> {
    return this.http.get(`${this.BASE_URL}/myList/${id}`).map((res: Response) => <MyList>res.json());
  }

  addMyList(myList: MyList): Observable<MyList> {
    return this.http.post(`${this.BASE_URL}/myListsa`, myList).map((res: Response) => <MyList>res.json());
  }

  updateMyList(myList: MyList): Observable<MyList> {
    return this.http.put(`${this.BASE_URL}/myListsb/${myList.id}`, myList).map((res: Response) => <MyList>res.json());
  }

  saveMyList(myList: MyList): Observable<MyList> {
    if (myList.id) {
      return this.updateMyList(myList);
    } else {
      return this.addMyList(myList);
    }
  }
}

export class MyList {
  id?: string;
  items: Item[];
  name: string;
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
