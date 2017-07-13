import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService, User } from '../services/user.service';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';

@Component({
  selector: 'if-user-list',
  templateUrl: './user-list.page.html'
})
export class UserListComponent implements OnInit {
  users: Observable<User[]>;
  isLoading = false;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.users = this.userService.getUsers().finally(() => this.isLoading = false);
  }
}
