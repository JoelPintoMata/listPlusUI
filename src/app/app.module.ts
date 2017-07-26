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

import { RolesResolverService } from './services/roles-resolver.service';
import { CheckboxListComponent } from './components/checkbox-list.component';

// TODO we just need the environment in order to get the default backend url
import { environment } from '../environment';

import { ApolloModule } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

const appRoutes: Routes = [
  {
    path: 'list/:id',
    component: ListDetailComponent,
    resolve: {
      allRoles: RolesResolverService
    }
  },
  {
    path: 'lists',
    component: ListListComponent
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
  //uri: 'https://vast-springs-18949.herokuapp.com/graphql',
  uri: 'https://localhost:8080/graphql',
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
    ApolloModule.forRoot(provideClient)
  ],
  declarations: [AppComponent, UserDetailComponent, UserListComponent, ListListComponent, ListDetailComponent, CheckboxListComponent],
  providers: [UserService, ListService, RolesResolverService],
  bootstrap: [AppComponent]
})

export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
