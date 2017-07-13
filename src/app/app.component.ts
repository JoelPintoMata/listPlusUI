import { Component } from '@angular/core';

@Component({
  selector: 'if-app',
  template: `
    <div class="container">
      <h1>My Lists</h1>
      <router-outlet></router-outlet>
    </div>`
})
export class AppComponent { }
