import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { createHttpLink } from 'apollo-link-http';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DataTableModule } from 'angular-4-data-table-bootstrap-4';

import { ItemDetailComponent } from './components/item-detail.page';
import { MyListDetailClientComponent } from './components/myList-detail-client.page';
import { MyListDetailAdminComponent } from './components/myList-detail-admin.page';
import { UserDetailComponent } from './components/user-detail.page';
import { MyListListComponent } from './components/myList-list.page';
import { MainNavBarComponent } from './components/mainNavBar.page';
import { SearchResultComponent } from './components/search-result.page';
import { UserListComponent } from './components/user-list.page';

import { MyListService } from './services/myList.service';
import { UserService } from './services/user.service';
import { RolesResolverService } from './services/roles-resolver.service';

import { environment } from '../environment';

const appRoutes: Routes = [
  {
    path: 'search/:search_string',
    component: SearchResultComponent
  },
  {
    path: 'myList/:id_list/item/:id/role/:role/mode/:mode',
    component: ItemDetailComponent
  },
  {
    path: 'myList/:id/role/client',
    component: MyListDetailClientComponent
  },
  {
    path: 'myList/:id/role/admin',
    component: MyListDetailAdminComponent
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
    redirectTo: '/myLists',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ApolloModule,
    DataTableModule
  ],
  declarations: [AppComponent, UserDetailComponent, UserListComponent, MainNavBarComponent, SearchResultComponent, MyListDetailAdminComponent, MyListDetailClientComponent, ItemDetailComponent, MyListListComponent],
  providers: [UserService, MyListService, RolesResolverService],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(
    apollo: Apollo,
  ) {
    apollo.create({
      link: createHttpLink({ uri: 'http://vast-springs-18949.herokuapp.com/graphql' }),
      //link: httpLink.create({ uri: 'http://localhost:8080/graphql' }),
      cache: new InMemoryCache()
    });
  }
}

platformBrowserDynamic().bootstrapModule(AppModule);
