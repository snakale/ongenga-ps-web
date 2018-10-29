import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRouteGuard } from './services/login-route.gaurd';

const routes: Routes = [
  { 
    path: 'admin', 
    canActivate: [LoginRouteGuard],
    loadChildren: './components/admin/admin.component.module#AdminComponentModule'
  },
  {
    path: 'login', 
    loadChildren: './components/login/login.component.module#LoginComponentModule',
  },
  { 
    path: 'mark-sheets', 
    canActivate: [LoginRouteGuard],
    loadChildren: './components/academic/academic.component.module#AcademicComponentModule'
  },
  { 
    path: '', 
    canActivate: [LoginRouteGuard],
    loadChildren: './components/academic/academic.component.module#AcademicComponentModule'
  },
  { 
    path: '**', 
    loadChildren: './components/error/error.component.module#ErrorComponentModule' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false, /*preloadingStrategy: PreloadAllModules*/})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
