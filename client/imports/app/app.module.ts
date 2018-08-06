import { NgModule, ErrorHandler }           from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsModule }                   from 'angular2-meteor-accounts-ui';
import { TextMaskModule }                   from 'angular2-text-mask';

import { App }       from './app';
import { AppRouter } from './app.router';

import { LoginService } from 'imports/services';

import { START_PAGES }   from '../pages/start';
import { OWNER_PAGES }   from '../pages/owner';
import { PARTNER_PAGES } from '../pages/partner';
import { CLIENT_PAGES }  from '../pages/client';
import { TASKS_PAGES }   from '../pages/tasks';

@NgModule({
  imports: [
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    AppRouter,
    AccountsModule,
    TextMaskModule
  ], 
  declarations: [
    App,
    START_PAGES,
    OWNER_PAGES,
    PARTNER_PAGES,
    CLIENT_PAGES,
    TASKS_PAGES
  ],
  providers: [
    ErrorHandler,
    LoginService
  ],
  bootstrap: [
    App,
  ],
})
export class AppModule {}