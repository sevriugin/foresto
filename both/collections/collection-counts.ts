import { MongoObservable } from 'meteor-rxjs';

import { Count } from '../models';

export const Counts = new MongoObservable.Collection <Count> ('counts');

// No need update counts on client.
Counts.deny ({
  insert(userId, doc) {
    return true;
  },
  update(userId, doc, fields, modifier) {
    return true;
  },
  remove(userId, doc) {
    return true;
  }
});