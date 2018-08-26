import { NgModule, ErrorHandler }           from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsModule }                   from 'angular2-meteor-accounts-ui';
import { TextMaskModule }                   from 'angular2-text-mask';
import { Ng2PaginationModule }              from 'ng2-pagination';

import { App }       from './app';
import { AppRouter } from './app.router';

import { LOGIN_SERVICES } from 'imports/services';

import { LOGIN_DASHBOARDS } from '../dashboards/login';

import { START_PAGES }   from '../pages/start';
import { OWNER_PAGES }   from '../pages/owner';
import { PARTNER_PAGES } from '../pages/partner';
import { CLIENT_PAGES }  from '../pages/client';
import { TASKS_PAGES }   from '../pages/tasks';
import { TOKEN_PAGES }   from '../pages/token';
import { SUBPOOL_PAGES }   from '../pages/subpool';

@NgModule({
  imports: [
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    AppRouter,
    AccountsModule,
    Ng2PaginationModule,    
    TextMaskModule
  ], 
  declarations: [
    App,
    LOGIN_DASHBOARDS,
    START_PAGES,
    OWNER_PAGES,
    PARTNER_PAGES,
    CLIENT_PAGES,
    TASKS_PAGES,
    TOKEN_PAGES,
    SUBPOOL_PAGES
  ],
  providers: [
    ErrorHandler,
    LOGIN_SERVICES
  ],
  bootstrap: [
    App,
  ],
})
export class AppModule {}