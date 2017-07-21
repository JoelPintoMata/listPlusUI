import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environment';
import 'rxjs/add/operator/map';

import { Resolve } from '@angular/router';
@Injectable()
export class RolesResolverService implements Resolve<Role[]> {

  constructor(private http: Http) {
  }

  resolve(): Observable<Role[]> {
    return this.http.get(`${environment.rest.apiUrlRoot}/roles`).map((res: Response) => <Role[]>res.json());
  }
}

export class Role {
  id: string;
  description: string;
}
