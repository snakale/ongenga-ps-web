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
    path: 'home', 
    canActivate: [LoginRouteGuard],
    loadChildren: './components/home/home.component.module#HomeComponentModule'
  },
  {
    path: 'login', 
    loadChildren: './components/login/login.component.module#LoginComponentModule',
  },
  { 
    path: 'academic', 
    canActivate: [LoginRouteGuard],
    loadChildren: './components/academic/academic.component.module#AcademicComponentModule'
  },
  { 
    path: 'students', 
    canActivate: [LoginRouteGuard],
    loadChildren: './components/students/students.component.module#StudentsComponentModule'
  },
  { 
    path: '', 
    canActivate: [LoginRouteGuard],
    loadChildren: './components/home/home.component.module#HomeComponentModule'
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
