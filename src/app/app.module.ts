import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { MyListDetailComponent } from './components/myList-detail.page';
import { UserDetailComponent } from './components/user-detail.page';
import { MyListListComponent } from './components/myList-list.page';
import { UserListComponent } from './components/user-list.page';

import { MyListService } from './services/myList.service';
import { UserService } from './services/user.service';

import { RolesResolverService } from './services/roles-resolver.service';
import { CheckboxListComponent } from './components/checkbox-list.component';

// TODO we just need the environment in order to get the default backend url
import { environment } from '../environment';

import { ApolloModule } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DataTableModule } from 'angular-4-data-table';
import { DataTableDemo3 } from './components/data-table-demo3';

const appRoutes: Routes = [
  {
    path: 'myList/data-table-demo3/:id',
    component: DataTableDemo3
  },
  {
    path: 'myList/:id',
    component: MyListDetailComponent
  },
  {
    path: 'myLists',
    component: MyListListComponent
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: {
      allRoles: RolesResolverService
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

const networkInterface = createNetworkInterface({
  uri: 'http://vast-springs-18949.herokuapp.com/graphql',
  // uri: 'http://localhost:8080/graphql',
  // do we need this option to enable CORS?
  opts: {
    // Additional fetch options like `credentials` or `headers`
    headers: 'Access-Control-Allow-Origin: *',
  }
});

// by default, this client will send queries to `/graphql` (relative to the URL of your app)
const client = new ApolloClient({
  networkInterface,
});

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  imports: [BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    ApolloModule.forRoot(provideClient),
    DataTableModule
  ],
  declarations: [AppComponent, UserDetailComponent, UserListComponent, MyListDetailComponent, MyListListComponent, CheckboxListComponent, DataTableDemo3],
  providers: [UserService, MyListService, RolesResolverService],
  bootstrap: [AppComponent]
})

export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
