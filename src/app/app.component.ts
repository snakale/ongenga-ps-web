import { Component, OnInit } from '@angular/core';
// import { ipcRenderer } from 'electron';
import { ElectronService } from './services/electron.service';
import { ApplicationState } from './state/application-state.model';
import { Store } from '@ngrx/store';
import { LoadLoggedInUser } from './state/users/actions';
import { Router, Route } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  
  <ul class='app-debug-menu'>
    <li *ngFor="let route of appRoutes; let i = index">
      <a [routerLink]="route.path">{{route.path}}</a>
    </li>
  </ul>

  <router-outlet></router-outlet>
  
  `,
  styleUrls: ['./app.components.scss']
})
export class AppComponent implements OnInit {

  appRoutes: Route[];

  constructor(
    private electronService: ElectronService,
    private store: Store<ApplicationState>,
    private router: Router
  ) {}

  ngOnInit() {

    // If not in Electron
    if (!this.electronService.isElectron()) {
      this.appRoutes = this.router.config.filter( (el: Route) => el.path !== '' && el.path !== '**');
    } 
    
    this.store.dispatch( new LoadLoggedInUser() );
  }

}
