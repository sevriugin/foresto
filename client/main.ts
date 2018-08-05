import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Meteor }                 from 'meteor/meteor';
import { MeteorObservable }       from 'meteor-rxjs';

import 'zone.js';
import 'reflect-metadata';
import 'angular2-meteor-polyfills';

import { AppModule } from './imports/app/app.module';

import 'both/methods';

Meteor.startup(() => {
  const subscription = MeteorObservable.autorun().subscribe(() => {
    if (Meteor.loggingIn()) {
      return;
    }
    setTimeout(() => subscription.unsubscribe());

    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.log(err));
  });
});