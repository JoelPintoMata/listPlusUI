import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environment';
import 'rxjs/add/operator/map';

@Injectable()
export class ListService {

  BASE_URL = environment.rest.apiUrlRoot;

  constructor(private http: Http) {
  }

  getLists(): Observable<List[]> {
    return this.http.get(`${this.BASE_URL}/lists`).map((res: Response) => <List[]>res.json());
  }

  getList(id: string): Observable<List> {
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
