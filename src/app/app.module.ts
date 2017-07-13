import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ListDetailComponent } from './components/list-detail.page';
import { UserDetailComponent } from './components/user-detail.page';
import { UserListComponent } from './components/user-list.page';

import { ListService } from './services/list.service';
import { UserService } from './services/user.service';

import { UserRolesResolverService } from './services/roles-resolver.service';
import { CheckboxListComponent } from './components/checkbox-list.component';

const appRoutes: Routes = [
  {
    path: 'list/:id',
    component: ListDetailComponent,
    resolve: {
      allRoles: UserRolesResolverService
    }
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: {
      allRoles: UserRolesResolverService
    }
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [BrowserModule, HttpModule, ReactiveFormsModule, RouterModule.forRoot(appRoutes)],
  declarations: [AppComponent, UserDetailComponent, UserListComponent, ListDetailComponent, CheckboxListComponent],
  providers: [UserService, ListService, UserRolesResolverService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
