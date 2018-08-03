import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Meteor }                 from 'meteor/meteor';
import { MeteorObservable }       from 'meteor-rxjs';

import 'zone.js';
import 'reflect-metadata';
import 'angular2-meteor-polyfills';

import { AppModule } from './imports/app/app.module';

Meteor.startup(() => {
  //->
  //Meteor.subscribe('users', () => console.log(Meteor.users.find().count()));
  MeteorObservable.subscribe('users').subscribe(() => console.log(Meteor.users.find().count()));
  console.log(Meteor.users.find().count());

  const subscription = MeteorObservable.autorun().subscribe(() => {
    if (Meteor.loggingIn()) {
      return;
    }
    setTimeout(() => subscription.unsubscribe());

    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.log(err));
  });
});