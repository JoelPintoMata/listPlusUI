import { Component } from '@angular/core';

@Component({
  selector: 'if-app',
  template: `
    <div class="container">
      <br>
      <router-outlet></router-outlet>
    </div>`
})
export class AppComponent { }
