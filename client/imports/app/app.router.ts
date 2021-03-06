import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartPage }                                    from '../pages/start';
import { OwnerRegisterPage, OwnerLoginPage, OwnerPage } from '../pages/owner';
import { PartnerLoginPage, PartnerPage }                from '../pages/partner';
import { ClientLoginPage, ClientPage }                  from '../pages/client';
import { TasksPage, TaskDetails }                       from '../pages/tasks';
import { TokenDetails }                                 from '../pages/token';
import { SubPoolDetails }                               from '../pages/subpool';

export const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'start',              component: StartPage },
  { path: 'owner-register',     component: OwnerRegisterPage },
  { path: 'owner-login/:_id',   component: OwnerLoginPage },
  { path: 'owner',              component: OwnerPage },
  { path: 'partner-login/:_id', component: PartnerLoginPage },
  { path: 'partner',            component: PartnerPage },
  { path: 'client-login/:_id',  component: ClientLoginPage },
  { path: 'client',             component: ClientPage },
  { path: 'tasks',              component: TasksPage },
  { path: 'task/:taskId',       component: TaskDetails },
  { path: 'token/:tokenId',     component: TokenDetails },
  { path: 'subpool/:subPoolId', component: SubPoolDetails },
  //{ path: 'task/:taskId', component: TaskDetails, canActivate: ['loggedIn'] },
];
  
export const ROUTES_PROVIDERS = [
  {
    provide: 'loggedIn',
    useValue: () => !! Meteor.userId()
  },
  {
    provide: 'loggedOut',
    useValue: () => ! Meteor.userId()
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ ROUTES_PROVIDERS ]
})
export class AppRouter {}
  