
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { UsersEffects } from './users/effects';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './app-reducers';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SchoolSubjectsEffects } from './subjects/effects';
import { StudentsStateEffects } from './students/effects';

@NgModule({
  declarations: [], 
  imports: [
    EffectsModule.forRoot([
      UsersEffects,
      SchoolSubjectsEffects,
      StudentsStateEffects
    ]),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ]
})
export class StateModule {

    constructor(@Optional() @SkipSelf() parentModule: StateModule) {
      if (parentModule) {
        throw new Error(
          'StateModule is already loaded. Import it in the AppModule only');
      }
    }
  
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: StateModule,
        providers: []
      };
    }
}
