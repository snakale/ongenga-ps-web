import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
// import { ipcRenderer } from 'electron';
import { ElectronService } from './services/electron.service';
import { ApplicationState } from './state/application-state.model';
import { Store } from '@ngrx/store';
import { LoadLoggedInUser, LogUserOut } from './state/users/actions';
import { Router, Route } from '@angular/router';
import { catchError, first, map } from 'rxjs/operators';
import { of as ObservableOf} from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
  
  <ul class='app-debug-menu' #appDebugMenu>
    <li *ngFor="let route of appRoutes; let i = index" [ngClass]="checkIfLogin(route)">
      <a [routerLink]="route.path">{{route.path}}</a>
    </li>
  </ul>

  <router-outlet></router-outlet>
  
  `,
  styleUrls: ['./app.components.scss']
})
export class AppComponent implements OnInit {

  appRoutes: Route[];

  @ViewChild('appDebugMenu') appDebugMenuRef: ElementRef;

  constructor(
    private electronService: ElectronService,
    private store: Store<ApplicationState>,
    private router: Router,
    private renderer: Renderer2
  ) {}

  checkIfLogin(route) {
    return route.path === 'login' ? 'hidden' : '';
  }

  ngOnInit() {

    // If not in Electron
    if (!this.electronService.isElectron()) {
      this.appRoutes = this.router.config.filter( (el: Route) => el.path !== '' && el.path !== '**');
    } 
    
    this.store.dispatch( new LoadLoggedInUser() );

    setTimeout( async () => this.addLogoutLink(), 200);
  }

  async addLogoutLink() {
    const loggedInUser = await this.store.select('users').pipe(
      first(),
      map(usersState => usersState.loggedInUser),
      catchError( e => ObservableOf(false))
    ).toPromise();

    if (loggedInUser) {
      const li = this.renderer.createElement('li');
      const a = this.renderer.createElement('a');
      const text = this.renderer.createText('Logout');
      this.renderer.appendChild(a, text);
      this.renderer.appendChild(li, a);
      this.renderer.appendChild(this.appDebugMenuRef.nativeElement, li);
      this.renderer.listen(a, 'click', (e) => {
        this.router.navigateByUrl('login');
        this.store.dispatch(new LogUserOut());        
      });
    }
  }

}
