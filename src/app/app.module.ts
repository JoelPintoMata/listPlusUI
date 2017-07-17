import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ListDetailComponent } from './components/list-detail.page';
import { UserDetailComponent } from './components/user-detail.page';
import { ListListComponent } from './components/list-list.page';
import { UserListComponent } from './components/user-list.page';

import { ListService } from './services/list.service';
import { UserService } from './services/user.service';

import { UserRolesResolverService } from './services/roles-resolver.service';
import { CheckboxListComponent } from './components/checkbox-list.component';

import { ApolloModule } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


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
    path: 'lists',
    component: ListListComponent
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

// by default, this client will send queries to `/graphql` (relative to the URL of your app)
const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8080'
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  imports: [BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    ApolloModule.forRoot(provideClient)
  ],
  declarations: [AppComponent, UserDetailComponent, UserListComponent, ListListComponent, ListDetailComponent, CheckboxListComponent],
  providers: [UserService, ListService, UserRolesResolverService],
  bootstrap: [AppComponent]
})

export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
