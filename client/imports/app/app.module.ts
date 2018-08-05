import { NgModule, ErrorHandler }           from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsModule }                   from 'angular2-meteor-accounts-ui';

import { App }       from './app';
import { AppRouter } from './app.router';

import { LoginService } from 'imports/services';

import { START_PAGES }   from '../pages/start';
import { OWNER_PAGES }   from '../pages/owner';
import { PARTNER_PAGES } from '../pages/partner';
import { TASKS_PAGES }   from '../pages/tasks';

@NgModule({
  imports: [
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    AppRouter,
    AccountsModule
  ], 
  declarations: [
    App,
    START_PAGES,
    OWNER_PAGES,
    PARTNER_PAGES,
    TASKS_PAGES
  ],
  providers: [
    ErrorHandler,
    LoginService
  ],
  bootstrap: [
    App,
  ]  
})
export class AppModule {}