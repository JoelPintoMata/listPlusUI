import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environment';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  BASE_URL = environment.rest.apiUrlRoot;

  constructor(private http: Http) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get(`${this.BASE_URL}/users`).map((res: Response) => <User[]>res.json());
  }

  getUser(id: string): Observable<User> {
    return this.http.get(`${this.BASE_URL}/users/${id}`).map((res: Response) => <User>res.json());
  }

  addUser(user: User): Observable<User> {
    return this.http.post(`${this.BASE_URL}/users`, user).map((res: Response) => <User>res.json());
  }

  updateUser(user: User): Observable<User> {
    return this.http.put(`${this.BASE_URL}/users/${user.id}`, user).map((res: Response) => <User>res.json());
  }

  saveUser(user: User): Observable<User> {
    if (user.id) {
      return this.updateUser(user);
    } else {
      return this.addUser(user);
    }
  }
}

export class User {
  id?: string;
  userName: string;
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
