import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartPage }                                    from '../pages/start';
import { RolesPage }                                    from '../pages/roles';
import { OwnerRegisterPage, OwnerLoginPage, OwnerPage } from '../pages/owner';
import { TasksPage, TaskDetails }                       from '../pages/tasks';

export const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'start',            component: StartPage },
  { path: 'roles',            component: RolesPage },
  { path: 'owner-register',   component: OwnerRegisterPage },
  { path: 'owner-login/:_id', component: OwnerLoginPage },
  { path: 'owner',            component: OwnerPage },
  { path: 'tasks',            component: TasksPage },
  { path: 'task/:taskId',     component: TaskDetails },
  //{ path: 'tasks',          component: TasksPage,   canActivate: ['loggedOut'] },
  //{ path: 'task/:taskId',   component: TaskDetails, canActivate: ['loggedIn'] },
  //{ path: '', redirectTo: '/roles', pathMatch: 'full' }
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
  